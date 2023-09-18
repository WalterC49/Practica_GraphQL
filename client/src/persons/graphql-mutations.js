import { gql } from "@apollo/client";
import { PERSON_DETAILS_FRAGMENT } from "./graphql-queries";

export const CREATE_PERSON = gql`
  #graphql
  mutation createPerson(
    $name: String!
    $phone: String
    $street: String!
    $city: String!
  ) {
    addPerson(name: $name, phone: $phone, street: $street, city: $city) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS_FRAGMENT}
`;

export const EDIT_NUMBER = gql`
  #graphql
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`;

export const LOGIN = gql`
  #graphql
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
