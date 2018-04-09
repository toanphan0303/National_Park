import gql from 'graphql-tag';

export default gql`
  {
    popularTrips{
      id
      title
      public
      tripImage
      user{
        id
        firstName
        lastName
      }
    }
  }
`
