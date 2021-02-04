import { gql } from '@apollo/client';
import { CAR } from '../fragments/car';
import { USER_PROFILE } from '../fragments/profile';

export const PROFILE_CAR: any = gql`
  fragment profileCar on ProfileCarType {
    id
    car {
      ...car
    }
    profile {
      ...profile
    }
    date
    source
    active
  }
  ${CAR}
  ${USER_PROFILE}
`;
