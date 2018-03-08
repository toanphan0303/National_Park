import React, {Component} from 'react'
import _ from 'lodash'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from 'react-google-maps';
import { compose, withProps, lifecycle } from "recompose";
const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?libraries=visualization&key=AIzaSyDO1OZrmzTeZd8kTN-GDb-TY5KaiH2kdOQ",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount(){
      const DirectionsService = new google.maps.DirectionsService();
      const {parkLocation, origin, destination,wayptns} = this.props.locationList;
      DirectionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: wayptns,
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) =>{
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            default: {lat: parkLocation.lat, lng: parkLocation.lng},
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      })
    },
    componentWillReceiveProps(nextProps){
      const DirectionsService = new google.maps.DirectionsService();
      const {parkLocation, origin, destination,wayptns} = nextProps.locationList;
      DirectionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: wayptns,
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) =>{
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            default: {lat: parkLocation.lat, lng: parkLocation.lng},
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      })
    }
  })
)(props => (
  <GoogleMap
    defaultZoom={4}
    defaultCenter={props.default}
  >
    {(props.locationList.startRoute===true && props.locationList.initial===false) ?
      props.directions &&  <DirectionsRenderer options={{suppressMarkers: false}} directions={props.directions} /> : (props.locationList.startRoute ===false && props.locationList.initial ===false) ?
        (props.directions &&  <DirectionsRenderer options={{suppressMarkers: false}}  directions={props.directions} />) :
        (props.directions &&  <DirectionsRenderer options={{suppressMarkers: true}} directions={props.directions} />)
    }
  </GoogleMap>
));

export default MyMapComponent
