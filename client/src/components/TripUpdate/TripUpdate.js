import React, {Component} from 'react';
import {Grid, Image, Segment, Button, Form, Container} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link,hashHistory} from 'react-router';
import Map from '../../MapComponents/newMap'
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
      titles:[]
    }
    this.getTreeData = this.getTreeData.bind(this)
    this.getMapData = this.getMapData.bind(this)
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  getTitleFromActLoc(points){
    let titles=[]
    points.map(ptn =>{
      titles.push(ptn.activitylocation.title)
    })
    return titles
  }
  getTreeData(treeData){
    const locationList = this.handleLocation(treeData);
    const titles = this.getTitleFromActLoc(treeData)
    if(!(_.isEqual(this.state.sumPoint,locationList))){
      this.setState({
        sumPoint : locationList,
        treeData: treeData,
        titles
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
      locationList.startRoute = false
    } else{
      locationList.parkLocation= {lat: park.loc[0], lng: park.loc[1]};
      locationList.startRoute = false
    }
    return locationList
  }
  getMapData(meter, secs, tripDistance, tripDuration){
    const distance = (meter*0.000621371).toFixed(2);
    const duration = (secs/60).toFixed(2);
    this.setState({
      distance,
      duration,
      tripDistance,
      tripDuration
    })
  }
  generateTrip(){
    let i =-1 ;
    if(_.isEmpty(this.state.tripDistance)){
      return <div>No point is created</div>
    }
    return this.state.tripDistance.map( trD =>{
      i++
      return(<div key={trD}> From point {String.fromCharCode('A'.charCodeAt(0) + i)} to point {String.fromCharCode('A'.charCodeAt(0) +i+1)} : {(trD*0.000621371).toFixed(2)}  </div>)
    })
  }
  render(){
    return(
      <Grid style={{height: '665px'}}>
        <Grid.Column  style={{paddingRight: '0px'}} width={5} style={{paddingRight: '0px'}}  width={5} width={4} mobile={16} tablet={8} computer={5}>
          <Segment style={{marginBottom: '0px'}}>
            <Form>
             <Form.Field>
               <label>Trip Title</label>
               <Form.Input placeholder='My Trip to Yellow Stone' onChange={(e) => {this.setState({tripTitle:e.target.value})}} />
             </Form.Field>
             <Button type='submit' onClick={this.handleDataSaveTrip.bind(this)}>Save</Button>
            </Form>
          </Segment>
          <Segment style={{marginTop: '0px'}}>
            <h3>Your Trip  </h3>
            <TripSortUpdate tripId={this.props.tripid} tripPoint={this.props.Trip} sendTreeData={this.getTreeData}/>
          </Segment>
        </Grid.Column>
        <Grid.Column width={11} style={{paddingLeft: '0px'}} width={5} width={4} mobile={16} tablet={8} computer={11}  >
          <Segment style={{marginBottom: '0px'}}>
            <h3>Your Trip Map</h3>
            <Map locationList={this.state.sumPoint} sendMapData={this.getMapData} titles={this.state.titles} isMarkerShown />
          </Segment>
          <Segment style={{marginTop: '0px'}}>
            <Container fluid>
              <h4>Trip Infomation</h4>
              {this.generateTrip()}
              <p>Trip distance: {this.state.distance} miles</p>
              <p>Trip duration: {this.state.duration} minutes (travel by foot)</p>
            </Container>
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
