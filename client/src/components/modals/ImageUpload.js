import React, {Component} from 'react'
import Modal from 'react-modal';
import ImageUpload from '../ImageUpload'
import { Segment, Button, Divider } from 'semantic-ui-react'
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
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
        <h2 ref={subtitle => this.subtitle = subtitle}>Upload Image for this location</h2>
        <ImageUpload
          pointId={this.props.pointId}
        />
        <Divider horizontal></Divider>
        <button onClick={this.closeModal}>Cancel</button>
      </Modal>
    );
  }
}

export default ImageUploadModal
