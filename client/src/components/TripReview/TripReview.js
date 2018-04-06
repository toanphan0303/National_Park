import React , {Component} from 'react'
import fetchTrip from '../queries/fetchTrip'
import addCommentToTrip from '../mutations/addCommentToTrip'
import Map from '../../MapComponents/newMap'
import Blog from '../Blog'
import renderHTML from 'react-render-html';
import {Grid, Image, Segment, Card, Button, Form, Step,Icon, Tab, Container} from 'semantic-ui-react'
import ImgGallery from 'react-image-gallery';
import Header from '../Header'
import Comments from './Comments'
import TripInfo from './TripInfo'
import 'react-image-gallery/styles/css/image-gallery.css'
import _ from 'lodash'
import style from '../../style/TripReview.css'

import {graphql, compose, withApollo} from 'react-apollo';
class TripReview extends Component {
  constructor(props){
    super(props)
    this.state={
      sumPoint: {},
      currentPoint: {},
      tripDistance:[],
      titles:[],
      comments:[],
      comment:""
    }
    this.getMapData = this.getMapData.bind(this)
  }

  handleLocation(park, treeData){
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
  componentWillReceiveProps(nextProps){
    if(nextProps.data.trip){
      const treeData = nextProps.data.trip.tripPoints
      const {park} = nextProps.data.trip
      const {comments} = nextProps.data.trip
      const locationList = this.handleLocation(park, treeData);
      const titles = this.getTitleFromActLoc(treeData)

        this.setState({
          sumPoint : locationList,
          currentPoint: treeData[0],
          titles,
          comments
        },() => {return})

    }
  }
  handleAddComment(){
    return this.props.client.mutate({
      mutation: addCommentToTrip,
      variables: {tripId:this.props.params.id,userId:this.props.user.id,content: this.state.comment},
      refetchQueries: [{query:fetchTrip, variables:{id: this.props.params.id}}]
    })
      .catch(res => {
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({errors})
    })
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
    if(images && images.length>0){
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
          <div className={style}>
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
  handleComment(e){
    this.setState({
      comment: e.target.value
    })
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
            {this.state.currentPoint.images && this.state.currentPoint.images.length>0 ? <ImgGallery items={this.renderImage()} />: <div><h4>No images for this location</h4></div>}
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
        <Segment mobile={16} tablet={8} computer={16} style={{marginTop:'0px', padding:'0px 0px'}}>
          <Step.Group size= 'mini' >
            {this.renderStep()}
          </Step.Group>
        </Segment>
        <Grid>
          <Grid.Column  width={8} style={{paddingLeft:'0px', paddingTop: '0px', paddingRight:'0px'}} mobile={16} tablet={8} computer={8}>
            <Tab panes={panes} renderActiveOnly={false} />
          </Grid.Column>
          <Grid.Column  width={8} style={{paddingLeft:'0px', paddingTop: '0px', paddingRight:'0px'}} mobile={16} tablet={8} computer={8}>
            <Segment>
              <h3>Your Trip Map</h3>
              <Map locationList={this.state.sumPoint} sendMapData={this.getMapData}  titles={this.state.titles} isMarkerShown />
            </Segment>
            <Segment>
              <TripInfo tripDistance={this.state.tripDistance} distance={this.state.distance} duration={this.state.duration}/>
            </Segment>
          </Grid.Column>
        </Grid>
        <Segment mobile={16} tablet={8} computer={16}>
          <Comments comments={this.state.comments}/>
          <Form size='small'>
            <Form.Input style={{width:'500px', height:'50px'}} onChange={this.handleComment.bind(this)} />
            <Button content='Add Comment' onClick={this.handleAddComment.bind(this)} labelPosition='left' icon='edit' primary />
          </Form>
        </Segment>
      </div>
    )
  }
}
export default compose(
  withApollo,
  graphql(fetchTrip, {
    options: (props) => { return {variables: { id: props.params.id}}}
  }),
  graphql(addCommentToTrip)
)(TripReview)
