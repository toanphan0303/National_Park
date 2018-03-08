import gql from 'graphql-tag';

export default gql`
mutation addTripPoint($image: [String], $video: [String], $note: [String]){
  addTripPoint(image: $image, video: $video, note: $note){
    id
  }
}
`
