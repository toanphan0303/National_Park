import React, {Component} from 'react';
import {Grid, Image, Segment, Button, Form,Container, Header} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import {Link,hashHistory} from 'react-router';
import TestMap from '../MapComponents/testMap'
import Map from '../MapComponents/newMap'
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
      distance: 0,
      duration: 0,
      tripDistance: [],
      tripDuration: [],
      titles:[],
      saveButton: false
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
      titles.push(ptn.title)
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
  handleDataSaveTrip = async(e) =>{
    e.preventDefault()
    this.setState({
      saveButton:true
    })
    const park = this.props.park.id;
    const trip = () =>{
      const tripImage = 'https://s3.amazonaws.com/user-upload-image/National_park/'+this.props.park.title.split(" ").join("+")+".jpg"
      return this.props.createTrip({
        variables: {user, title, tripImage, park}
      })
    }
    const point = () => {
      return this.props.createPoint({
        variables: {images:"", videos:"", note:""}
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
    this.setState({
      saveButton:false
    }, () =>{
      hashHistory.push('/parks/trips/summary')
    })
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
      locationList.startRoute = false
    } else{
      locationList.parkLocation= {lat: park.loc[0], lng: park.loc[1]};
      locationList.startRoute = false
    }
    return locationList
  }
  generateTrip(){
    let i =-1 ;
    return this.state.tripDistance.map( trD =>{
      i++
      return(<div key={trD}> From point {String.fromCharCode('A'.charCodeAt(0) + i)} to point {String.fromCharCode('A'.charCodeAt(0) +i+1)} : {(trD*0.000621371).toFixed(2)}  </div>)
    })
  }
  render(){
    return(
      <Grid style={{height: '665px'}}>
        <Grid.Column style={{paddingRight: '0px'}}  width={5} width={4} mobile={16} tablet={8} computer={5}>
          <Segment style={{marginBottom: '0px'}}>
            <Form>
             <Form.Field>
               <label>Trip Title</label>
               <Form.Input placeholder='My Trip to Yellow Stone' onChange={(e) => {this.setState({tripTitle:e.target.value})}} />
             </Form.Field>
             <Button
                type='submit'
                primary
                loading={this.state.saveButton}
                onClick={this.handleDataSaveTrip.bind(this)}>Save Trip</Button>
            </Form>
          </Segment>
          <Segment style={{marginTop: '0px'}}>
            <h3>Your Trip  </h3>
            <TripSort tripPoint={this.props.Trip} sendTreeData={this.getTreeData}/>
          </Segment>
        </Grid.Column>
        <Grid.Column style={{paddingLeft: '0px'}}  width={11} width={5} width={4} mobile={16} tablet={8} computer={11}>
          <Segment style={{marginBottom: '0px'}}>
            <h3>Your Trip Map</h3>
            <Map locationList={this.state.sumPoint} sendMapData={this.getMapData} titles={this.state.titles} isMarkerShown />
          </Segment>
          <Segment style={{marginTop: '0px'}}>
            <Container fluid>
              <Header as='h2'>Trip Infomation</Header>
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
  graphql(fetchUser)
)(Trip)
