import gql from 'graphql-tag';

export default gql`
  mutation addTrip($user: ID!, $title: String!, $park: ID!){
    addTrip(user: $user, title: $title, park: $park){
      id
      title
      park {
        id
      }
    }
  }
`
