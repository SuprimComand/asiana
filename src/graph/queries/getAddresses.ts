import { gql } from '@apollo/client';
import { ADDRESS } from '../fragments/address';

export const GET_ADDRESSES = gql`
  query addresses {
    addresses {
      ...address
    }
  }
  ${ADDRESS}
`;
