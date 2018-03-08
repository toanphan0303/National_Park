import gql from 'graphql-tag';
export default gql`
  mutation omitPointFromTrip($tripId: ID!, $pointId: ID!){
    omitPointFromTrip(tripId : $tripId, pointId: $pointId){
      id
    }
  }
`
