import { gql } from '@apollo/client';
import { ACTION } from '../fragments/action';

export const GET_ACTION = gql`
  query action($id: Int) {
    action(id: $id) {
      ...action
    }
  }
  ${ACTION}
`;
