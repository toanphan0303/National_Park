import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import query from './queries/CurrentUser';
import mutation from './mutations/Logout'
import AuthModal from './modals/AuthMo.js'
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
  openSignup(){
    this.child.openModalSignUp()
  }
  OpenLogin(){
    this.child.openModalLogin()
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
        <div style={{display: 'inline-flex'}}>
          <Menu.Item name='Sign up' onClick={this.openSignup.bind(this)} />
          <Menu.Item name='Log in' onClick={this.OpenLogin.bind(this)} />
        </div>
      )
    }
  }
  render() {
    return (
    <Segment size='mini' style={{margin:0, padding:'4px'}}>
      <Menu secondary >
        <Menu.Item name='home' onClick={this.gotoPath.bind(this,'/')} />
        <Menu.Item name='My Trip' onClick={this.gotoPath.bind(this,'/parks/trips/summary')} />
        <Menu.Item name='Following'/>
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
