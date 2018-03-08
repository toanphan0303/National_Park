import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import Header from './Header'
import fetchPark from './queries/fetchPark'
import Map from '../MapComponents/Map';
import Trip from './Trip'
import _ from 'lodash'
import {Grid, Image, Segment, Button, Card, Rating} from 'semantic-ui-react'
class ParkDetail extends Component {
  constructor(props) {
    super(props)
    this.state ={
      recentAddPoint:{},
      sumPoint:[],
      activityPoints:[],
      origin:[]
    }
  }
  addActivity({id, title, loc}){
    this.setState({
      recentAddPoint: {id, title, loc},
      sumPoint: this.state.sumPoint.concat([{id,title, loc}]),
    }, () => {
      return
    })
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

    let temp = [...this.state.origin];
    temp = _.differenceBy(temp, treeData, 'id')
    this.setState({
      activityPoints: temp
    }, () => { console.log('')})
  }
  renderCard(){
    return this.state.activityPoints.map(({id, title, description, url, loc}) =>{
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
              <Button basic color='green' onClick={'click', () => this.addActivity({id, title,loc})}>Add to Trip</Button>
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
              <Trip park={park} sendRemainActPoint={this.getRemainActPoint.bind(this)} Trip={this.state.recentAddPoint} onRef={ref => (this.child = ref)}/>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
export default graphql(fetchPark, {
  options:(props) => {return {variables: {id: props.params.id}}}
})(ParkDetail)
