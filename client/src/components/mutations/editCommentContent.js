import gql from 'graphql-tag';

export default gql`
mutation editCommentContent($commentId: ID!, $content: String!){
  editCommentContent(commentId: $commentId,content: $content ){
    id
  }
}
`
