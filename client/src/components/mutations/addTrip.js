import gql from 'graphql-tag';

export default gql`
  mutation addTrip($user: ID!, $title: String!,$tripImage: String!, $park: ID!){
    addTrip(user: $user, title: $title,tripImage:$tripImage, park: $park){
      id
      title
      park {
        id
      }
    }
  }
`
