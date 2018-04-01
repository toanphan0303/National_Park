import React from 'react'
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?libraries=visualization&key="+process.env.GOOGLE_MAP_API,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: 39.056198, lng: -95.695312}}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={marker.id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
);

class DemoApp extends React.PureComponent {
  componentWillMount() {
    this.setState({ markers: [] })
  }

  componentWillReceiveProps(nextProps){
    if(!(_.isEmpty(nextProps.trips))&& (this.props.trips != nextProps.trips)){
      let markers=[]
      const {trips} = nextProps;
      if(!(_.isEmpty(trips))){
        trips.map(points =>{
          points.tripPoints.map(actPoint =>{
            let {loc, id} = actPoint.activitylocation
            markers.push({id:id, latitude:loc[0], longitude: loc[1]})
          })
        })
        this.setState({
          markers
        })
      }
    }
  }

  render() {
    return (
      <MapWithAMarkerClusterer markers={this.state.markers} />
    )
  }
}

export default DemoApp
