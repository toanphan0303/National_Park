import gql from 'graphql-tag';

export default gql`
  mutation addFollowTrip($id:ID!, $tripId: ID!){
    addFollowTrip(id: $id, tripId: $tripId){
      id
    }
  }
`
