import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import Header from './Header'
import fetchPark from './queries/fetchPark'
import Trip from './Trip'
import _ from 'lodash'
import'../style/ParkDetails.css'
import {Grid, Image, Segment, Button, Card, Rating,Loader,Dimmer} from 'semantic-ui-react'
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
    }, () => { return})
  }
  renderCard(){
    return this.state.activityPoints.map(({id, title, description, url, loc}) =>{
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
              <Button basic color='green' onClick={'click', () => this.addActivity({id, title,loc})}>Add to Trip</Button>
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
        <Header />
          <Grid>
            <Grid.Column style={{paddingRight: '0px'}} width={4} mobile={16} tablet={8} computer={4}>
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
