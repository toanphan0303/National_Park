import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import Header from '../Header'
import fetchPark from '../queries/fetchPark'
import Map from '../../MapComponents/newMap';
import TripUpdate from './TripUpdate'
import addTripPoint from '../mutations/addTripPoint'
import addActivityLocationToTripPoint from '../mutations/addActivityLocationToTripPoint'
import addTripPointToTrip from '../mutations/addTripPointToTrip'
import _ from 'lodash'
import'../../style/ParkDetails.css'
import {Grid, Image, Segment, Button, Card, Rating, Loader,Dimmer} from 'semantic-ui-react'
class ParkDetail extends Component {
  constructor(props) {
    super(props)
    this.state ={
      recentAddPoint:{},
      activityPoints:[],
      origin:[]
    }
  }
  addActivity= async({id, title,name, description, url, loc}) =>{
    const point = () => {
      return this.props.createPoint({
        variables: {images:[], videos:[], note:""}
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
    let temp={};
    try{
      const pointData = await point();
      const pointId = pointData.data.addTripPoint.id;
      const ptn = await addLocPt(pointId, id)
      const {videos, images, note} = ptn.data.addActivityLocationToTripPoint;
      const ptnID = ptn.data.addActivityLocationToTripPoint.id
      temp = ({id:ptnID,title, videos:[], images:[], note:""})
      temp.activitylocation ={id, title, name, description, url, loc}
      const tripId = this.props.params.id
      await addLocPtTrip(tripId,pointId)
    }catch(e) {
      console.error('Unable to create Trip')
      return;
    }
    this.setState({
      recentAddPoint: temp
    }, () =>{return})
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data.park){
      this.setState({
        activityPoints: nextProps.data.park.activitylocations,
        origin: nextProps.data.park.activitylocations,
      },() => { return})
    }
  }
  getRemainActPoint(treeData){
    let tempTreeData=[]
    _.map(treeData, (data) =>{
      tempTreeData.push(data.activitylocation)
    })
    let temp = [...this.state.origin];
    temp = _.differenceBy(temp, tempTreeData, 'id')
    this.setState({
      activityPoints: temp
    }, () => { return})
  }
  renderCard(){
    return this.state.activityPoints.map(({id, title,name, description, url, loc}) =>{
      return (
        <Card key={id}>
          <Image src={""} style={{margin: '10px 10px', width:'250px', borderWidth:'thin', borderStyle:'solid', borderColor:'rgba(34,36,38,.15)'}} mode={'fill'}/>
          <Card.Content>
            <Card.Header>{title}</Card.Header>
            <Card.Description>{description}</Card.Description>
            <Rating maxRating={5} disabled />
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={'click', () => this.addActivity({id, title,name, description, url, loc})}>Add to Trip</Button>
            </div>
          </Card.Content>
        </Card>
      )
    })
  }
  render(){
    const {park} = this.props.data;
    if(!park){ return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    )}
    return(
      <div>
        <Header/>
        <Grid>
          <Grid.Column style={{paddingRight: '0px'}}  width={4} mobile={16} tablet={8} computer={4}>
            <Segment >
              <h3>Popular Place</h3>
              <div style={{ height: '600px', overflowY:'scroll'}}>
                <Card.Group itemsPerRow={1}>
                  {this.renderCard()}
                </Card.Group>
              </div>
            </Segment>
          </Grid.Column >
          <Grid.Column style={{paddingLeft: '0px'}} width={12} mobile={16} tablet={8} computer={12}>
            <Segment>
              <TripUpdate park={park} tripid={this.props.params.id} sendRemainActPoint={this.getRemainActPoint.bind(this)} Trip={this.state.recentAddPoint} onRef={ref => (this.child = ref)}/>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
export default compose(
  graphql(fetchPark, {
    options:(props) => {return {variables: {id: props.params.parkid}}}
  }),
  graphql(addTripPoint, {
    name: 'createPoint'
  }),
  graphql(addActivityLocationToTripPoint,{
    name:'addLocToPoint'
  }),
  graphql(addTripPointToTrip,{
    name:'addPointToTrip'
  })
)(ParkDetail)
