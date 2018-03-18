import gql from 'graphql-tag';

export default gql`
query parkName($title: String!){
  parkName(title: $title){
    id
    title
  }
}
`
