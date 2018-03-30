import React, {Component} from 'react';
import npsName from '../static_assets/nps_name';
import query from './queries/fetchParks'
import Header from './Header'
import {graphql} from 'react-apollo'
import {Link} from 'react-router'
import { Segment, Card, Image,Rating} from 'semantic-ui-react'
class AllParkList extends Component {
  renderNpsContent() {
    return this.props.data.parks.map(({id, title}) =>{
      const img = require(`../static_assets/nps_images/${title}.jpg`)
      return(
        <div key={id}>
          <Card link={true} href={`/#/parks/${id}`} style={{margin: '10px 10px', width:'250px', borderWidth:'thin', borderStyle:'solid', borderColor:'rgba(34,36,38,.15)'}}>
            <Image src={img} />
            <Card.Header>
              {title}
            </Card.Header>
            <Card.Description>
              High rated
            </Card.Description>
            <Card.Description>
              <Rating icon='heart' defaultRating={4} maxRating={5} />
            </Card.Description>
          </Card>
        </div>
      )
    })
  }
  render(){
    if(this.props.data.loading){
      return <div>Loading</div>
    }
    return (
      <div>
      <div>
        <Header />
      </div>
      <Segment style={{margin:'0px', padding:"0px 100px"}}>
        <div style={{marginBottom:'30px',marginTop:'10px'}}>
          <h2>All National Parks</h2>
        </div>
        <div className="col s12 m6 l3">
          <Card.Group>
            {this.renderNpsContent()}
          </Card.Group>
        </div>
      </Segment>
      </div>
    )
  }
}
export default graphql(query)(AllParkList)
