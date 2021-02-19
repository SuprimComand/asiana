import { gql } from '@apollo/client';

export const CREATE_PUSH_TOKEN = gql`
  mutation createPushToken($input: PushTokenInput!) {
    createPushToken(input: $input) {
      ok
    }
  }
`;
