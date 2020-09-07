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

const FIND_COMMODITY_BY_FARM_ID = gql`
  query FindCommodityByFarmId($farmId: ID!) {
    findCommodityByFarmId(farm_id: $farmId) {
      id
      name
    }
  }
`;

const FIND_ALL_COMMODITY = gql`
  query FindAllCommodity($page: Int) {
    findAllCommodity(page: $page) {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

const FIND_FARM_MARKET_COMMODITY_NEARBY = gql`
  query FindFarmMarketCommodityNearby(
    $commodityId: ID!
    $userId: ID!
    $longitude: Float!
    $latitude: Float!
    $radius: Float!
  ) {
    findFarmMarketCommodityNearby(
      commodity_id: $commodityId
      user_id: $userId
      longitude: $longitude
      latitude: $latitude
      radius: $radius
    ) {
      currentPrice
      nearbyPrice
      percentage
      commodityName
    }
  }
`;

const FIND_FARM_MARKET_NEARBY = gql`
  query FindFarmMarketNearby(
    $commodityId: ID!
    $longitude: Float!
    $latitude: Float!
    $radius: Float!
  ) {
    findFarmMarketNearby(
      commodity_id: $commodityId
      longitude: $longitude
      latitude: $latitude
      radius: $radius
    ) {
      currentPrice
      currentPercentage
      previousPrice
      previousPercentage
      data {
        farm {
          id
          name
          longitude
          latitude
        }
        price
      }
    }
  }
`;

export {
  FIND_USER_BY_PHONE,
  FIND_FARM_BY_USER_ID,
  FIND_COMMODITY_BY_FARM_ID,
  FIND_ALL_COMMODITY,
  FIND_FARM_MARKET_COMMODITY_NEARBY,
  FIND_FARM_MARKET_NEARBY,
};
