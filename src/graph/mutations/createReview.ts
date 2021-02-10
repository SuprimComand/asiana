import { gql } from '@apollo/client';

export const CREATE_REVIEW = gql`
  mutation review($input: ReviewInput!) {
    createReview(input: $input) {
      ok
    }
  }
`;
