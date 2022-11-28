import { BigNumber } from 'ethers';

export const STAKING_FARMING_DEPOSIT_TYPE = {
  DEPOSIT: 'DEPOSIT',
  DEACTIVE: 'DEACTIVE',
};

export const POOL_STAKING_FARMING_DEPOSIT = {
  MLC_POOL: 'ML POOL',
  LP_POOL: 'LP POOL',
};

export interface IStakingFarmingDetail {
  lockedFrom?: BigNumber;
  lockedUntil: BigNumber;
  tokenAmount: BigNumber;
  id: number;
  type: string;
  pool: string;
}

export interface IUserInforInPool {
  tokenAmount: BigNumber;
  totalWeight: BigNumber;
  subYieldRewards: BigNumber;
  subVaultRewards: BigNumber;
}
