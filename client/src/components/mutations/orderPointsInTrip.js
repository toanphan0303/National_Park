import gql from 'graphql-tag';
export default gql`
  mutation orderPointsInTrip($tripId: ID!, $pointOrder: [String]){
    orderPointsInTrip(tripId : $tripId, pointOrder: $pointOrder){
      id
    }
  }
`
