import React, {Component} from 'react'
import Modal from 'react-modal';
import SignupComponent from '../Auth/Signup'
import LoginComponent from '../Auth/Login'
import {hashHistory} from 'react-router'
import { Segment, Button, Divider } from 'semantic-ui-react'
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    height                : '500px',
    padding               : '15px 20px'
  }
};
class AuthModal extends Component{
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      login: false,
      signup: false
    };

    this.openModalSignUp = this.openModalSignUp.bind(this);
    this.openModalLogin = this.openModalLogin.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
  this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  openModalSignUp() {
    this.setState({
      modalIsOpen: true,
      login: false,
      signup: true
    });
  }
  openModalLogin() {
    this.setState({
      modalIsOpen: true,
      login: true,
      signup: false
    });
  }

  afterOpenModal() {
    this.subtitle.style.color = '#000';
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      login: false,
      signup: false
    },() =>{
      hashHistory.push('/')
    });
  }
  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        {this.state.login && !this.state.signup && <div>
          <h2 style={{color:'black'}} ref={subtitle => this.subtitle = subtitle}>Login</h2>
          <LoginComponent callCloseModal={this.closeModal.bind(this)} />
        </div>}
        {!this.state.login && this.state.signup && <div>
          <h2 style={{color:'black'}} ref={subtitle => this.subtitle = subtitle}>Join Us</h2>
          <SignupComponent callCloseModal={this.closeModal.bind(this)} />
        </div>}

        <Divider horizontal></Divider>
      </Modal>
    );
  }
}

export default AuthModal;
