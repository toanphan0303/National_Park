import React, {Component} from 'react'
import {Image,Divider, Form, Button} from 'semantic-ui-react'
import LoginMutation from '../mutations/Login';
import fetchCurrentUser from '../queries/CurrentUser';
import {graphql, compose} from 'react-apollo';
class Signup extends Component {
  constructor(props){
    super(props)
    this.state= {
      email: "",
      password: "",
      errors: []
    }
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
  handleSignup(){
    const {email, password} = this.state
    return this.props.loginUser({
      variables: {email, password},
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
          <Form.Input fluid label='Email' placeholder='Email' size="small" onChange={this.handleEmail.bind(this)} />
          <Form.Input fluid label='Password' type='password' size="small"  placeholder='password' onChange={this.handlePassword.bind(this)} />
          <div style={{ color: '#D8000C' ,backgroundColor: '#FFD2D2'}}>
            {!_.isEmpty(this.state.errors) && this.state.errors.map(error =><div key={error}>{error}</div>)}
          </div>
          <Form.Button onClick={this.handleSignup.bind(this)}>Login</Form.Button>
        </Form>
      </div>
    )
  }
}

export default compose(
  graphql(LoginMutation, {
    name:'loginUser'
  }),
  graphql(fetchCurrentUser)
)(Signup);
