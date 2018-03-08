import React, {Component} from 'react';
import queryAllTrips from './queries/fetchTrips';
import fetchUser from './queries/CurrentUser'
import {Grid, Image, Segment, Button, Card, Rating} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link} from 'react-router'
class TripsSummaryUser extends Component{

  componentDidUpdate(){
    this.props.sendTripData(this.props.data.trips)
  }
  renderCard(){
    return this.props.data.trips.map(({id, title ,park}) =>{
      const parkId = park.id;
      return (
        <Card key={id}>
          <Image src={""} height={200} width={200} mode={'fill'}/>
          <Card.Content>
            <Link to={`/parks/${parkId}/trips/${id}`}>
            <Card.Header>{title}</Card.Header>
            </Link>
            <Rating maxRating={5} disabled />
          </Card.Content>
          <Card.Content extra>
            <div className='ui one buttons'>
              <Button basic color='blue'>Explore this trip</Button>
            </div>
          </Card.Content>
        </Card>
      )
    })
  }
  render(){
    const {trips} = this.props.data;
    if(!trips){
      return <div>Loading...</div>
    }
    return(
      <Segment>
        <h3>Your Trips</h3>
        <Card.Group itemsPerRow={3}>
          {this.renderCard()}
        </Card.Group>
      </Segment>
    )
  }
}

export default compose(
  graphql(queryAllTrips, {
  options:(props) => {return{ variables: {id: props.user.id}}}
}),
)(TripsSummaryUser)
