import type { Circle, UserReputation } from './types';

const now = Date.now();
const hour = 3600 * 1000;

export const mockCircles: Circle[] = [
  {
    id: 'circle-001',
    creator: '7xKX...f3Qp',
    contributionAmount: 10,
    securityDeposit: 5,
    maxMembers: 5,
    currentMembers: 5,
    currentRound: 2,
    roundDuration: 300,
    roundStartedAt: now - 120 * 1000,
    status: 'Active',
    totalRounds: 5,
    createdAt: now - 24 * hour,
    members: [
      {
        address: '7xKX...f3Qp',
        displayName: 'Alice',
        depositLocked: 5,
        paidRounds: 2,
        receivedPayout: true,
        defaulted: false,
        joinedAt: now - 24 * hour,
        payoutOrder: 0,
        reputation: 117,
        currentRoundStatus: 'Paid',
      },
      {
        address: '9bMN...k2Wd',
        displayName: 'Bob',
        depositLocked: 5,
        paidRounds: 2,
        receivedPayout: true,
        defaulted: false,
        joinedAt: now - 23 * hour,
        payoutOrder: 1,
        reputation: 112,
        currentRoundStatus: 'Paid',
      },
      {
        address: '3pRt...v8Lm',
        displayName: 'Carol',
        depositLocked: 5,
        paidRounds: 2,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 22 * hour,
        payoutOrder: 2,
        reputation: 104,
        currentRoundStatus: 'Pending',
      },
      {
        address: '5hYz...n1Xe',
        displayName: 'Dave',
        depositLocked: 4,
        paidRounds: 1,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 21 * hour,
        payoutOrder: 3,
        reputation: 87,
        currentRoundStatus: 'Late',
      },
      {
        address: '8wFg...j4Ts',
        displayName: 'Eve',
        depositLocked: 3,
        paidRounds: 1,
        receivedPayout: false,
        defaulted: true,
        joinedAt: now - 20 * hour,
        payoutOrder: 4,
        reputation: 68,
        currentRoundStatus: 'Defaulted',
      },
    ],
  },
  {
    id: 'circle-002',
    creator: '4tLm...w9Bk',
    contributionAmount: 25,
    securityDeposit: 10,
    maxMembers: 3,
    currentMembers: 2,
    currentRound: 0,
    roundDuration: 600,
    roundStartedAt: 0,
    status: 'Open',
    totalRounds: 3,
    createdAt: now - 6 * hour,
    members: [
      {
        address: '4tLm...w9Bk',
        displayName: 'Frank',
        depositLocked: 10,
        paidRounds: 0,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 6 * hour,
        payoutOrder: 0,
        reputation: 100,
        currentRoundStatus: 'Pending',
      },
      {
        address: '6nHs...r5Qe',
        displayName: 'Grace',
        depositLocked: 10,
        paidRounds: 0,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 5 * hour,
        payoutOrder: 1,
        reputation: 105,
        currentRoundStatus: 'Pending',
      },
    ],
  },
  {
    id: 'circle-003',
    creator: '2mWp...x7Dg',
    contributionAmount: 50,
    securityDeposit: 20,
    maxMembers: 4,
    currentMembers: 1,
    currentRound: 0,
    roundDuration: 900,
    roundStartedAt: 0,
    status: 'Open',
    totalRounds: 4,
    createdAt: now - 2 * hour,
    members: [
      {
        address: '2mWp...x7Dg',
        displayName: 'Hassan',
        depositLocked: 20,
        paidRounds: 0,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 2 * hour,
        payoutOrder: 0,
        reputation: 130,
        currentRoundStatus: 'Pending',
      },
    ],
  },
  {
    id: 'circle-004',
    creator: '7xKX...f3Qp',
    contributionAmount: 5,
    securityDeposit: 2,
    maxMembers: 3,
    currentMembers: 3,
    currentRound: 3,
    roundDuration: 180,
    roundStartedAt: now - 5 * hour,
    status: 'Completed',
    totalRounds: 3,
    createdAt: now - 48 * hour,
    members: [
      {
        address: '7xKX...f3Qp',
        displayName: 'Alice',
        depositLocked: 2,
        paidRounds: 3,
        receivedPayout: true,
        defaulted: false,
        joinedAt: now - 48 * hour,
        payoutOrder: 0,
        reputation: 117,
        currentRoundStatus: 'Paid',
      },
      {
        address: '9bMN...k2Wd',
        displayName: 'Bob',
        depositLocked: 2,
        paidRounds: 3,
        receivedPayout: true,
        defaulted: false,
        joinedAt: now - 47 * hour,
        payoutOrder: 1,
        reputation: 112,
        currentRoundStatus: 'Paid',
      },
      {
        address: '3pRt...v8Lm',
        displayName: 'Carol',
        depositLocked: 2,
        paidRounds: 3,
        receivedPayout: true,
        defaulted: false,
        joinedAt: now - 46 * hour,
        payoutOrder: 2,
        reputation: 104,
        currentRoundStatus: 'Paid',
      },
    ],
  },
  {
    id: 'circle-005',
    creator: '1aZx...m3Nq',
    contributionAmount: 100,
    securityDeposit: 40,
    maxMembers: 6,
    currentMembers: 6,
    currentRound: 1,
    roundDuration: 1200,
    roundStartedAt: now - 600 * 1000,
    status: 'Active',
    totalRounds: 6,
    createdAt: now - 12 * hour,
    members: [
      {
        address: '1aZx...m3Nq',
        displayName: 'Khalid',
        depositLocked: 40,
        paidRounds: 1,
        receivedPayout: true,
        defaulted: false,
        joinedAt: now - 12 * hour,
        payoutOrder: 0,
        reputation: 145,
        currentRoundStatus: 'Paid',
      },
      {
        address: '6nHs...r5Qe',
        displayName: 'Leila',
        depositLocked: 40,
        paidRounds: 1,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 11 * hour,
        payoutOrder: 1,
        reputation: 120,
        currentRoundStatus: 'Paid',
      },
      {
        address: '4tLm...w9Bk',
        displayName: 'Mustafa',
        depositLocked: 40,
        paidRounds: 1,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 10.5 * hour,
        payoutOrder: 2,
        reputation: 108,
        currentRoundStatus: 'Pending',
      },
      {
        address: '8wFg...j4Ts',
        displayName: 'Nadia',
        depositLocked: 40,
        paidRounds: 1,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 10 * hour,
        payoutOrder: 3,
        reputation: 115,
        currentRoundStatus: 'Paid',
      },
      {
        address: '2mWp...x7Dg',
        displayName: 'Omar',
        depositLocked: 40,
        paidRounds: 1,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 9.5 * hour,
        payoutOrder: 4,
        reputation: 98,
        currentRoundStatus: 'Pending',
      },
      {
        address: '5hYz...n1Xe',
        displayName: 'Priya',
        depositLocked: 38,
        paidRounds: 0,
        receivedPayout: false,
        defaulted: false,
        joinedAt: now - 9 * hour,
        payoutOrder: 5,
        reputation: 82,
        currentRoundStatus: 'Late',
      },
    ],
  },
];

export const mockUserReputation: UserReputation = {
  walletAddress: '7xKX...f3Qp',
  totalReputation: 117,
  completedCircles: 1,
  defaultsCount: 0,
  circlesJoined: 2,
  joinedAt: Date.now() - 72 * 3600 * 1000,
};

export function getCircleById(id: string): Circle | undefined {
  return mockCircles.find((c) => c.id === id);
}

export function getOpenCircles(): Circle[] {
  return mockCircles.filter((c) => c.status === 'Open');
}

export function getActiveCircles(): Circle[] {
  return mockCircles.filter((c) => c.status === 'Active');
}

export function getRoundDeadline(circle: Circle): number {
  if (circle.status !== 'Active') return 0;
  return circle.roundStartedAt + circle.roundDuration * 1000;
}

export function getRecipient(circle: Circle): string {
  const member = circle.members.find(
    (m) => m.payoutOrder === circle.currentRound
  );
  return member?.address ?? 'Unknown';
}

export function getRecipientName(circle: Circle): string {
  const member = circle.members.find(
    (m) => m.payoutOrder === circle.currentRound
  );
  return member?.displayName ?? 'Unknown';
}