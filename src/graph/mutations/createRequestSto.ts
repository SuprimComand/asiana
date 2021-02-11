import { gql } from '@apollo/client';

export const CREATE_REQUEST_STO = gql`
  mutation createRequest($input: RequestStoInput!) {
    createRequest(input: $input) {
      ok
    }
  }
`;
