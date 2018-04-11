import gql from 'graphql-tag';

export default gql`
mutation removeCommentFromTrip($tripId: ID!, $commentId: ID!){
  removeCommentFromTrip(tripId: $tripId, commentId: $commentId){
    id
  }
}
`
