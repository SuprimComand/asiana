import { gql } from '@apollo/client';
import { ADDRESS } from '../fragments/address';

export const GET_ADDRESSES = gql`
  query addresses($addressType: String, $city: String) {
    addresses(addressType: $addressType, city: $city) {
      ...address
    }
  }
  ${ADDRESS}
`;
