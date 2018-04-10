import gql from 'graphql-tag';

export default gql`
  mutation deleteFollowTrip($id:ID!, $tripId: ID!){
    deleteFollowTrip(id: $id, tripId: $tripId){
      id
    }
  }
`
