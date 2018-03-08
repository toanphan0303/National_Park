import gql from 'graphql-tag';

export default gql`
mutation addActivityLocationToTripPoint($tripPointId: ID!, $activitylocationId: ID!){
  addActivityLocationToTripPoint(tripPointId: $tripPointId, activitylocationId: $activitylocationId){
    id
    image
    video
    note
    activitylocation{
      id
      description
      title
      name
      url
    }
  }
}
`
