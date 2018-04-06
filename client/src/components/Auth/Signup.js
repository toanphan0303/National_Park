import React, {Component} from 'react'
import {Image,Divider, Form, Button, Message} from 'semantic-ui-react'
import SignupMutation from '../mutations/Signup';
import fetchCurrentUser from '../queries/CurrentUser';
import {graphql, compose} from 'react-apollo';
import _ from 'lodash'
class Signup extends Component {
  constructor(props){
    super(props)
    this.state= {
      email: "",
      password: "",
      firstName:"",
      lastName:"",
      errors: []
    }

  }
  validateField(firstName,lastName,email, password) {
    let errors=[]
    this.setState({
      errors
    })
    if(!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
      errors.push('email is invalid')
    }
    if(password.length < 6){
      errors.push(' password must has more than 6 characters');
    }
    if(firstName.length === 0){
      errors.push(' Please provide first name');
    }
    if(lastName.length === 0){
      errors.push(' Please provide last name');
    }
    this.setState({
      errors
    }, () =>{
      return
    })
  }
  handleEmail(e){
    this.setState({
      email: e.target.value
    })
  }
  handlePassword(e){
    this.setState({
      password: e.target.value
    })
  }
  handleFirstName(e){
    this.setState({
      firstName: e.target.value
    })
  }
  handleLastName(e){
    this.setState({
      lastName: e.target.value
    })
  }
  handleSignup(){
    const {email, password, firstName, lastName} = this.state
    this.validateField(firstName,lastName,email, password)
    if(!_.isEmpty(this.state.errors)){
      return
    }
    return this.props.signupUser({
      variables: {email, password, firstName, lastName},
      refetchQueries:[{query:fetchCurrentUser}]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({errors})
    })
      .then((data) => {
        if(data){
          this.props.callCloseModal();
        }
      })
  }
  render(){
    return (
      <div>
        <div>
          <Image style={{marginLeft: "35px", width:"275px"}}
            src='https://s3.amazonaws.com/user-upload-image/icons/rga5y.png'
            size='medium'
            href='/auth/fb'
          />
        </div>
        <br />
        <div>
          <Image style={{marginLeft: "35px",width:"275px"}}
            src='https://s3.amazonaws.com/user-upload-image/icons/google-icon.png'
            size='medium'
            href='/auth/google'
          />
        </div>
        <Divider style={{maxWidth: '350px', backgroundColor:"white"}} horizontal>Or</Divider>
        <Form>
          <Form.Group>
            <Form.Input style={{width:'170px'}} fluid label='First Name' size="small"  placeholder='Frist Name' onChange={this.handleFirstName.bind(this)} />
            <Form.Input style={{width:'170px'}} fluid label='Last Name' size="small"  placeholder='Last Name' onChange={this.handleLastName.bind(this)} />
          </Form.Group>
          <Form.Input fluid label='Email' placeholder='Email' size="small" onChange={this.handleEmail.bind(this)} />
          <Form.Input fluid label='Password' type='password' size="small"  placeholder='password' onChange={this.handlePassword.bind(this)} />
          <div style={{ color: '#D8000C' ,backgroundColor: '#FFD2D2'}}>
          </div>
          <Form.Button onClick={this.handleSignup.bind(this)}>Sign Up</Form.Button>
        </Form>
        {!_.isEmpty(this.state.errors) &&
          <Message negative>
            <Message.Header>Errors</Message.Header>
              <Message.List items={this.state.errors} />
          </Message>}
      </div>
    )
  }
}

export default compose(
  graphql(SignupMutation,{
  name:'signupUser'
}),
graphql(fetchCurrentUser)
)(Signup);
