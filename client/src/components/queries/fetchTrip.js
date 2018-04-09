import gql from 'graphql-tag';

export default gql`
  query trip($id: ID!){
    trip(id: $id){
      id
      title
      public
      tripImage
      park{
        id
        title
        loc
      }
      comments{
        id
        content
        user {
          id
          avatar
          firstName
          lastName
        }
      }
      tripPoints{
        id
        images{
          id
          title
          url
        }
        videos{
          id
          title
          url
        }
        note{
          id
          title
          content
        }
        activitylocation{
          id
          title
          description
          name
          url
          loc
        }
      }
    }
  }
`
