// Re-export all types from the SDK
export type {
  CircleData,
  MemberRecordData,
  RoundStateData,
  PaymentRecordData,
  UserReputationData,
  GlobalStateData,
  SDKResult,
  CreateCircleParams,
} from './gameyafi';

export { CircleStatus } from './gameyafi';

// Legacy status types for UI components
export type CircleStatusString = 'Open' | 'Active' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Late' | 'Defaulted';