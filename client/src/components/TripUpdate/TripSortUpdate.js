import React, { Component } from "react";
import fetchTrip from '../queries/fetchTrip'
import deleteTripPoint from '../mutations/deleteTripPoint'
import togglePublicSetting from '../mutations/togglePublicSetting'
import omitPointFromTrip from '../mutations/omitPointFromTrip'
import SortableTree, {removeNodeAtPath} from "react-sortable-tree";
import ImageUploadModal from '../modals/ImageUploadModal'
import BlogModal from '../modals/BlogModal'
import 'react-sortable-tree/style.css';
import {Icon, Popup, Button, Loader,Dimmer, Form, Checkbox} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
class TripSortUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectPoint: "",
      public: false
    };
  }
  componentDidMount(){
    this.setState({
      treeData: [...this.state.treeData]
    }, () =>{ return})
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
        treeData,
        public : nextProps.data.trip.public
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
  togglePublicSetting = async() =>{
    const publicState = !this.state.public
    await this.props.togglePublicSetting({
      variables: { tripId: this.props.tripId, value: publicState},
      refetchQueries: [{query:fetchTrip, variables:{id:this.props.tripId} }]
    }).catch(res => {
      this.setState({
        public: publicState
      })
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({errors})
    })
  }
  handleDeleteClick = async({getNodeKey,node, path}) =>{
    const deletePoint = (id) => {
      return this.props.deleteTripPoint({
        variables: {id}
      }).catch(res => {
        const errors = res.graphQLErrors.map(error => error.message)
        this.setState({errors})
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
    if(!this.props.data.trip){
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
    const getNodeKey = ({ treeIndex }) => treeIndex;
    return (
      <div style={{ height:'435px' }}>
        <div style={{display:'inline-flex'}}>
          <h4 style={{paddingRight:'10px'}}>Your Trip</h4>
          <Form.Field>
            <Checkbox slider style={{height:'10px'}} onChange={this.togglePublicSetting.bind(this)} label='Visible to public' checked={this.state.public}  />
          </Form.Field>
        </div>
        <SortableTree
          treeData={this.state.treeData}
          canDrop={canDrop}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <button
                onClick={this.handleDeleteClick.bind(this, {getNodeKey,node,path})}
                >
                <Icon name="trash outline" />
              </button>,
              <Popup
                trigger={<Icon name='add' style={{display: 'inline'}} rotated={'clockwise'} />}
                hoverable={true}
                >
                <Popup.Content>
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
  graphql(togglePublicSetting, {
    name: 'togglePublicSetting'
  }),
  graphql(fetchTrip, {
    options: (props) => { return {variables: { id: props.tripId}}}
  })
)(TripSortUpdate)
