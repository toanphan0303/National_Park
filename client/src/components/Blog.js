import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import React, {Component} from 'react'
import {Grid, Image, Segment, Card, Button} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import fetchPoint from './queries/fetchPoint'
class BlogEditor extends Component {
  constructor(props){
    super(props)
    this.state= {
      text: "",
      images:[]
    }
    this.handleChange = this.handleChange.bind(this)
  }

  modules() {
    return{
      toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3] }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image', 'video']
      ]
    }
  }
  handleChange(value){
    this.setState({text: value})
  }
  handleCustomToolbarButton() {
    const range = this.quillRef.getEditor().getSelection();
    this.fetchImage()
    let value = ""
    if(value){
      this.quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
    }
  }
  selectImage(image){
    const range = this.quillRef.getEditor().getSelection();
    if(image){
      this.quillRef.getEditor().insertEmbed(range.index, 'image', image, "user");
    }
  }
  fetchImage(){
    const {images} = this.props.data.tripPoint
    this.setState({
      images
    })
  }
  componentDidUpdate(){
      const toolbar = this.quillRef.getEditor().getModule('toolbar')
      toolbar.addHandler( 'image', this.handleCustomToolbarButton.bind(this) )
  }

  render(){
    if(!this.props.data.tripPoint){
      return <div>Loading....</div>
    }
    return(
      <div>
        <Grid>
          <Grid.Column  width={10}>
            <Segment>
              <Button content='Save' primary />
            </Segment>
            <Segment>
              <ReactQuill
                theme="snow"
                value={this.state.text}
                onChange={this.handleChange}
                modules={this.modules()}
                ref={(el) => this.quillRef = el}
              />
            </Segment>
          </Grid.Column >
          <Grid.Column  width={6}>
            <Card.Group itemsPerRow={2}>
              {
                this.state.images.map(image =>{
                  return (
                    <Card
                      key={image.id}
                      onClick={this.selectImage.bind(this, image.url)}
                    >
                      <Image src={image.url} height={200} width={200} mode={'fill'}/>
                    </Card>
                  )
                })
              }
            </Card.Group>
          </Grid.Column >
        </Grid>
      </div>
    )
  }
}


export default compose(
  graphql(fetchPoint,{
    options: (props) => { return {variables: { id: '5aa1c81b0fc72c138e2c95e3'}}}
  })
)(BlogEditor)
