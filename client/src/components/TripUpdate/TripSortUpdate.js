import React, { Component } from "react";
import fetchTrip from '../queries/fetchTrip'
import deleteTripPoint from '../mutations/deleteTripPoint'
import omitPointFromTrip from '../mutations/omitPointFromTrip'
import SortableTree, {removeNodeAtPath} from "react-sortable-tree";
import ImageUploadModal from '../modals/ImageUploadModal'
import BlogModal from '../modals/BlogModal'
import 'react-sortable-tree/style.css';
import {Icon, Popup, Button} from 'semantic-ui-react'
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
    if(!(_.isEmpty(nextProps.tripPoint))&& (this.props.tripPoint != nextProps.tripPoint)){
      this.setState({
        treeData: this.state.treeData.concat([nextProps.tripPoint])
      },() => { return})
    }
    if((nextProps.data.trip)&& (_.isEmpty(nextProps.tripPoint))){
      let treeData =[];
      nextProps.data.trip.tripPoints.map(ptn =>{
        let temp = {}
        const title = ptn.activitylocation.title
        temp = {...ptn}
        temp['title']= title
        treeData.push(temp)
      })
      this.setState({
        treeData
      },() => { return})
    }
  }
  componentDidUpdate(){
    this.props.sendTreeData(this.state.treeData)
  }

  addImage({node}){
    this.setState({
      selectPoint : node.id
    }, () =>{
      this.childImage.openModal()
    })
  }
  addNote({node}){
    this.setState({
      selectPoint : node.id
    }, () =>{
      this.childNote.openModal()
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
    const styl ={
      color: 'blue',
    }
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          canDrop={canDrop}
          getNodeKey={({ node }) => node.id}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <Popup
                trigger={<Icon name='add' style={{display: 'inline'}} rotated={'clockwise'} />}
                hoverable={true}
                >
                <Popup.Content>
                  <Button
                    onClick={this.handleDeleteClick.bind(this, {getNodeKey,node,path})}
                    icon='trash outline'
                  />
                  <Button
                    onClick={this.addImage.bind(this, {node})}
                    icon="image"
                  />
                  <Button
                    icon="record"
                  />
                  <Button
                    onClick={this.addNote.bind(this, {node})}
                    icon="sticky note outline"
                  />
                </Popup.Content>
              </Popup>
            ],
          })}
        />
        <div>
          <ImageUploadModal
            onRef={ref =>{this.childImage = ref}}
            pointId={this.state.selectPoint}
          />
        </div>
        <div>
          <BlogModal
          onRef={ref =>{this.childNote = ref}}
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
