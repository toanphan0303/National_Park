import gql from 'graphql-tag';

export default gql`
mutation addLikeToComment($userId: ID!, $commentId: ID!){
  addLikeToComment(userId: $userId, commentId: $commentId){
    id
  }
}
`
