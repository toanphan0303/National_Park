import React, {Component} from 'react';
import {Grid, Image, Segment, Button, Form} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link,hashHistory} from 'react-router';
import Map from '../../MapComponents/Map'
import TripSortUpdate from './TripSortUpdate'
import addTrip from '../mutations/addTrip'
import addTripPoint from '../mutations/addTripPoint'
import addActivityLocationToTripPoint from '../mutations/addActivityLocationToTripPoint'
import addTripPointToTrip from '../mutations/addTripPointToTrip'
import orderPointsInTrip from '../mutations/orderPointsInTrip'
import fetchUser from '../queries/CurrentUser';
import _ from 'lodash'
class Trip extends Component {
  constructor(props){
    super(props);
    this.state= {
      tripPoint: {},
      sumPoint: {},
      treeData:[],
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
    const orderPointsInTrip = (tripId, pointOrder) => {
      return this.props.orderPointsInTrip({
        variables: {tripId,pointOrder}
      })
    }
    e.preventDefault()
    let sortPattern = [];
    _.map(this.state.treeData, (point) =>{
      sortPattern.push(point.id)
    })
    await orderPointsInTrip(this.props.tripid, sortPattern)

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
          locationList.origin = {lat: treeData[i].activitylocation.loc[0], lng: treeData[i].activitylocation.loc[1]}
        }
        else if(i===(treeData.length-1)){
          locationList.destination = {lat: treeData[i].activitylocation.loc[0], lng: treeData[i].activitylocation.loc[1]}
        }
        else{
          let obj = {location: {lat: treeData[i].activitylocation.loc[0], lng: treeData[i].activitylocation.loc[1]}, stopover: true};
          arrWayPoints.push(obj)
          locationList.wayptns = arrWayPoints
        }
      }
    } else if (treeData.length ==1 ){
      locationList.parkLocation= {lat: park.loc[0], lng: park.loc[1]};
      locationList.origin = {lat: treeData[0].activitylocation.loc[0], lng: treeData[0].activitylocation.loc[1]}
      locationList.destination = {lat: treeData[0].activitylocation.loc[0], lng: treeData[0].activitylocation.loc[1]}
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
            <TripSortUpdate tripId={this.props.tripid} tripPoint={this.props.Trip} sendTreeData={this.getTreeData}/>
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
  graphql(orderPointsInTrip,{
    name:'orderPointsInTrip'
  }),
  graphql(fetchUser)
)(Trip)
