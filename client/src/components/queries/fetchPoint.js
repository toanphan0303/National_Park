import gql from 'graphql-tag';

export default gql`
  query tripPoint($id: ID!){
    tripPoint(id: $id){
      images{
        id
        title
        url
      }
    }
  }
`
