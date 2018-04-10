import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import Header from '../Header'
import fetchCurrentUser from '../queries/CurrentUser'
import deleteFollowTrip from '../mutations/deleteFollowTrip'
import { Segment, Card, Image,Rating,Loader, Dimmer,Button} from 'semantic-ui-react'
class FollowTrips extends Component{
  constructor(props){
    super(props)
    this.state = {
      followTrips:[]
    }
    this.renderFollowTrips = this.renderFollowTrips.bind(this)
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      followTrips: nextProps.data.user.follows,
      user: nextProps.data.user
    })
  }
  handleUnfollowTrip(e){
    const tripId = e.target.id
    const {id} = this.state.user
    this.props.deleteFollowTrip({
      variables:{
        id,
        tripId
      },
      refetchQueries: [{query:fetchCurrentUser}]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({errors})
    })
  }
  renderFollowTrips(){
    return this.state.followTrips.map(({id,title,tripImage, user, rates}) =>{
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
                <Button id={id} onClick={this.handleUnfollowTrip.bind(this)}basic color='green' size='mini'>Unfollow</Button>
              </div>
            </div>
          </Card>
        </div>
      )
    })
  }
  render(){
    if(!this.props.data.user){
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return(
      <div>
        <Header />
          <div className="col s12 m6 l3">
            <div style={{margin:'10px 10px'}}>
              <h2>Following</h2>
            </div>
              <Card.Group style={{margin:'20px 20px'}}>
                {this.renderFollowTrips()}
              </Card.Group>
          </div>
      </div>
    )
  }
}

export default compose(
  graphql(fetchCurrentUser),
  graphql(deleteFollowTrip, {
    name:'deleteFollowTrip'
  })
)(FollowTrips)
