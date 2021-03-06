import React, {Component} from 'react';
import queryAllTrips from './queries/fetchTrips';
import fetchUser from './queries/CurrentUser'
import deleteTrip from './mutations/deleteTrip'
import {Grid, Image, Segment, Button, Card, Rating,Dimmer,Loader} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link, hashHistory} from 'react-router'
import _ from 'lodash'
class TripsSummaryUser extends Component{
  constructor(props){
    super(props)
    this.state={
      errors: {},
      allTrip:[]
    }
  }
  componentDidUpdate(){
    this.props.sendTripData(this.props.data.trips)
  }
  handleClickUpdate(parkid, e){
    const id = e.target.id
    hashHistory.push(`/parks/${parkid}/trips/${id}`)
  }
  handleCLickPreview(e){
    const id = e.target.id
    hashHistory.push(`/trips/${id}/tripreview`)
  }
  handleDeleteTrip(e){
    const tripId = e.target.id
    const {id} = this.props.user
    this.props.deleteTrip({
      variables:{
        id,
        tripId
      },
      refetchQueries: [{query:queryAllTrips, variables:{id} }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({errors})
    })
  }
  renderCard(){
    console.log(this.props.data)
    return this.props.data.trips.map(({id, title, tripImage ,park, rates}) =>{
        let averageRated =0
      if(!_.isEmpty(rates)){
        averageRated = _.meanBy(rates, (rate) =>{
          return rate.rated
        })
      }
      return (
        <Card key={id}>
          <Image src={tripImage}  mode={'fill'}/>
          <Card.Content>
            <Link to={`/trips/${id}/tripreview`}>
            <Card.Header>{title}</Card.Header>
          </Link>
            <div style={{display:'inline-flex'}}>
              <Rating size='mini' icon='star' defaultRating={averageRated} maxRating={5} disabled />
              <div style={{marginLeft:'10px', marginTop:'-4px',fontSize:'12px'}}>{rates.length}</div>
            </div>
          </Card.Content>
          <Card.Content extra>
            <Button.Group basic size='tiny'>
              <Button  color='blue' onClick={this.handleClickUpdate.bind(this, park.id)} id={id} >Update</Button>
              <Button  color='green' onClick={this.handleCLickPreview.bind(this)} id={id} >Preview</Button>
              <Button  color='red' onClick={this.handleDeleteTrip.bind(this)} id={id}>Delete</Button>
            </Button.Group>
          </Card.Content>
        </Card>
      )
    })
  }
  render(){
    const {trips} = this.props.data;
    if(!trips){
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return(
      <Segment>
        <h2>Your Trips</h2>
        <div style={{ height: '600px', overflowY:'scroll'}}>
          <Card.Group itemsPerRow={2}>
            {this.renderCard()}
          </Card.Group>
        </div>
      </Segment>
    )
  }
}

export default compose(
  graphql(deleteTrip, {
    name: 'deleteTrip'
  }),
  graphql(queryAllTrips, {
    options:(props) => {return{ variables: {id: props.user.id}}}
}),
)(TripsSummaryUser)
