import gql from 'graphql-tag';

export default gql`
  mutation deleteImage($pointId: ID!, $imgId: ID!){
    deleteImage(pointId: $pointId, imgId: $imgId){
      id
    }
  }
`
