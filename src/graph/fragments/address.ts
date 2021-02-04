import { gql } from '@apollo/client';
import { USER_PROFILE } from './profile';

export const ADDRESS: any = gql`
  fragment address on AddressType {
    id
    type
    address
    workTime
    phone
    coordinates
    profileSet {
      id
      name
      email
      birthday
      address {
        id
        type
        address
        workTime
        phone
        coordinates
        profileSet {
          id
          name
          email
          birthday
          address {
            id
            type
            address
            workTime
            phone
            coordinates
          }
        }
      }
    }
  }
`;
