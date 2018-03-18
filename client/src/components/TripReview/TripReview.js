import React , {Component} from 'react'
import ImageGallery from 'react-image-gallery';
import fetchTrip from '../queries/fetchTrip'
import Map from '../../MapComponents/Map'
import Blog from '../Blog'
import renderHTML from 'react-render-html';
import {Grid, Image, Segment, Card, Button, Form, Step,Icon, Tab, Container} from 'semantic-ui-react'
import ImgGallery from 'react-image-gallery';
import Header from '../Header'
import 'react-image-gallery/styles/css/image-gallery.css'
import _ from 'lodash'

import {graphql, compose} from 'react-apollo';
class TripReview extends Component {
  constructor(props){
    super(props)
    this.state={
      sumPoint: {},
      currentPoint: {},
      tripDistance:[],
      titles:[]
    }
    this.getMapData = this.getMapData.bind(this)
  }
  
  handleLocation(park, treeData){
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
  componentWillReceiveProps(nextProps){
    if(nextProps.data.trip){
      const treeData = nextProps.data.trip.tripPoints
      const {park} = nextProps.data.trip
      const locationList = this.handleLocation(park, treeData);
      const titles = this.getTitleFromActLoc(treeData)
      if(!(_.isEqual(this.state.sumPoint,locationList))){
        this.setState({
          sumPoint : locationList,
          currentPoint: treeData[0],
          titles
        },() => {return })
      }
    }
  }
  getTitleFromActLoc(points){
    let titles=[]
    points.map(ptn =>{
      titles.push(ptn.activitylocation.title)
    })
    return titles
  }
  renderImage(){
    const {images} = this.state.currentPoint
    let items =[]
    if(images){
      images.map(image =>{
        items.push({
          original: image.url,
          thumbnail: image.url,
        })
      })
      return items
    }
    items.push({
      original: "",
      thumbnail: "",
    })
    return items
  }
  renderNote(){
    const {note} = this.state.currentPoint;
    if(!note){
      return(
        <div>Note was not created yet</div>
      )
    } else {
      return (
        <div>
          <h3>{note.title}</h3>
          <div>
            {renderHTML(note.content)}
          </div>
        </div>
      )
    }
  }
  renderStep(){
    let steps= []
    const {tripPoints} = this.props.data.trip
    if(tripPoints){
      return tripPoints.map( point =>{
        return(
          <Step
            onClick={this.handleClickStep.bind(this,point )}
            key ={point.id}
          >
            <Icon name='marker' />
            <Step.Content>
              <Step.Title>{point.activitylocation.title}</Step.Title>
            </Step.Content>
          </Step>
        )
      })
      return steps
    }
    return(<div>No point in trip </div>)
  }
  handleClickStep(point){
    this.setState({
      currentPoint:point
    }, () =>{return})
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
    if(!this.props.data.trip){
      return(<div>Loading....</div>)
    }
    const settings={

      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    const panes = [
      { menuItem: 'Images',
        pane: (
          <Tab.Pane key='tab1'>
            <ImgGallery items={this.renderImage()} />
          </Tab.Pane>
        ) },
        {menuItem: 'Videos',
          pane: (
            <Tab.Pane key='tab2'>
            </Tab.Pane>
        ) },
        {menuItem: 'Note',
          pane: (
            <Tab.Pane key='tab3'>
              {this.renderNote()}
            </Tab.Pane>
        ) }
    ]
    return(
      <div>
        <Header />
        <Segment>
          <Step.Group size= 'mini'>
            {this.renderStep()}
          </Step.Group>
        </Segment>
        <Grid>
          <Grid.Column  width={8}>
            <Tab panes={panes} renderActiveOnly={false} />
          </Grid.Column>
          <Grid.Column  width={8}>
            <Segment>
              <h3>Your Trip Map</h3>
              <Map locationList={this.state.sumPoint} sendMapData={this.getMapData}  titles={this.state.titles} isMarkerShown />
            </Segment>
            <Segment>
              <Container fluid>
                <h4>Trip Infomation</h4>
                {this.generateTrip()}
                <p>Trip distance: {this.state.distance} miles</p>
                <p>Trip duration: {this.state.duration} minutes (travel by foot)</p>
              </Container>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
export default compose(
  graphql(fetchTrip, {
    options: (props) => { return {variables: { id: props.params.id}}}
  })
)(TripReview)
