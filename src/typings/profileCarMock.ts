import { CarMock } from './car';
import { ProfileCarType } from './graphql';
import { UserMock } from './userProfile';

export const ProfileCarMock: ProfileCarType = {
  id: '',
  profile: UserMock,
  car: CarMock,
  date: '',
  source: '',
  active: 1,
};
