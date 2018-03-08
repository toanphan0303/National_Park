import gql from 'graphql-tag';

export default gql`
  query ParkQuery($id: ID!){
    park(id: $id){
      id
      title
      loc
      activitylocations {
        id
        title
        description
        name
        url
        loc
      }
    }
  }
`
