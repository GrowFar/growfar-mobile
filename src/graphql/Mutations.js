import { gql } from '@apollo/client';

const CREATE_NEW_USER = gql`
  mutation CreateNewUser(
    $uid: String!
    $fullname: String!
    $phone: String!
    $role: role!
  ) {
    createNewUser(
      userInput: { uid: $uid, fullname: $fullname, phone: $phone, role: $role }
    ) {
      id
      uid
      fullname
      phone
      role
    }
  }
`;

const CREATE_NEW_FARM = gql`
  mutation CreateNewFarm(
    $name: String!
    $user_id: ID!
    $address: String!
    $longitude: Float!
    $latitude: Float!
  ) {
    createNewFarm(
      farmInput: {
        name: $name
        user_id: $user_id
        address: $address
        longitude: $longitude
        latitude: $latitude
      }
    ) {
      id
      name
      address
      longitude
      latitude
    }
  }
`;

export { CREATE_NEW_USER, CREATE_NEW_FARM };
