import gql from 'graphql-tag';

export default gql`
  query trips($id: ID!){
    trips(id: $id){
      id
      title
      park{
        id
      }
      tripPoints{
        activitylocation{
          id
          loc
        }
      }
    }
  }
`
