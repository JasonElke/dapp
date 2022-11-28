import { ERC20_CONTRAC_ABI } from '@/abi/erc20.contract.abi';
import { message } from 'antd';
import { BigNumber, ethers } from 'ethers';

export default class MetalifeGameTokenContract {
  public contract;

  constructor(provider: any) {
    if (!provider) {
      message.error('Please install metamask');

      return;
    }

    this.contract = new ethers.Contract(`${import.meta.env.VITE_MLG_TOKEN_ADDRESS}`, ERC20_CONTRAC_ABI, provider);
  }

  // Approve token to staking
  async totalSupply(): Promise<BigNumber> {
    try {
      return this.contract?.totalSupply();
    } catch (error) {
      throw error;
    }
  }

  // Approve token to staking
  async approve(toAddress: string, amount: string): Promise<any> {
    try {
      return this.contract?.approve(toAddress, amount);
    } catch (error) {
      throw error;
    }
  }

  // Get amount token approved to spenderAddress
  allowance(publicAddress: string, spenderAddress: string): Promise<BigNumber> {
    try {
      return this.contract?.allowance(publicAddress, spenderAddress);
    } catch (error) {
      throw error;
    }
  }

  // Get current balance of user
  balanceOf(publicAddress: string): Promise<BigNumber> {
    try {
      return this.contract?.balanceOf(publicAddress);
    } catch (error) {
      throw error;
    }
  }
}
