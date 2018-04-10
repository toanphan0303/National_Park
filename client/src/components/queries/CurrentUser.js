import gql from 'graphql-tag';

export default gql`
  {
    user {
      id
      email
      avatar
      firstName
      lastName
      follows{
        id
        title
        public
        tripImage
        user{
          id
          firstName
          lastName
        }
        rates{
          id
          rated
        }
      }
    }
  }
`
