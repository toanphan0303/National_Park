import React , {Component} from 'react'
import {Button, Form,Comment, Label, Icon} from 'semantic-ui-react'
import {graphql, compose} from 'react-apollo';
import addLikeToComment from '../mutations/addLikeToComment'
import fetchCurrentUser from '../queries/CurrentUser'
import _ from 'lodash'
class Comments extends Component {
  constructor(props){
    super(props)

  }
  handleAddLike = async(e) =>{
    const commentId = e.target.id
    const userId = this.props.data.user.id
    const res =await this.props.addLikeToComment({
      variables:{
        userId,
        commentId
      }
    })
    return await this.props.sendNewLikeAmount()
  }
  renderComments(){
    const userId = this.props.data.user.id
    const defaultImg ='https://s3.amazonaws.com/user-upload-image/icons/profile-clipart-default-user-5.png'
    return this.props.comments.map(comment =>{
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
                <Comment.Text style={{display:'inline-flex'}}>
                  {comment.content}
                </Comment.Text>
                <Button as='div' labelPosition='right' style={{marginLeft:'70px', marginTop:'-10px'}}>
                  <Button basic  disabled={liked} id={comment.id} onClick ={this.handleAddLike.bind(this)} color='blue' size='mini'>
                    <Icon name='like' />
                    Like
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
  graphql(fetchCurrentUser)
)(Comments);
