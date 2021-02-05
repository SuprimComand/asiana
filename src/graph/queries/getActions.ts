import { gql } from '@apollo/client';
import { ACTION } from '../fragments/action';

export const GET_ACTIONS = gql`
  query actions {
    actions {
      ...action
    }
  }
  ${ACTION}
`;
