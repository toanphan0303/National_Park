import React from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import moment from "moment";
import { compose, graphql } from "react-apollo";
import _ from 'lodash'
import s3Sign from './mutations/signS3'
import addImageUrl from './mutations/addImageUrl'
import { Card,Image } from 'semantic-ui-react'

class Upload extends React.Component {
  state = {
    files: []
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

  formatFilename = filename => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newFilename = `images/${date}-${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
  };
  getArrayUrl= async () =>{
    const {files } = this.state;
    let imgUrl =[]
    await Promise.all(files.map(async (file) =>{
      const response = await this.props.s3Sign({
        variables: {
          filename: this.formatFilename(file.name),
          filetype: file.type
        }
      });
      const { signedRequest, url } = response.data.signS3;
      await this.uploadToS3(file, signedRequest);
      imgUrl.push(url)
    }))
    return imgUrl
  }
  submit = async () => {
    const imgUrl = await this.getArrayUrl()
    await this.props.addImageUrl({
      variables:{
        pointId: this.props.pointId,
        imgUrl
      }
    })
  };

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop}>
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
        <button onClick={this.submit}>Submit</button>
        <Card.Group itemsPerRow={7}>
          {
            this.state.files.map(f => {
                return (
                    <Card key={f.name} color="blue">
                      <Image src={f.preview} />
                      <Card.Description>
                        <div>{f.name} {f.size}</div>
                      </Card.Description>
                    </Card>
                )
            })
          }
        </Card.Group>
      </div>
    );
  }
}

export default compose(
  graphql(s3Sign, { name: "s3Sign" }),
  graphql(addImageUrl, {name:"addImageUrl"}),
)(Upload)
