import { gql } from "@apollo/client";

export const PERSON_DETAILS_FRAGMENT = gql`
  #graphql
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`;

export const ALL_PERSONS = gql`
  #graphql
  query {
    allPersons {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS_FRAGMENT}
`;

export const FIND_PERSON = gql`
  #graphql
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS_FRAGMENT}
`;
