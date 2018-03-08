import React, { Component} from 'react';
import ReactModalLogin from 'react-modal-login';
import {facebookConfig, googleConfig} from '../../../config/socialConfig';
import SignupMutation from '../mutations/Signup';
import query from '../queries/CurrentUser';
import LoginMutation from '../mutations/Login';
import {graphql, compose} from 'react-apollo';

class AuthModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loading: false,
      error: []
    };
  }
  // Calling clild method from parent. This code place in child component
  componentDidMount() {
  this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  openModal(){
    this.setState({
      showModal: true,
    })
  }
  closeModal(){
    this.setState({
      showModal: false,
      error: null
    })
  }
  onLoginSuccess(method, response){
    console.log('logged success with ', method)
    this.closeModal();
    this.setState({
      loggedIn: method,
      loading: false
    })
  }
  onLoginFail(method, response){
    console.log('logged failed with ', method)
    this.setState({
      loading:false,
      error: response
    })
  }
  startLoading(){
    this.setState({
      loading: true
    })
  }
  finishLoading(){
    this.setState({
      loading:false
    })
  }
  onTabsChange(){
    this.setState({
      error:null
    })
  }
  onRegister(){
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    return this.props.signupUser({
      variables: {email, password},
      refetchQueries:[{query}]
    }).catch(res => {
      const error = res.graphQLErrors.map(error => error.message)
      this.setState({error})
    })
      .then((data) => {
        if(data){
          this.closeModal();
        }
      })

  }
  onLogin(e){
    console.log(e)
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    return this.props.loginUser({
      variables: {email, password},
      refetchQueries:[{query}]
    }).catch(res => {
      const error = res.graphQLErrors.map(error => error.message)
      this.setState({error})
    })
      .then((data) => {
        console.log(data)
        if(data){
          this.props.sendCurrentUser(data)
          this.closeModal();
        }
      })
  }
  render(){
    return (
      <div>
        <ReactModalLogin
          visible={this.state.showModal}
          onCloseModal={this.closeModal.bind(this)}
          loading={this.state.loading}
          error={this.state.error}
          bottomLoginContainer="input-field"
          tabs={{
            onChange: this.onTabsChange.bind(this)
          }}
          loginError= {{
            label:`${this.state.error}`
          }}
          registerError={{
            label:`${this.state.error}`
          }}
          startLoading={this.startLoading.bind(this)}
          finishLoading={this.finishLoading.bind(this)}
          providers={{
            facebook: {
              config: facebookConfig,
              onLoginSuccess: this.onLoginSuccess.bind(this),
              onLoginFail: this.onLoginFail.bind(this),
              label: "Continue with Facebook"
            },
            google: {
              config: googleConfig,
              onLoginSuccess: this.onLoginSuccess.bind(this),
              onLoginFail: this.onLoginFail.bind(this),
              label: "Continue with Google"
            }
          }}
          form = {{
            onRegister:  this.onRegister.bind(this),
            onLogin: this.onLogin.bind(this),
            loginBtn: {
              label: "Login",
              buttonClass: "waves-effect waves-light btn-small"
            },
            registerBtn: {
              buttonClass: "waves-effect waves-light btn-small",
              label: "Sign up"
            },
            loginInputs:[
                {type: "email",name: 'Email',label: 'Email',placeholder: 'letgo@email.com', id:"email"},
                {type: "password",name: 'password',label: 'Password',placeholder: 'Enter password', id:"password"}
            ],
            registerInputs: [
              {type: "email",name: 'Email',label: 'Email',placeholder: 'letgo@email.com',id:'email'},
              {type: "password",name: 'password',label: 'Password',placeholder: 'Enter password',id:'password'}
            ]
          }}
        />
      </div>
    )
  }
}

export default compose(
  graphql(SignupMutation,{
  name:'signupUser'
})
,graphql(LoginMutation, {
  name:'loginUser'
}),
graphql(query)
)(AuthModal);
