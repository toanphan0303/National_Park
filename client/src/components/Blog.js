import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import React, {Component} from 'react'
import {Grid, Image, Segment, Card, Button, Form} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import fetchPoint from './queries/fetchPoint'
import addNote from './mutations/addNote'
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/ImageResize', ImageResize);
class BlogEditor extends Component {
  constructor(props){
    super(props)
    this.state= {
      text: "",
      images:[],
      title:""
    }
    this.handleChange = this.handleChange.bind(this)
  }

  modules() {
    return {
      toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3] }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image', 'video']
      ],
      ImageResize: {
         modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
      }
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
  componentWillReceiveProps(nextProps){
    this.setState({

    })
  }
  componentDidUpdate(){
      const toolbar = this.quillRef.getEditor().getModule('toolbar')
      toolbar.addHandler( 'image', this.handleCustomToolbarButton.bind(this) )
  }
  saveNote= async() =>{
    const content = this.state.text
    const {title} = this.state
    const pointId = this.props.data.variables.id
    await this.props.addNote({
      variables: {pointId, title, content}
    })
  }
  renderImage(){
    const {images} = this.state;
    if(!images.length){
      return(
        <div>
          <p>To embed image to your note, please upload your image for this location </p>
        </div>
      )
    } else{
      return images.map(image =>{
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
  }
  render(){
    if(!this.props.data.tripPoint){
      return <div>Loading....</div>
    }
    return(
      <div>
        <Grid>
          <Grid.Column width={10}>
            <Segment>
              <Form>
                <Form.Field>
                  <Form.Input placeholder='My Trip to Yellow Stone' onChange={(e) => {this.setState({title:e.target.value})}} />
                </Form.Field>
                <Button type='submit' onClick={this.saveNote.bind(this)}>Save</Button>
              </Form>
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
            <Segment>
              <Card.Group itemsPerRow={2}>
                {this.renderImage()}
              </Card.Group>
            </Segment>
          </Grid.Column >
        </Grid>
      </div>
    )
  }
}


export default compose(
  graphql(fetchPoint,{
    options: (props) => { return {variables: { id: props.pointId}}}
  }),
  graphql(addNote, {
    name:"addNote"
  })
)(BlogEditor)
