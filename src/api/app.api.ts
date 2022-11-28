import { ERC20_CONTRAC_ABI } from '@/abi/erc20.contract.abi';
import FactoryContract from '@/blockchain/factory.contract';
import FarmingContract from '@/blockchain/farming.contract';
import MetalifeGameTokenContract from '@/blockchain/metalife.game.token.contract';
import MetalifeTokenContract from '@/blockchain/metalife.token.contract';
import StakingContract from '@/blockchain/staking.contract';
import store from '@/stores';
import { setPriceForToken } from '@/stores/app.store';
import { BigNumber, ethers } from 'ethers';
import { externalRequest } from './external.request';

interface ICalculateLpPriceParams {
  balanceMlcOfLpPool: BigNumber;
  balanceBnbOfLpToken: BigNumber;
  totalLpSupply: BigNumber;
  mlcTokenPrice: number;
  bnbTokenPrice: number;
}
const bignumberToNumber = (number: BigNumber) => {
  return +number.toString() / 1e18;
};

const calculateLpPrice = (params: ICalculateLpPriceParams) => {
  return (
    (bignumberToNumber(params.balanceMlcOfLpPool) * params.mlcTokenPrice +
      bignumberToNumber(params.balanceBnbOfLpToken) * params.bnbTokenPrice) /
    bignumberToNumber(params.totalLpSupply)
  );
};

export const fetchPriceOfToken = async (): Promise<{ mlcTokenPrice: number; lpTokenPrice: number }> => {
  try {
    const coingeckoApi =
      'https://api.coingecko.com/api/v3/simple/price?ids=dogeon,binancecoin&vs_currencies=usd&include_24hr_change=true';

    const binanceProvider = new ethers.providers.JsonRpcProvider(`${import.meta.env.VITE_NETWORK_RPC_URI}`);

    const mlcContract = new MetalifeTokenContract(binanceProvider);
    const lpContract = new MetalifeGameTokenContract(binanceProvider);
    const wbnbContract = new ethers.Contract(
      `${import.meta.env.VITE_WBNB_TOKEN_ADDRESS}`,
      ERC20_CONTRAC_ABI,
      binanceProvider,
    );

    const [resTokenPrice, balanceBnbOfLpToken, balanceMlcOfLpPool, totalLpSupply] = await Promise.all([
      externalRequest.get(coingeckoApi),
      wbnbContract.balanceOf(`${import.meta.env.VITE_MLG_TOKEN_ADDRESS}`),
      mlcContract.balanceOf(`${import.meta.env.VITE_MLG_TOKEN_ADDRESS}`),
      lpContract.totalSupply(),
    ]);

    const mlcTokenPrice = resTokenPrice.data?.dogeon?.usd;
    const mlcTokenUsdChange = resTokenPrice.data?.dogeon?.usd_24h_change;
    const bnbTokenPrice = resTokenPrice.data?.binancecoin?.usd;

    const lpTokenPrice = calculateLpPrice({
      mlcTokenPrice,
      bnbTokenPrice,
      totalLpSupply,
      balanceBnbOfLpToken,
      balanceMlcOfLpPool,
    });

    store.dispatch(
      setPriceForToken({
        mlcTokenPrice,
        mlcTokenUsdChange,
        bnbTokenPrice,
        lpTokenPrice,
      }),
    );

    return {
      mlcTokenPrice,
      lpTokenPrice,
    };
  } catch (error) {
    console.log('fetchPriceOfToken', error);

    throw error;
  }
};

export const calculateApyForPool = async (mlcTokenPrice: number, lpTokenPrice: number) => {
  try {
    if (!mlcTokenPrice || !lpTokenPrice) {
      throw new Error('mlcTokenPrice and lpTokenPrice must required');
    }

    const binanceProvider = new ethers.providers.JsonRpcProvider(`${import.meta.env.VITE_NETWORK_RPC_URI}`);

    const stakingContract = new StakingContract(binanceProvider);
    const farmingContract = new FarmingContract(binanceProvider);

    const [rewardPerBlockInMlcPool, rewardPerBlockInLpPool, poolTokenReserveMlc, poolTokenReserveLp] =
      await Promise.all([
        stakingContract.rewardPerBlock(),
        farmingContract.rewardPerBlock(),
        stakingContract.poolTokenReserve(),
        farmingContract.poolTokenReserve(),
      ]);

    stakingContract.rewardPerBlock();

    const mlcPoolApy = poolTokenReserveMlc.isZero()
      ? 0
      : (mlcTokenPrice * FactoryContract.BLOCK_PER_YEAR * rewardPerBlockInMlcPool * 100) /
        ((+poolTokenReserveMlc.toString() / 1e18) * mlcTokenPrice);

    const lpPoolApy = poolTokenReserveLp.isZero()
      ? 0
      : (mlcTokenPrice * FactoryContract.BLOCK_PER_YEAR * rewardPerBlockInLpPool * 100) /
        ((+poolTokenReserveLp.toString() / 1e18) * lpTokenPrice);

    store.dispatch(
      setPriceForToken({
        mlcPoolApy,
        lpPoolApy,
      }),
    );
  } catch (error) {
    console.log('calculateApyForPool', error);

    throw error;
  }
};
