import React , {Component} from 'react'
import {Button, Form,Comment, Label, Icon,Popup} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import addLikeToComment from '../mutations/addLikeToComment'
import unlikeToComment from '../mutations/unlikeToComment'
import removeCommentFromTrip from '../mutations/removeCommentFromTrip'
import editCommentContent from '../mutations/editCommentContent'
import fetchCurrentUser from '../queries/CurrentUser'
import fetchTrip from '../queries/fetchTrip'
import _ from 'lodash'
class Comments extends Component {
  constructor(props){
    super(props)
    this.state={
      comments:[],
      editCommentId: '',
      editCommentContent: ''
    }
    this.handleAddLike = this.handleAddLike.bind(this)
    this.handleUnlike = this.handleUnlike.bind(this)
    this.renderComments = this.renderComments.bind(this)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.trip.trip || nextProps.trip.trip.comments != this.state.comments){
      this.setState({
        comments: nextProps.trip.trip.comments
      })
    }
  }
  handleLike = async(param, commentId, e) =>{
     e.preventDefault()
    if(_.isEmpty(param)){
      const userId = this.props.data.user.id
      return await this.handleAddLike({userId, commentId})
    } else{
      const likeId = param[0].id
      return this.handleUnlike({commentId, likeId})
    }
  }
  handleAddLike = async({userId, commentId}) =>{
    await this.props.addLikeToComment({
      variables:{
        userId,
        commentId
      },
      refetchQueries: [{query:fetchTrip, variables:{id:this.props.id} }]
    })
  }
  handleUnlike= async({commentId, likeId}) =>{
    await this.props.unlikeToComment({
      variables:{
        commentId,
        likeId
      },
      refetchQueries: [{query:fetchTrip, variables:{id:this.props.id} }]
    })
  }
  handleEditComment = (editCommentId,editCommentContent, e) =>{
    this.setState({
      editCommentId,
      editCommentContent
    })
  }
  handleEditCommentContent(e){
    this.setState({
      editCommentContent: e.target.value
    })
  }
  handleSaveUpdateComment = async() =>{
    await this.props.editCommentContent({
      variables:{
        commentId: this.state.editCommentId,
        content: this.state.editCommentContent
      },
      refetchQueries: [{query:fetchTrip, variables:{id:this.props.id} }]
    })
    await this.setState({
      editCommentId:''
    })
  }
  handleRemoveComment= async(commentId, e) =>{
    const tripId = this.props.id
    await this.props.removeCommentFromTrip({
      variables:{
        tripId,
        commentId
      },
      refetchQueries: [{query:fetchTrip, variables:{id:this.props.id} }]
    })
  }
  renderComments(){
    const userId = this.props.data.user.id
    const defaultImg ='https://s3.amazonaws.com/user-upload-image/icons/profile-clipart-default-user-5.png'
    return this.state.comments.map(comment =>{
      let liked = false
      const userAlreadyLiked = _.filter(comment.likes, _.matches({user:{id:`${userId}`}}))
      _.isEmpty(userAlreadyLiked) ? liked=false : liked= true
      const likeAmount = comment.likes.length
      return(
        <div key={comment.id}>
          <Comment style={{display:'inline-flex', padding:'10px 20px'}}>
            {comment.user.avatar?<Comment.Avatar src={comment.user.avatar}/> :<Comment.Avatar src={defaultImg}/> }
            <Comment.Content style={{paddingLeft: '10px'}}>
              <Comment.Author as='a'>{comment.user.firstName} {comment.user.lastName}</Comment.Author>
              <div>
                {this.state.editCommentId !== comment.id && userId === comment.user.id ?
                  <Popup
                    trigger={
                      <Comment.Text style={{display:'inline-flex'}}>
                        {comment.content}
                      </Comment.Text>
                    }
                    hoverable={true}
                    position='right center'
                    size='mini'
                  >
                    <Popup.Content>
                    <Button
                      onClick={this.handleRemoveComment.bind(this, comment.id)}
                      icon="trash outline"
                      size='mini'
                    />
                    <Button
                      onClick={this.handleEditComment.bind(this, comment.id, comment.content)}
                      icon="write"
                      size='mini'
                    />
                    </Popup.Content>
                  </Popup>: this.state.editCommentId !== comment.id && userId !== comment.user.id?
                  <Comment.Text style={{display:'inline-flex'}}>
                    {comment.content}
                  </Comment.Text> :
                  <Form style={{display:'table-caption'}}>
                    <input style={{width:'300px', height:'40px'}} value={this.state.editCommentContent} onChange={this.handleEditCommentContent.bind(this)} />
                    <Button onClick={this.handleSaveUpdateComment.bind(this)}>Save</Button>
                  </Form>
                }
                <Button as='div' labelPosition='right' style={{marginLeft:'70px', marginTop:'-10px'}}>
                  <Button basic onClick ={this.handleLike.bind(this, userAlreadyLiked, comment.id)} color='blue' size='mini'>
                    <Icon name='like' />
                      {liked? <span>unlike</span> : <span>like</span>}
                  </Button>
                  <Label as='a' basic color='red' pointing='left'>{likeAmount}</Label>
               </Button>
              </div>
            </Comment.Content>
          </Comment>
        </div>
      )
    })
  }
  render() {
    return (
      <div style={{display:'inline-grid'}}>
        {this.renderComments()}
      </div>
    )
  }
}

export default compose(
  graphql(addLikeToComment,{
    name:'addLikeToComment'
  }),
  graphql(unlikeToComment, {
    name:'unlikeToComment'
  }),
  graphql(removeCommentFromTrip, {
    name:'removeCommentFromTrip'
  }),
  graphql(editCommentContent,{
    name:'editCommentContent'
  }),
  graphql(fetchCurrentUser, {
    name:'data'
  }),
  graphql(fetchTrip, {
    name:'trip',
    options: (props) => { return {variables: { id: props.id}}}
  })

)(Comments);
