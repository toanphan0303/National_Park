import React from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import moment from "moment";
import { compose, graphql } from "react-apollo";
import _ from 'lodash'
import s3Sign from './mutations/signS3'
import addImage from './mutations/addImage'
import fetchImg from './queries/fetchPoint'
import deleteImage from './mutations/deleteImage'
import { Card,Image,Button } from 'semantic-ui-react'
import '../style/ImageUpload.css'

class Upload extends React.Component {
  state = {
    files: [],
    images:[],
    errors:{},
    buttonLoading: false
  };

  onDrop = async files => {
    this.setState({ files});
  };

  uploadToS3 = async (file, signedRequest) => {
    const options = {
      headers: {
        "Content-Type": file.type
      }
    };
    return await axios.put(signedRequest, file, options);
  };
  componentWillReceiveProps(nextProps){
    if(!nextProps.data.loading){
      const {images} = nextProps.data.tripPoint
      this.setState({
        images
      })
    }
  }
  handleDeleteImg(e){
    const imgId = e.target.id
    this.props.deleteImage({
      variables:{
        pointId: this.props.pointId,
        imgId
      },
      refetchQueries: [{query:fetchImg, variables:{id:this.props.pointId} }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({errors})
    })
  }
  handleDeleteAddImage(e){
    const {files} = this.state
    _.remove(files, (f) =>{
      return f.preview === e.target.id
    })
    this.setState({
      files
    })
  }

  renderImages(){
    return this.state.images.map(img =>{
      return(
        <Card key={img.name}>
          <div className='img-wrap'>
            <span className='close' onClick={this.handleDeleteImg.bind(this)} id={img.id}>&times;</span>
            <Image src={img.url} />
          </div>
        </Card>
      )
    })
  }
  formatFilename = filename => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newFilename = `images/${date}-${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
  };
  submit= async () =>{
    this.setState({
      buttonLoading: true
    })
    const {files } = this.state;
    files.map(async (file) =>{
      const response = await this.props.s3Sign({
        variables: {
          filename: this.formatFilename(file.name),
          filetype: file.type
        }
      });
      const { signedRequest, url } = response.data.signS3;
      await this.uploadToS3(file, signedRequest);
      await this.props.addImage({
        variables:{
          pointId: this.props.pointId,
          title: file.name,
          url
        },
        refetchQueries: [{query:fetchImg, variables:{id:this.props.pointId} }]
      })
      this.setState({
        buttonLoading: false,
        files: [],
      })
    })
  }
  render() {
    if(this.props.data.loading){
      return(
        <div>Loading...</div>
      )
    }
    return (
      <div>
        <Dropzone style={{width:'80px', height:'80px', borderWidth:'2px', borderColor:'rgb(102,102,102)', borderStyle:'dashed', borderRadius:'5px'}} onDrop={this.onDrop}>
          {({ isDragActive, isDragReject }) => {
            if (isDragActive) {
              return "All files will be accepted";
            }
            if (isDragReject) {
              return "Some files will be rejected";
            }
            return "Dropping some files here...";
          }}
        </Dropzone>
        <Button primary loading={this.state.buttonLoading} style={{marginTop:'10px'}} onClick={this.submit}>Submit</Button>
        <Card.Group itemsPerRow={7}>
          {
            this.state.files.map(f => {
                return (
                    <Card key={f.name} color="blue">
                    <div className='img-wrap'>
                      <span className='close' onClick={this.handleDeleteAddImage.bind(this)} id={f.preview}>&times;</span>
                      <Image src={f.preview} />
                    </div>
                      <Card.Description>
                        <div>{f.name} {f.size}</div>
                      </Card.Description>
                    </Card>
                )
            })
          }
        </Card.Group>
        <div style={{marginTop:'30px'}} >
          <h4> Your images for this location </h4>
          <Card.Group itemsPerRow={7}>
            {this.renderImages()}
          </Card.Group>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(s3Sign, { name: "s3Sign" }),
  graphql(addImage, {name:"addImage"}),
  graphql(deleteImage, {name: "deleteImage"}),
  graphql(fetchImg, {
    options:(props) => {return{ variables: {id: props.pointId}}}
  })
)(Upload)
