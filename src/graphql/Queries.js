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

const FIND_FARM_LOCATION_WORKER = gql`
  query FindFarmLocationWorker(
    $longitude: Float!
    $latitude: Float!
    $radius: Float!
  ) {
    findFarmLocationWorker(
      longitude: $longitude
      latitude: $latitude
      radius: $radius
    ) {
      farm
      longitude
      latitude
      owner
      phone
      commodity
      vacancy
    }
  }
`;

const FIND_FARM_BY_WORKER_ID = gql`
  query FindFarmByWorkerId($userId: ID!) {
    findFarmByWorkerId(user_id: $userId) {
      id
      name
      user {
        id
        uid
        fullname
        phone
        role
      }
      address
      longitude
      latitude
    }
  }
`;

const FIND_FARM_WORKER_TASK_BY_FARM_ID = gql`
  query FindFarmWorkerTaskByFarmId($farmId: ID!) {
    findFarmWorkerTaskByFarmId(farm_id: $farmId) {
      id
      title
      description
      started_at
      ended_at
    }
  }
`;

const FIND_FARM_WORKER_TASK_BY_ID = gql`
  query FindFarmWorkerTaskById($taskId: ID!) {
    findFarmWorkerTaskById(task_id: $taskId) {
      id
      title
      description
      started_at
      ended_at
    }
  }
`;

const FIND_FARM_WORKER_TASK_PROGRESS = gql`
  query FindFarmWorkerTaskProgress($farmId: ID!, $userId: ID!) {
    findFarmWorkerTaskProgress(farm_id: $farmId, user_id: $userId) {
      id
      title
      description
      started_at
      ended_at
      is_done
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
  FIND_FARM_LOCATION_WORKER,
  FIND_FARM_BY_WORKER_ID,
  FIND_FARM_WORKER_TASK_BY_FARM_ID,
  FIND_FARM_WORKER_TASK_BY_ID,
  FIND_FARM_WORKER_TASK_PROGRESS,
};
