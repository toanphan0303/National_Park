import React, {Component} from 'react'
import Modal from 'react-modal';
import Blog from '../Blog'
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
    overflow              : 'scroll'             
  }
};
class ImageUploadModal extends Component{
  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
  this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
        <h2 ref={subtitle => this.subtitle = subtitle}>Create a note for for this location</h2>
        <Blog
          pointId={this.props.pointId}
        />
        <Divider horizontal></Divider>
        <button onClick={this.closeModal}>Cancel</button>
      </Modal>
    );
  }
}

export default ImageUploadModal
