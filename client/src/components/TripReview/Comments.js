import React , {Component} from 'react'
import {Button, Form,Comment} from 'semantic-ui-react'


class Comments extends Component {

  renderComments(){
    const defaultImg ='https://s3.amazonaws.com/user-upload-image/icons/profile-clipart-default-user-5.png'
    return this.props.comments.map(comment =>{
      return(
        <div key={comment.id}>
          <Comment style={{display:'inline-flex', padding:'10px 20px'}}>
            {comment.user.avatar?<Comment.Avatar src={comment.user.avatar}/> :<Comment.Avatar src={defaultImg}/> }
            <Comment.Content style={{paddingLeft: '10px'}}>
              <Comment.Author as='a'>{comment.user.firstName} {comment.user.lastName}</Comment.Author>
              <Comment.Text>
                {comment.content}
              </Comment.Text>
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

export default Comments;
