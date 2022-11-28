import { FACTORY_CONTRAC_ABI } from '@/abi/factory.contract.abi';
import { BigNumber, ethers } from 'ethers';
import FarmingContract from './farming.contract';
import StakingContract from './staking.contract';

export default class FactoryContract {
  public contract;
  static BLOCK_PER_YEAR = 28630 * 360;
  static INIT_BLOCK = 17413144;
  public provider;

  constructor(provider?: any) {
    if (!provider) {
      provider = new ethers.providers.JsonRpcProvider(`${import.meta.env.VITE_NETWORK_RPC_URI}`);
    }

    this.provider = provider;
    this.contract = new ethers.Contract(`${import.meta.env.VITE_FACTORY_CONTRACT}`, FACTORY_CONTRAC_ABI, provider);
  }

  /**
   * @description Get end block number
   */
  async endBlock(): Promise<number> {
    try {
      return this.contract?.endBlock();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get mlc per block
   */
  async mlcPerBlock(): Promise<BigNumber> {
    try {
      return this.contract?.mlcPerBlock();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get last ratio update
   */
  async lastRatioUpdate(): Promise<number> {
    try {
      return this.contract?.lastRatioUpdate();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get total distributed
   */
  async getTotalDistributed(): Promise<number> {
    try {
      const stakingContract = new StakingContract(this.provider);
      const farmingContract = new FarmingContract(this.provider);

      const [lastYieldDistributionMLCPool, lastYieldDistributionLPPool, mlcPerBlock] = await Promise.all([
        stakingContract.lastYieldDistribution(),
        farmingContract.lastYieldDistribution(),
        this.mlcPerBlock(),
      ]);

      const lastYieldDistribution = Math.max(lastYieldDistributionMLCPool, lastYieldDistributionLPPool);

      return (lastYieldDistribution - FactoryContract.INIT_BLOCK) * (+mlcPerBlock.toString() / 1e18);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description 12. totalWeight
   */
  async totalWeight(): Promise<number> {
    try {
      return this.contract?.totalWeight();
    } catch (error) {
      throw error;
    }
  }
}
