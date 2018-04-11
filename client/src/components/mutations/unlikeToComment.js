import gql from 'graphql-tag';

export default gql`
mutation unlikeToComment($commentId: ID!, $likeId: ID!,){
  unlikeToComment(commentId: $commentId, likeId: $likeId, ){
    id
  }
}
`
