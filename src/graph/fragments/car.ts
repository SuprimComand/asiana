import { gql } from '@apollo/client';

export const CAR: any = gql`
  fragment car on CarType {
    id
    brand
    model
    complectation
  }
`;
