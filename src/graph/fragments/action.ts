import { gql } from '@apollo/client';

export const ACTION: any = gql`
  fragment action on ActionType {
    id
    date
    title
    image
    teaser
    body
    button
    sort
    status
  }
`;
