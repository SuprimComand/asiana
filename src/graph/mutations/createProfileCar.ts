import { gql } from '@apollo/client';
import { PROFILE_CAR } from '../fragments/profileCar';

export const CREATE_PROFILE_CAR = gql`
  mutation createProfileCar($input: ProfileCarInput!) {
    createProfileCar(input: $input) {
      ok
      profileCar {
        ...profileCar
      }
    }
  }
  ${PROFILE_CAR}
`;
