import gql from 'graphql-tag';

export default gql`
mutation addCommentToTrip($tripId: ID!, $userId: ID!, $content: String!){
  addCommentToTrip(tripId: $tripId, userId: $userId,content: $content ){
    id
  }
}
`
