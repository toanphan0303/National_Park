import React, {Component} from 'react';
import queryAllTrips from './queries/fetchTrips';
import fetchUser from './queries/CurrentUser'
import {Grid, Segment, Dimmer, Loader} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import TripsSummaryUser from './TripsSummaryUser'
import SummaryTripMap from '../MapComponents/SummaryTripMap'
import Header from './Header'
import _ from 'lodash'
class TripsSummary extends Component{
  constructor(props){
    super(props)
    this.state={
      trips:[]
    }
  }
  getTripData(tripData){
    if(!(_.isEqual(this.state.trips,tripData))){
      this.setState({
        trips:tripData
      }, () => {return })
    }
  }
  render(){
    const {user} = this.props.data
    if(!user){
      return(
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return(
      <div>
        <Header />
        <Grid>
          <Grid.Column width={8} style={{paddingRight: '0px'}}>
            <TripsSummaryUser user={user} sendTripData={this.getTripData.bind(this)}/>
          </Grid.Column>
          <Grid.Column width={8} style={{paddingLeft: '0px'}}>
            <Segment>
              <SummaryTripMap trips={this.state.trips}/>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default graphql(fetchUser)(TripsSummary)
