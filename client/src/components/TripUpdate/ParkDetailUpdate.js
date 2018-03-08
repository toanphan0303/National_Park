import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import Header from '../Header'
import fetchPark from '../queries/fetchPark'
import Map from '../../MapComponents/Map';
import TripUpdate from './TripUpdate'
import addTripPoint from '../mutations/addTripPoint'
import addActivityLocationToTripPoint from '../mutations/addActivityLocationToTripPoint'
import addTripPointToTrip from '../mutations/addTripPointToTrip'
import _ from 'lodash'
import {Grid, Image, Segment, Button, Card, Rating} from 'semantic-ui-react'
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
    let temp={};
    try{
      const pointData = await point();
      const pointId = pointData.data.addTripPoint.id;
      const ptn = await addLocPt(pointId, id)
      const {video, image, note} = ptn.data.addActivityLocationToTripPoint;
      const ptnID = ptn.data.addActivityLocationToTripPoint.id
      temp = ({id:ptnID, video, image, note})
      temp.activitylocation ={id, title, name, description, url, loc}
      const tripId = this.props.params.id
      await addLocPtTrip(tripId,pointId)
    }catch(e) {
      console.error('Unable to create Trip')
      return;
    }
    this.setState({
      recentAddPoint: temp
    }, () =>{console.log('')})
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
    }, () => { console.log('')})
  }
  renderCard(){
    return this.state.activityPoints.map(({id, title,name, description, url, loc}) =>{
      return (
        <Card key={id}>
          <Image src={""} height={200} width={200} mode={'fill'}/>
          <Card.Content>
            <Card.Header>{title}</Card.Header>
            <Card.Description>{description}</Card.Description>
            <Rating maxRating={5} disabled />
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={'click', () => this.addActivity({id, title,name, description, url, loc})}>Add to Trip</Button>
              <Button basic color='blue'>Explore this place</Button>
            </div>
          </Card.Content>
        </Card>
      )
    })
  }
  render(){
    const {park} = this.props.data;
    if(!park){ return <div>Loading </div>}
    return(
      <div>
        <Header />
        <Grid>
          <Grid.Column width={4}>
            <Segment >
              <h3>Popular Place</h3>
              <Card.Group itemsPerRow={1}>
                {this.renderCard()}
              </Card.Group>
            </Segment>
          </Grid.Column >
          <Grid.Column width={12}>
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
