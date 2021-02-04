import { gql } from '@apollo/client';
import { PROFILE_CAR } from '../fragments/profileCar';

export const GET_PROFILE_CAR = gql`
  query profileCars($profileId: Int) {
    profileCars(profileId: $profileId) {
      ...profileCar
    }
  }
  ${PROFILE_CAR}
`;
