import gql from 'graphql-tag';

export default gql`
  query tripPoint($id: ID!){
    tripPoint(id: $id){
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
    }
  }
`
