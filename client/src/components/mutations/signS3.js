import gql from 'graphql-tag';

export default gql`
  mutation s3Sign($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`;
