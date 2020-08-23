import { gql } from '@apollo/client';

const FIND_USER_BY_PHONE = gql`
  query FindUserByPhone($phone: String!) {
    findUserByPhone(phone: $phone) {
      id
      fullname
      phone
      role
    }
  }
`;

export { FIND_USER_BY_PHONE };
