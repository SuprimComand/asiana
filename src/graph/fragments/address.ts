import { gql } from '@apollo/client';

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
