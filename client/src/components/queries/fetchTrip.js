import gql from 'graphql-tag';

export default gql`
  query trip($id: ID!){
    trip(id: $id){
      id
      title
      tripPoints{
        id
        image
        video
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
