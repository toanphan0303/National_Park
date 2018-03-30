import gql from 'graphql-tag';

export default gql`
  mutation deleteTrip($id:ID!, $tripId: ID!){
    deleteTrip(id: $id, tripId: $tripId){
      id
    }
  }
`
