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

export { CREATE_NEW_USER };
