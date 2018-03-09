import React, { Component } from "react";
import fetchTrip from '../queries/fetchTrip'
import deleteTripPoint from '../mutations/deleteTripPoint'
import omitPointFromTrip from '../mutations/omitPointFromTrip'
import SortableTree, {removeNodeAtPath} from "react-sortable-tree";
import ImageUploadModal from '../modals/ImageUpload'
import 'react-sortable-tree/style.css';
import {graphql, compose} from 'react-apollo';
class TripSortUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectPoint: ""
    };
  }
  componentDidMount(){
    this.setState({
      treeData: [...this.state.treeData]
    }, () =>{ return })
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps ', nextProps)
    if(!(_.isEmpty(nextProps.tripPoint))&& (this.props.tripPoint != nextProps.tripPoint)){
      this.setState({
        treeData: this.state.treeData.concat([nextProps.tripPoint])
      },() => { console.log('this.state.treeData',this.state.treeData) })
    }
    if((nextProps.data.trip)&& (_.isEmpty(nextProps.tripPoint))){
      this.setState({
        treeData: nextProps.data.trip.tripPoints
      },() => { return })
    }
  }
  componentDidUpdate(){
    this.props.sendTreeData(this.state.treeData)
  }

  addImageUrl({node}){
    this.setState({
      selectPoint : node.id
    }, () =>{
      this.child.openModal()
    })
  }

  handleDeleteClick = async({getNodeKey,node, path}) =>{
    const deletePoint = (id) => {
      return this.props.deleteTripPoint({
        variables: {id}
      })
    }
    const omitPointFromTrip = (tripId, pointId) => {
      return this.props.omitPointFromTrip({
        variables: {tripId,pointId}
      })
    }
    await omitPointFromTrip(this.props.tripId ,node.id)
    this.setState(state => ({
      treeData: removeNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey,
      }),
    }))
  }
  render() {
    const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
      if (nextParent) {
        return false;
      }
      return true;
    };
    const getNodeKey = ({ treeIndex }) => treeIndex;
    if(!this.props.data.trip){
      return (<div>Loading.....</div>)
    }
    return (
      <div style={{ height: 300 }}>
        <SortableTree
          treeData={this.state.treeData}
          canDrop={canDrop}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <button
                onClick={this.handleDeleteClick.bind(this, {getNodeKey,node,path})}
              >
                Remove
              </button>,
              <button
                onClick={this.addImageUrl.bind(this, {node})}
              >
                Image
              </button>,
              <button

              >
                Video
              </button>,
              <button

              >
                Note
              </button>,

            ],
          })}
        />
        <div>
          <ImageUploadModal
            onRef={ref =>{this.child = ref}}
            pointId={this.state.selectPoint}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(deleteTripPoint, {
    name: 'deleteTripPoint'
  }),
  graphql(omitPointFromTrip, {
    name: 'omitPointFromTrip'
  }),
  graphql(fetchTrip, {
    options: (props) => { return {variables: { id: props.tripId}}}
  })
)(TripSortUpdate)
