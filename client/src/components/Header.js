import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import query from './queries/CurrentUser';
import mutation from './mutations/Logout'
import AuthModal from './modals/AuthModal.js'
import {hashHistory} from 'react-router';
import { Search, Menu, Segment} from 'semantic-ui-react'
class Header extends Component {
  constructor(props){
    super(props);
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.State=({
      userName: null
    })
  }
  getCurrentUser(id){
    if(!id){
      console.log(id)
      this.setState({
        userName: null
      })
    }
  }
  componentWillUpdate(nextProps){
  if(!this.props.data.user && nextProps.data.user){

    }
  }
  onLogout(){
    this.props.mutate({
      refetchQueries: [{query}]
    })
  }
  // call child method from parent component
  toggleModal (){
    this.child.openModal()
  }
  gotoPath(path){
    hashHistory.push(path)
  }
  renderItems(){
    const {loading, user} = this.props.data;
    if(loading){
      return (<div>...</div>)
    }
    if(user){
      return (
        <Menu.Item name="Log out" onClick={this.onLogout.bind(this)} />
      )
    } else{
      return(
        <Menu.Item name='Sign up or Log in' onClick={this.toggleModal.bind(this)} />
      )
    }
  }
  render() {
    return (
    <Segment size='mini'>
      <Menu secondary>
        <Menu.Item name='home' onClick={this.gotoPath.bind(this,'/')} />
        <Menu.Item name='My Trip' onClick={this.gotoPath.bind(this,'/parks/trips/summary')} />
        <Menu.Item name='friends'/>
        <Menu.Menu position='right'>
            {this.renderItems()}
        </Menu.Menu>
      </Menu>
        <div>
          <AuthModal
            onRef={ref =>{this.child = ref}}
            sendCurrentUser={this.getCurrentUser}
          />
        </div>
    </Segment>
    )
  }
}
export default graphql(mutation)(
  graphql(query)(Header));
