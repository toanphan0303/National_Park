import gql from 'graphql-tag';
export default gql`
  mutation deleteTripPoint($id: ID!){
    deleteTripPoint(id : $id){
      id
    }
  }
`
