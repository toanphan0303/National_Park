import React, { Component } from "react";
import { render } from "react-dom";
import SortableTree, {removeNodeAtPath} from "react-sortable-tree";
import 'react-sortable-tree/style.css';
import {Icon} from 'semantic-ui-react'

export default class TripSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: []
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
      },() => { return })
    }
  }
  componentDidUpdate(){
    this.props.sendTreeData(this.state.treeData)
  }

  render() {
    const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
      if (nextParent) {
        return false;
      }
      return true;
    };
    const getNodeKey = ({ treeIndex }) => treeIndex;
    return (
      <div style={{ height: 300 }}>
        <SortableTree
          treeData={this.state.treeData}
          canDrop={canDrop}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <button
                onClick={() =>
                  this.setState(state => ({
                    treeData: removeNodeAtPath({
                      treeData: state.treeData,
                      path,
                      getNodeKey,
                    }),
                  }))
                }
              >
                <Icon name="trash outline" />
              </button>,
            ],
          })}
        />
      </div>
    );
  }
}
