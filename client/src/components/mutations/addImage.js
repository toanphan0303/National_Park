import gql from 'graphql-tag';

export default gql`
mutation addImage($pointId: ID!, $title: String!, $url: String!){
  addImage(pointId: $pointId, title: $title, url: $url){
    id
  }
}
`
