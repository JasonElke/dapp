import { STAKING_CONTRAC_ABI } from '@/abi/staking.contract.abi';
import {
  IStakingFarmingDetail,
  IUserInforInPool,
  POOL_STAKING_FARMING_DEPOSIT,
  STAKING_FARMING_DEPOSIT_TYPE,
} from '@/interface/staking.farming';
import { message } from 'antd';
import { BigNumber, ethers } from 'ethers';
import FactoryContract from './factory.contract';

export default class StakingContract {
  public contract;
  public provider;

  constructor(provider: any) {
    if (!provider) {
      message.error('Please install metamask');

      return;
    }

    this.provider = provider;
    this.contract = new ethers.Contract(`${import.meta.env.VITE_STAKING_CONTRACT}`, STAKING_CONTRAC_ABI, provider);
  }

  /**
   * @description Get total amount user staking to pool
   */
  async balanceOf(publicAddress: string): Promise<BigNumber> {
    try {
      return this.contract?.balanceOf(publicAddress);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Count number user staking to pool
   */
  async getDepositsLength(publicAddress: string): Promise<BigNumber> {
    try {
      return this.contract?.getDepositsLength(publicAddress);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get staking detail of user with staking index
   */
  async getDeposit(publicAddress: string, stakingIndex: number): Promise<IStakingFarmingDetail> {
    try {
      return this.contract?.getDeposit(publicAddress, stakingIndex);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get staking detail of user with staking index
   */
  async weightToReward(weightValue: string, rewardPerWeight = 200): Promise<BigNumber> {
    try {
      return this.contract?.weightToReward(weightValue, rewardPerWeight);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get list staking of user
   */
  async getDeposits(publicAddress: string): Promise<IStakingFarmingDetail[]> {
    try {
      let listData: IStakingFarmingDetail[] = await this.contract?.getDeposits(publicAddress);

      listData = listData.map((item, index) => {
        return {
          ...item,
          id: index,
          type: STAKING_FARMING_DEPOSIT_TYPE.DEPOSIT,
          pool: POOL_STAKING_FARMING_DEPOSIT.MLC_POOL,
        };
      });

      return listData.filter(item => !item.tokenAmount.isZero());
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 9. lastYieldDistribution
   */
  async lastYieldDistribution(): Promise<number> {
    try {
      return this.contract?.lastYieldDistribution();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 15. poolTokenReserve
   */
  async poolTokenReserve(): Promise<BigNumber> {
    try {
      return this.contract?.poolTokenReserve();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 18. Get user infor in the pool
   */
  async users(publicAddress: string): Promise<IUserInforInPool> {
    try {
      return this.contract?.users(publicAddress);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 19. usersLockingWeight
   */
  async usersLockingWeight(): Promise<BigNumber> {
    try {
      return this.contract?.usersLockingWeight();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get user infor in the pool
   */
  async getDeactiveStakes(publicAddress: string): Promise<IStakingFarmingDetail[]> {
    try {
      let listData: IStakingFarmingDetail[] = await this.contract?.getDeactiveStakes(publicAddress);

      listData = listData.map((item, index) => {
        return {
          ...item,
          id: index,
          type: STAKING_FARMING_DEPOSIT_TYPE.DEACTIVE,
          pool: POOL_STAKING_FARMING_DEPOSIT.MLC_POOL,
        };
      });

      return listData.filter(item => !item.tokenAmount.isZero());
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get total reward in pool of user address
   */
  async pendingYieldRewards(publicAddress: string): Promise<BigNumber> {
    try {
      return this.contract?.pendingYieldRewards(publicAddress);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 22. weight
   */
  async weight(): Promise<number> {
    try {
      return this.contract?.weight();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Calculate rewardPerBlock in the pool
   */
  async rewardPerBlock(): Promise<number> {
    try {
      const factoryContract = new FactoryContract(this.provider);
      const [mlcPerBlock, totalWeight, poolWeight] = await Promise.all([
        factoryContract.mlcPerBlock(),
        factoryContract.totalWeight(),
        this.weight(),
      ]);

      return ((+mlcPerBlock.toString() / 1e18) * poolWeight) / totalWeight;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 24. yieldRewardsPerWeight
   */
  async yieldRewardsPerWeight(): Promise<BigNumber> {
    try {
      return this.contract?.yieldRewardsPerWeight();
    } catch (error) {
      throw error;
    }
  }

  // -------------------------------- write contract - create transaction --------------------------

  /**
   * @description User create new staking deposit
   */
  async stake(amount: string, duration: number): Promise<any> {
    try {
      return this.contract?.stake(amount, duration);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description User unstaking of deposit
   */
  async unstake(stakeId: number, amount: string): Promise<any> {
    try {
      return this.contract?.unstake(stakeId, amount);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description User unstaking of deposit in the locktime
   */
  async force_unstake(stakeId: number, amount: string, immediate: boolean): Promise<any> {
    try {
      return this.contract?.force_unstake(stakeId, amount, immediate);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description User claim reward in the pool
   */
  async processRewards(): Promise<{ wait: () => void }> {
    try {
      return this.contract?.processRewards();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description User withdraw token after force_unstaking
   */
  async withDraw(deactiveStakeId: number): Promise<any> {
    try {
      return this.contract?.withDraw(deactiveStakeId);
    } catch (error) {
      throw error;
    }
  }
}
