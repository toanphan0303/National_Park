import gql from 'graphql-tag';

export default gql`
  mutation togglePublicSetting($tripId: ID!, $value: Boolean!){
    togglePublicSetting(tripId: $tripId, value: $value){
      id
    }
  }
`
