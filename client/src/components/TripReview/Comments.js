import React , {Component} from 'react'
import {Button, Form,Comment} from 'semantic-ui-react'


class Comments extends Component {

  renderComments(){
    return this.props.comments.map(comment =>{
      return(
        <Comment key={comment.id} style={{display:'inline-flex', padding:'10px'}}>
          <Comment.Avatar src={comment.user.avatar}/>
          <Comment.Content style={{paddingLeft: '10px'}}>
            <Comment.Author as='a'>{comment.user.firstName} {comment.user.lastName}</Comment.Author>
            <Comment.Text>
              {comment.content}
            </Comment.Text>
          </Comment.Content>
        </Comment>
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
