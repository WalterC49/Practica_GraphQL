import { gql } from "@apollo/client";
import { PERSON_DETAILS_FRAGMENT } from "./graphql-queries";

export const PERSON_ADDED = gql`
  #graphql
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS_FRAGMENT}
`;
