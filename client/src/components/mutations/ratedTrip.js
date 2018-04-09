import gql from 'graphql-tag';

export default gql`
mutation ratedTrip($userId: ID!, $tripId: ID!, $value: Int!){
  ratedTrip(userId: $userId, tripId: $tripId, value: $value){
    id
  }
}
`
