import gql from 'graphql-tag';

export default gql`
  query trips($id: ID!){
    trips(id: $id){
      id
      title
      tripImage
      park{
        id
      }
      tripPoints{
        id
        activitylocation{
          id
          loc
        }
      }
    }
  }
`
