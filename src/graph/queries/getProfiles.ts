import { gql } from '@apollo/client';
import { USER_PROFILE } from '../fragments/profile';

export const GET_USER_PROFILES = gql`
  query profiles($userId: Int) {
    profiles(userId: $userId) {
      ...profile
    }
  }
  ${USER_PROFILE}
`;
