import { gql } from '@apollo/client';
import { ADDRESS } from './address';
import { CAR } from './car';
import { USER_PROFILE } from './profile';

export const REQUEST_STO: any = gql`
  fragment requestSto on RequestStoType {
    id
    profile {
      ...profile
    }
    car {
      ...car
    }
    date
    workKind
    address {
      ...address
    }
  }
  ${USER_PROFILE}
  ${CAR}
  ${ADDRESS}
`;
