import { gql } from '@apollo/client';
import { USER_PROFILE } from '../fragments/profile';

export const CREATE_USER_PROFILE = gql`
  mutation createProfile($input: ProfileInput!) {
    createProfile(input: $input) {
      ok
      profile {
        ...profile
      }
    }
  }
  ${USER_PROFILE}
`;
