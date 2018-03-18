import React, {Component} from 'react';
import npsName from '../static_assets/nps_name_shortlist';
import path from 'path'
import query from './queries/fetchParks'
import {graphql} from 'react-apollo'
import {Link} from 'react-router'
const IMG_PATH = '../static_assets/nps_images/'
class ParkList extends Component {
  renderNpsContent() {
    return this.props.data.parks.map(({id, title}) =>{
      const img = require(`../static_assets/nps_images/${title}.jpg`)
      return(
        <div key={id} className="col s12 m6 l3">
          <div className="card small">
            <div className="card-image">
              <img src={img} />
            </div>
            <div className="card-content">
              <Link to={`/parks/${id}`}>
                <p>Welcome to {title} </p>
              </Link>
            </div>
          </div>
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
          <h2>Popular Destination</h2>
        </div>
        <div className="row left">
          {this.renderNpsContent()}
        </div>
      </div>
    )
  }
}
export default graphql(query)(ParkList)
