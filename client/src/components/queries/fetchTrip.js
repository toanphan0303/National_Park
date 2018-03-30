import gql from 'graphql-tag';

export default gql`
  query trip($id: ID!){
    trip(id: $id){
      id
      title
      tripImage
      park{
        id
        title
        loc
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
