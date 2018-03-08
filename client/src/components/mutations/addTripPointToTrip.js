import gql from 'graphql-tag';

export default gql`
mutation addTripPointToTrip($tripId: ID!, $tripPointId: ID!){
  addTripPointToTrip(tripId: $tripId, tripPointId: $tripPointId){
    id
  }
}
`
