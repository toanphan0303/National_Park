import React, {Component} from 'react';
import fetchPopularTrips from './queries/fetchPopularTrips'
import fetchCurrentUser from './queries/CurrentUser'
import addFollowTrip from './mutations/addFollowTrip'
import {graphql, compose} from 'react-apollo';
import AuthModal from './modals/AuthMo.js'
import _ from 'lodash'
import {Dimmer, Loader, Card,Rating, Image, Button} from 'semantic-ui-react'
class PopularTrips extends Component {
  constructor(props){
    super(props)
    this.state ={
      popularTrips: [],
      remainPopularTrips:[],
      userFollowTrips:[]
    }
    this.renderPopularTrips = this.renderPopularTrips.bind(this)
    this.getRemainActPoint = this.getRemainActPoint.bind(this)
  }
  componentWillReceiveProps = async(nextProps) =>{
    if(nextProps.data.popularTrips){
      await this.setState({
        popularTrips:nextProps.data.popularTrips,
      })
    }
    if(nextProps.user.user){
      return this.getRemainActPoint(nextProps.user.user.follows)
    }else{
      return await this.setState({
        remainPopularTrips: this.state.popularTrips
      })
    }
  }
  getRemainActPoint = async(userFollowTrips) =>{
    const temp = _.differenceBy(this.state.popularTrips, userFollowTrips, 'id')
    await this.setState({
      remainPopularTrips: temp
    })
  }
  openLogin(){
    this.child.openModalLogin()
  }
  handleAddFollowTrip = async(e) =>{
    if(!this.props.user.user){
      return this.openLogin()
    }
    const tripId = e.target.id
    const {id} = this.props.user.user
    await this.props.addFollowTrip({
      variables:{
        id,
        tripId
      },
      refetchQueries: [{query:fetchPopularTrips},{query:fetchCurrentUser}]
    })
  }
  renderPopularTrips(){
    return this.state.remainPopularTrips.map(({id,title,tripImage, user, rates}) =>{
      const mean = _.meanBy(rates, entry =>{
        return entry.rated
      })
      return(
        <div key={id}>
          <Card style={{margin: '10px 10px', width:'250px', borderWidth:'thin', borderStyle:'solid', borderColor:'rgba(34,36,38,.15)'}}>
            <Image src={tripImage} href={`/#/trips/${id}/tripreview`} />
            <div  style={{display:'inherit'}}>
              <div>
                <Card.Header>
                  {title}
                </Card.Header>
                <Card.Description>
                   Created by: {user.firstName} {user.lastName}
                </Card.Description>
                <Card.Description style={{display:'inline-flex'}}>
                  <Rating icon='star' maxRating={5} disabled defaultRating={mean} size='mini' />
                  <p style={{marginTop:'-4px', marginLeft:'5px', fontSize:'13px'}}> {rates.length}</p>
                </Card.Description>
              </div>
              <div style={{margin:'auto'}} >
                <Button id={id} onClick={this.handleAddFollowTrip.bind(this)}basic color='green' size='mini'>Follow</Button>
              </div>
            </div>
          </Card>
        </div>
      )
    })
  }
  render(){
    if(!this.props.data.popularTrips){
      return(
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return(
      <div style={{paddingTop: '10px'}}>
        <h2>Popular Trips</h2>
        <div className="col s12 m6 l3">
          <Card.Group>
            {this.renderPopularTrips()}
          </Card.Group>
        </div>
        <div>
          <AuthModal
            onRef={ref =>{this.child = ref}}
          />
        </div>
      </div>
    )
  }
}

export default compose (
  graphql(fetchPopularTrips, {name:'data'}),
  graphql(fetchCurrentUser, {
      name:'user'
    }),
  graphql(addFollowTrip, {
    name: 'addFollowTrip'
  })
)(PopularTrips)
