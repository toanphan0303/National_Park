import React , {Component} from 'react'
import {Container} from 'semantic-ui-react'


class TripInfo extends Component {

  generateTrip(){
    let i =-1 ;
    if(_.isEmpty(this.props.tripDistance)){
      return <div>No point is created</div>
    }
    return this.props.tripDistance.map( trD =>{
      i++
      return(<div key={trD}> From point {String.fromCharCode('A'.charCodeAt(0) + i)} to point {String.fromCharCode('A'.charCodeAt(0) +i+1)} : {(trD*0.000621371).toFixed(2)}  </div>)
    })
  }
  render(){
    return(
      <Container fluid>
        <h4>Trip Infomation</h4>
          {this.generateTrip()}
        <p>Trip distance: {this.props.distance} miles</p>
        <p>Trip duration: {this.props.duration} minutes (travel by foot)</p>
      </Container>
    )
  }
}

export default TripInfo
