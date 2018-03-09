import gql from 'graphql-tag';

export default gql`
mutation addTripPoint($images: String, $videos: String, $note: String){
  addTripPoint(images: $images, videos: $videos, note: $note){
    id
  }
}
`
