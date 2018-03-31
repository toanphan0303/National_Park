import React, {Component} from 'react'
import _ from 'lodash'
const keys = require('../../../config/keys');
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from 'react-google-maps';
console.log(process.env.GOOGLE_MAP_API)
import { compose, withProps, lifecycle ,withHandlers} from "recompose";
const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?libraries=visualization&key="+keys.googleMapAPI,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({

  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount(){
      let origins =[]
      let destinations =[]
      let path =[]
      const DirectionsService = new google.maps.DirectionsService();
      const DistanceService = new google.maps.DistanceMatrixService();
      const {titles}= this.props
      const {parkLocation, origin, destination,wayptns} = this.props.locationList;
      if(!this.props.locationList.startRoute){
        if(origin){
          path.push({lat: origin.lat, lng: origin.lng, title:titles[0]})
        }
        this.setState({
          default: {lat: parkLocation.lat, lng: parkLocation.lng},
          path
        })
      }
      if(this.props.locationList.startRoute){
          origins.push(new google.maps.LatLng(origin.lat, origin.lng))
          path.push({lat: origin.lat, lng: origin.lng, title:titles[0]})
          if(wayptns){
            wayptns.map((ptn, index) =>{
              origins.push(new google.maps.LatLng(ptn.location.lat, ptn.location.lng))
              path.push({lat: ptn.location.lat, lng: ptn.location.lng, title:titles[index+1]})
              destinations.push(new google.maps.LatLng(ptn.location.lat, ptn.location.lng))
            })
          }
          destinations.push(new google.maps.LatLng(destination.lat, destination.lng))
          path.push({lat: destination.lat, lng: destination.lng, title:titles[titles.length-1]})
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
              path
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        })
        DistanceService.getDistanceMatrix({
          origins,
          destinations,
          travelMode: google.maps.TravelMode.WALKING,
        },(result, status) =>{
          if(status == 'OK'){
            let distance = 0;
            let duration = 0;
            let tripDistance =[]
            let tripDuration =[]
            console.log('result ', result)
            if(result.rows.length>1){
              for(let i =0; i< result.rows.length; i++){
                distance += result.rows[i].elements[i].distance.value
                tripDistance.push(result.rows[i].elements[i].distance.value)
                duration += result.rows[i].elements[i].duration.value
                tripDuration.push(result.rows[i].elements[i].duration.value)
              }
            } else{
              distance = result.rows[0].elements[0].distance.value
              duration = result.rows[0].elements[0].duration.value
            }
            this.setState({
              distance,
              duration,
              tripDistance,
              tripDuration
            }, () =>{
              this.props.sendMapData(this.state.distance, this.state.duration, this.state.tripDistance, this.state.tripDuration)
            })
          }
        })
      }
    },
    componentWillReceiveProps(nextProps){
      let origins =[]
      let destinations =[]
      let path =[]
      const DirectionsService = new google.maps.DirectionsService();
      const DistanceService = new google.maps.DistanceMatrixService();
      const ElevationService = new google.maps.ElevationService();
      const {titles}= nextProps
      const {parkLocation, origin, destination,wayptns} = nextProps.locationList;
      if(!nextProps.locationList.startRoute){
        if(origin){
          path.push({lat: origin.lat, lng: origin.lng, title:titles[0]})
        }
        this.setState({
          default: {lat: parkLocation.lat, lng: parkLocation.lng},
          path
        })
      }
      if(nextProps.locationList.startRoute){
        origins.push(new google.maps.LatLng(origin.lat, origin.lng))
        path.push({lat: origin.lat, lng: origin.lng, title:titles[0]})
        if(wayptns){
          wayptns.map((ptn, index) =>{
            origins.push(new google.maps.LatLng(ptn.location.lat, ptn.location.lng))
            path.push({lat: ptn.location.lat, lng: ptn.location.lng, title:titles[index+1]})
            destinations.push(new google.maps.LatLng(ptn.location.lat, ptn.location.lng))
          })
        }
        destinations.push(new google.maps.LatLng(destination.lat, destination.lng))
        if(titles.length>1){
          path.push({lat: destination.lat, lng: destination.lng, title:titles[titles.length-1]})
        }
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
              path
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        })
        DistanceService.getDistanceMatrix({
          origins,
          destinations,
          travelMode: google.maps.TravelMode.WALKING,
        },(result, status) =>{
          if(status == 'OK'){
            let distance = 0;
            let duration = 0;
            let tripDistance =[]
            let tripDuration =[]
            console.log('result componentWillReceiveProps', result)
            if(result.rows.length>1){
              for(let i =0; i< result.rows.length; i++){
                distance += result.rows[i].elements[i].distance.value
                tripDistance.push(result.rows[i].elements[i].distance.value)
                duration += result.rows[i].elements[i].duration.value
                tripDuration.push(result.rows[i].elements[i].duration.value)
              }
            } else{
              distance = result.rows[0].elements[0].distance.value
              duration = result.rows[0].elements[0].duration.value
            }
            this.setState({
              distance,
              duration,
              tripDistance,
              tripDuration
            }, () =>{
              nextProps.sendMapData(this.state.distance, this.state.duration, this.state.tripDistance, this.state.tripDuration)
            })
          }else{
            console.log(status)
          }
        })
      }
    }
  })
)(props => (
  <GoogleMap
    defaultZoom={4}
    defaultCenter={new google.maps.LatLng(37.0902, -95.7129)}
  >
  {props.locationList.startRoute===true &&
    <DirectionsRenderer options={{suppressMarkers: false, markerOptions:{ animation:google.maps.Animation.DROP} }} directions={props.directions} />
  }

    {props.path && _.map(props.path, marker =>{
      return (<Marker
        key={marker.title}
        position={{lat:marker.lat, lng:marker.lng}}
        label={{
          text:marker.title,
          fontSize: '12'
        }}
        zIndex={-1}
        icon={'http://maps.google.com/mapfiles/kml/paddle/grn-circle-lv.png'}
        animation={google.maps.Animation.DROP}

      />)
    })}
  </GoogleMap>
));

export default MyMapComponent
