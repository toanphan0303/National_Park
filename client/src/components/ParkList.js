import React, {Component} from 'react';
import npsName from '../static_assets/nps_name_shortlist';
import path from 'path'
import query from './queries/fetchParks'
import {graphql} from 'react-apollo'
import {Link} from 'react-router'
import _ from 'lodash'
import { Segment, Card, Image,Rating,Loader, Dimmer} from 'semantic-ui-react'
class ParkList extends Component {
  renderNpsContent() {
    const popular = _.intersectionBy(this.props.data.parks,npsName, 'title')
    return popular.map(({id, title}) =>{
      const img = 'https://s3.amazonaws.com/user-upload-image/National_park/'+ title.split(' ').join('+')+'.jpg'
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
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return (
      <div>
        <div style={{marginBottom:'30px',marginTop:'10px'}}>
          <h2>Popular National Parks</h2>
        </div>
        <div className="col s12 m6 l3">
          <Card.Group>
            {this.renderNpsContent()}
          </Card.Group>
        <div>
            <Link style={{display:"inline-block", marginTop:'15px'}} to="/parks/" >See all parks</Link>
          </div>
        </div>
      </div>
    )
  }
}
export default graphql(query)(ParkList)
