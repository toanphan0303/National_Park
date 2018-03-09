import gql from 'graphql-tag';

export default gql`
  query trip($id: ID!){
    trip(id: $id){
      id
      title
      tripPoints{
        id
        images
        videos
        note
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
