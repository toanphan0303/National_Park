import React, {Component} from 'react';
import {graphql, compose, withApollo} from 'react-apollo';
import query from './queries/CurrentUser';
import logOut from './mutations/Logout'
import AuthModal from './modals/AuthMo.js'
import fetchParkName from './queries/fetchParkName'
import {hashHistory} from 'react-router';
import'../style/header.css'
import { Search, Menu, Segment, Feed, Image, Button} from 'semantic-ui-react'
import sourceSearch from '../static_assets/sourceSearch'
import _ from 'lodash'
class Header extends Component {
  constructor(props){
    super(props);
    this.State=({
      userName: null,
      isLoading:false,
      results:[],
      value:''
    })
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.handleQuery = this.handleQuery.bind(this)
  }
  componentWillMount() {
   this.resetComponent()
  }
  resetComponent = () => {
    this.setState({ isLoading: false, results: [], value: '' })
  }
  // fetch park ID when select park in search
  handleQuery(title){
    return this.props.client.query({
      query: fetchParkName,
      variables: {title}
    })
    .then(data =>{
      console.log(data)
      const {id} = data.data.parkName
      const url = window.location.href +'parks/'+id

      window.location= url
    })
  }
  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title }, () =>{
      this.handleQuery(this.state.value)
    })
  }
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(sourceSearch, isMatch),
      })
    }, 500)
  }
  getCurrentUser(id){
    if(!id){
      this.setState({
        userName: null
      })
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
  openLogin(){
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
        <div style={{display:'inline-flex'}} >
          {user.avatar===null ?
              <Feed.Label size='small'>
                <img style={{borderColor:"#bababc", borderRadius:"50px", borderWidth:"medium", borderStyle:"solid", width:"45px", marginTop:"4px"}} src='https://s3.amazonaws.com/user-upload-image/icons/profile-clipart-default-user-5.png' />
              </Feed.Label>:
              <Feed.Label>
                <img src={user.avatar}  style={{borderColor:"#bababc", borderRadius:"50px", borderWidth:"medium", borderStyle:"solid", width:"45px", marginTop:"4px"}}/>
              </Feed.Label>
          }
          <Menu.Item name="Log out" onClick={this.onLogout.bind(this)} />
        </div>
      )
    } else{
      return(
        <div style={{display: 'inline-flex'}}>
          <Menu.Item name='Sign up' onClick={this.openSignup.bind(this)} />
          <Menu.Item name='Log in' onClick={this.openLogin.bind(this)} />
        </div>
      )
    }
  }
  render() {
       const { isLoading, value, results } = this.state
    return (
    <Segment size='mini' style={{margin:0, padding:'4px'}}>
      <Menu secondary >
        <Menu.Item name='home' onClick={this.gotoPath.bind(this,'/')} />
        <Menu.Item name='My Trip' onClick={this.gotoPath.bind(this,'/parks/trips/summary')} />
        <Menu.Item name='Following'/>
        <div>
          <Search
            size="mini"
            style={{paddingTop:"10px"}}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
          />
        </div>
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
export default compose(
  withApollo,
  graphql(logOut),
  graphql(query)
)(Header);
