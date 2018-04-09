import React, {Component} from 'react';
import fetchPopularTrips from './queries/fetchPopularTrips'
import {graphql, compose} from 'react-apollo';
import {Dimmer, Loader, Card,Rating, Image} from 'semantic-ui-react'
class PopularTrips extends Component {
  constructor(props){
    super(props)
    this.state ={
      popularTrips: []
    }
    this.renderPopularTrips = this.renderPopularTrips.bind(this)
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      popularTrips:nextProps.data.popularTrips
    })
  }
  renderPopularTrips(){
    return this.state.popularTrips.map(({id,title,tripImage, user}) =>{
      return(
        <div key={id}>
          <Card link={true} href={`/#/trips/${id}/tripreview`} style={{margin: '10px 10px', width:'250px', borderWidth:'thin', borderStyle:'solid', borderColor:'rgba(34,36,38,.15)'}}>
            <Image src={tripImage} />
            <Card.Header>
              {title}
            </Card.Header>
            <Card.Description>
               Created by: {user.firstName} {user.lastName}
            </Card.Description>
            <Card.Description>
              <Rating icon='heart'maxRating={5}/>
            </Card.Description>
          </Card>
        </div>
      )
    })
  }
  render(){
    if(!this.props.data.popularTrips){
      return(
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    return(
      <div style={{paddingTop: '10px'}}>
        <h2>Popular Trips</h2>
        <div className="col s12 m6 l3">
          <Card.Group>
            {this.renderPopularTrips()}
          </Card.Group>
        </div>
      </div>
    )
  }
}

export default compose (
  graphql(fetchPopularTrips)
)(PopularTrips)
