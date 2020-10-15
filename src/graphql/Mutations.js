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

const CREATE_NEW_MARKET = gql`
  mutation CreateNewMarket($price: Int!, $farmId: ID!, $commodityId: ID!) {
    createNewMarket(
      marketInput: {
        price: $price
        farm_id: $farmId
        commodity_id: $commodityId
      }
    ) {
      id
      submit_at
      price
      farm_id
      commodity_id
    }
  }
`;

const GENERATE_FARM_INVITATION_CODE = gql`
  mutation GenerateFarmInvitationCode($farmId: ID!) {
    generateFarmInvitationCode(farm_id: $farmId) {
      farm_id
      generated_token
      ended_at
    }
  }
`;

const REGISTER_NEW_WORKER = gql`
  mutation RegisterNewWorker($userId: ID!, $invitationCode: ID!) {
    registerNewWorker(user_id: $userId, invitation_code: $invitationCode) {
      farm_id
    }
  }
`;

const CREATE_FARM_WORKER_TASK = gql`
  mutation CreateFarmWorkerTask(
    $farmId: ID!
    $farmWorkerTaskInput: [FarmWorkerTaskInput!]!
  ) {
    createFarmWorkerTask(
      farm_id: $farmId
      farmWorkerTaskInput: $farmWorkerTaskInput
    ) {
      id
      title
      description
      started_at
      ended_at
    }
  }
`;

const UPDATE_FARM_WORKER_TASK = gql`
  mutation UpdateFarmWorkerTask(
    $workerTaskId: ID!
    $farmWorkerTaskInput: FarmWorkerTaskUpdate!
  ) {
    updateFarmWorkerTask(
      worker_task_id: $workerTaskId
      farmWorkerTaskInput: $farmWorkerTaskInput
    ) {
      id
      title
      description
      started_at
      ended_at
    }
  }
`;

const DELETE_FARM_WORKER_TASK_BY_ID = gql`
  mutation DeleteFarmWorkerTaskById($farmId: ID!, $taskId: ID!) {
    deleteFarmWorkerTaskById(farm_id: $farmId, task_id: $taskId) {
      id
    }
  }
`;

const CREATE_FARM_WORKER_TASK_ON_DONE = gql`
  mutation CreateFarmWorkerTaskOnDone($userId: ID!, $workerTaskId: ID!) {
    createFarmWorkerTaskOnDone(
      user_id: $userId
      worker_task_id: $workerTaskId
    ) {
      id
    }
  }
`;

const CREATE_FARM_WORKER_PERMIT = gql`
  mutation CreateFarmWorkerPermit($workerPermitInput: FarmWorkerPermitInput!) {
    createFarmWorkerPermit(workerPermitInput: $workerPermitInput) {
      id
    }
  }
`;

export {
  CREATE_NEW_USER,
  CREATE_NEW_FARM,
  CREATE_NEW_MARKET,
  GENERATE_FARM_INVITATION_CODE,
  REGISTER_NEW_WORKER,
  CREATE_FARM_WORKER_TASK,
  UPDATE_FARM_WORKER_TASK,
  DELETE_FARM_WORKER_TASK_BY_ID,
  CREATE_FARM_WORKER_TASK_ON_DONE,
  CREATE_FARM_WORKER_PERMIT,
};
