import gql from 'graphql-tag';

export default gql`
  query ratedYet($userId: ID!, $tripId: ID!){
    ratedYet(userId: $userId, tripId: $tripId){
      id
      rated
    }
  }
`
