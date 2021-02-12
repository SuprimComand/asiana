import { gql } from '@apollo/client';
import { REQUEST_STO } from '../fragments/requestSto';

export const GET_REQUEST_STO = gql`
  query requestSto {
    requestSto {
      ...requestSto
    }
  }
  ${REQUEST_STO}
`;
