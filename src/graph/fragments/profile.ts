import { gql } from '@apollo/client';
import { ADDRESS } from './address';

export const USER_PROFILE = gql`
  fragment profile on ProfileType {
    id
    name
    email
    birthday
    gender
    percents
    bonus
    address {
      ...address
    }
  }
  ${ADDRESS}
`;
