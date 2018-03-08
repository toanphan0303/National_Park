import React, {Component} from 'react';
import {Grid, Image, Segment, Button, Form} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link,hashHistory} from 'react-router';
import TestMap from '../MapComponents/testMap'
import Map from '../MapComponents/Map'
import TripSort from './TripSort'
import addTrip from './mutations/addTrip'
import addTripPoint from './mutations/addTripPoint'
import addActivityLocationToTripPoint from './mutations/addActivityLocationToTripPoint'
import addTripPointToTrip from './mutations/addTripPointToTrip'
import fetchUser from './queries/CurrentUser';
import _ from 'lodash'
class Trip extends Component {
  constructor(props){
    super(props);
    this.state= {
      tripPoint: {},
      sumPoint: {},
      saveTrip: {},
      error: [],
      tripTitle: "",
      presentTrip: "",
    }
    this.getTreeData = this.getTreeData.bind(this)
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  getTreeData(treeData){
    const locationList = this.handleLocation(treeData);
    if(!(_.isEqual(this.state.sumPoint,locationList))){
      this.setState({
        sumPoint : locationList,
        treeData: treeData
      },() => {return this.props.sendRemainActPoint(this.state.treeData)})
    }
  }
  handleDataSaveTrip = async(e) =>{
    e.preventDefault()
    const park = this.props.park.id;

    const trip = () =>{
      return this.props.createTrip({
        variables: {user, title, park}
      })
    }
    const point = () => {
      return this.props.createPoint({
        variables: {image:"", video:"", note:""}
      })
    }
    const addLocPt = (tripPointId, activitylocationId) =>{
      return this.props.addLocToPoint({
        variables:{tripPointId, activitylocationId}
      })
    }
    const addLocPtTrip = (tripId,tripPointId) =>{
      const result = this.props.addPointToTrip({
        variables: {tripId,tripPointId}
      })
      return result
    }
    const user = this.props.data.user.id;
    let tripId =""
    let title= this.state.tripTitle;
    if(!title || title.length === 0){
      title = "Trip for ".concat(this.props.park.title)
    }
    if(!this.state.presentTrip){
      const tripData = await trip()
      this.setState({
        presentTrip: tripData.data.addTrip.id
      }, () => {
        tripId = this.state.presentTrip;
      })
    } else{
      tripId = this.state.presentTrip;
    }
    const result = _.map(this.state.treeData, async (loc) =>{
      try{
        const pointData = await point();
        const pointId = pointData.data.addTripPoint.id;
        await addLocPt(pointId, loc.id)
        await addLocPtTrip(tripId,pointId)
      } catch(e) {
        console.error('Unable to create Trip')
        return;
        }
    })
  }
  handleLocation(treeData){
    const {park} = this.props;
    let locationList = {}
    if(treeData.length > 1){
      locationList.parkLocation = {lat: park.loc[0], lng: park.loc[1]}
      let arrWayPoints=[];
      locationList.startRoute = true
      locationList.initial = false
      for(var i= 0; i< treeData.length; i++){
        if(i===0){
          locationList.origin = {lat: treeData[i].loc[0], lng: treeData[i].loc[1]}
        }
        else if(i===(treeData.length-1)){
          locationList.destination = {lat: treeData[i].loc[0], lng: treeData[i].loc[1]}
        }
        else{
          let obj = {location: {lat: treeData[i].loc[0], lng: treeData[i].loc[1]}, stopover: true};
          arrWayPoints.push(obj)
          locationList.wayptns = arrWayPoints
        }
      }
    } else if (treeData.length ==1 ){
      locationList.parkLocation= {lat: park.loc[0], lng: park.loc[1]};
      locationList.origin = {lat: treeData[0].loc[0], lng: treeData[0].loc[1]}
      locationList.destination = {lat: treeData[0].loc[0], lng: treeData[0].loc[1]}
      locationList.startRoute = false
      locationList.initial = false
    } else{
      locationList.parkLocation= {lat: park.loc[0], lng: park.loc[1]};
      locationList.origin = {lat: park.loc[0], lng: park.loc[1]};
      locationList.destination = {lat: park.loc[0], lng: park.loc[1]};
      locationList.startRoute = false
      locationList.initial = true

    }
    return locationList
  }

  render(){
    return(
      <Grid>
        <Grid.Column width={5}>
          <Segment>
            <Form>
             <Form.Field>
               <label>Trip Title</label>
               <Form.Input placeholder='My Trip to Yellow Stone' onChange={(e) => {this.setState({tripTitle:e.target.value})}} />
             </Form.Field>
             <Button type='submit' onClick={this.handleDataSaveTrip.bind(this)}>Save</Button>
            </Form>
          </Segment>
          <Segment>
            <h3>Your Trip  </h3>
            <TripSort tripPoint={this.props.Trip} sendTreeData={this.getTreeData}/>
          </Segment>
        </Grid.Column>
        <Grid.Column width={11}>
          <Segment>
            <h3>Your Trip Map</h3>
            <Map locationList={this.state.sumPoint} isMarkerShown />
            </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

export default compose(
  graphql(addTrip, {
    name: 'createTrip'
  }),
  graphql(addTripPoint, {
    name: 'createPoint'
  }),
  graphql(addActivityLocationToTripPoint,{
    name:'addLocToPoint'
  }),
  graphql(addTripPointToTrip,{
    name:'addPointToTrip'
  }),
  graphql(fetchUser)
)(Trip)
