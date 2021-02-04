import { gql } from '@apollo/client';
import { PROFILE_CAR } from '../fragments/profileCar';

export const UPDATE_PROFILE_CAR = gql`
  mutation updateProfileCar($id: String!, $input: ProfileCarActiveInput!) {
    updateProfileCar(id: $id, input: $input) {
      ok
      profileCar {
        ...profileCar
      }
    }
  }
  ${PROFILE_CAR}
`;
