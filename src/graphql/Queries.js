import { gql } from '@apollo/client';

const FIND_USER_BY_PHONE = gql`
  query FindUserByPhone($phone: String!) {
    findUserByPhone(phone: $phone) {
      id
      fullname
      phone
      role
      uid
    }
  }
`;
const FIND_FARM_BY_USER_ID = gql`
  query FindFarmByUserId($userId: ID!) {
    findFarmByUserId(user_id: $userId) {
      id
      name
      address
      longitude
      latitude
    }
  }
`;

export { FIND_USER_BY_PHONE, FIND_FARM_BY_USER_ID };
