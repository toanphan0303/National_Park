import React, {Component} from 'react';
import queryAllTrips from './queries/fetchTrips';
import fetchUser from './queries/CurrentUser'
import deleteTrip from './mutations/deleteTrip'
import {Grid, Image, Segment, Button, Card, Rating,Dimmer,Loader} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link} from 'react-router'
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
    return this.props.data.trips.map(({id, title, tripImage ,park}) =>{
      const parkId = park.id;
      return (
        <Card key={id}>
          <Image src={tripImage}  mode={'fill'}/>
          <Card.Content>
            <Link to={`/trips/${id}/tripreview`}>
            <Card.Header>{title}</Card.Header>
            </Link>
            <Rating maxRating={5} disabled />
          </Card.Content>
          <Card.Content extra style={{display:'inline-flex'}}>
            <div style={{marginRight:'8px'}}>
              <Link to={`/parks/${parkId}/trips/${id}`}>Update</Link>
            </div>
            <div style={{marginLeft:'8px'}}>
              <Link to={`/trips/${id}/tripreview`}><p>Preview</p></Link>
            </div>
            <div style={{marginLeft:'8px'}}>
              <span onClick={this.handleDeleteTrip.bind(this)} id={id}>Delete</span>
            </div>
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
        <h3>Your Trips</h3>
        <div style={{ height: '600px', overflowY:'scroll'}}>
          <Card.Group itemsPerRow={3}>
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
