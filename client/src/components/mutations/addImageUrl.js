import gql from 'graphql-tag';

export default gql`
mutation addImageUrl($pointId: ID!, $imgUrl: [String]!){
  addImageUrl(pointId: $pointId, imgUrl: $imgUrl){
    id
  }
}
`
