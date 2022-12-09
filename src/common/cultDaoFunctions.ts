import dRealmTokenContract from '../contracts/drealm.sol/Drealm.json';
import { ethers } from 'ethers';
import { getContract } from '@/utils/getContract';

// export const getAccount = async () => {
//   try {
//     const account = await web3.eth.getAccounts();

//     return account;
//   } catch (error) {
//     return '';
//   }
// };

// export const hexToNumber = hex => web3.utils.hexToNumber(hex);
// export const getChainId = async () => {
//   try {
//     const chainId = await web3?.eth?.getChainId();

//     localStorage.setItem('chainId', hexToNumber(chainId));
//     const checkNetwork = hexToNumber(chainId) === 1 || hexToNumber(chainId) === 56;

//     localStorage.setItem('correctNetwork', `${checkNetwork}`);

//     return hexToNumber(chainId);
//   } catch (e) {
//     return '';
//   }
// };

// export const chainChanged = async () => {
//   window.ethereum.on('chainChanged', chainId => {
//     localStorage.setItem('chainId', hexToNumber(chainId));
//     window.location.reload();
//   });
// };

// export const getBalance = async account => {
//   const balance = await web3.eth.getBalance(account);

//   return (balance / Math.pow(10, 18)).toFixed(4);
// };

// //////// dCult --------------------------------------------

// // Function to stake cultToken to cultDAO.

export const stake = async (amount: any, provider: any) => {
  try {
    if (!amount) {
      return 0;
    }

    const { dRealmContract } = await getContract(provider);

    const cultStaked = await dRealmContract.deposit(0, amount);
    
    return cultStaked;
  } catch (error) {
    console.log(error);

    return error;
  }
};

// // Function to call withdraw amount function of cultDAO

// export const withdraw = async amount => {
//   try {
//     const account = await getAccount();

//     if (!account.length) {
//       return 0;
//     }
//     const reqAmount = web3.utils.toWei(amount, 'ether');

//     const cultDaoContract = new web3.eth.Contract(dCultABI, dCultAddress);
//     const cultWithdraw = await cultDaoContract.methods.withdraw(0, reqAmount).send({ from: account[0] });

//     return cultWithdraw;
//   } catch (error) {
//     console.log(error);

//     return error;
//   }
// };

// // Function to call claim function of cultDAO

// export const claimDcult = async () => {
//   try {
//     const account = await getAccount();

//     if (!account.length) {
//       return 0;
//     }
//     const cultDaoContract = new web3.eth.Contract(dCultABI, dCultAddress);
//     const cultClaim = await cultDaoContract.methods.claimCULT(0).send({ from: account[0] });

//     return cultClaim;
//   } catch (error) {
//     console.log(error);

//     return '';
//   }
// };

// // Function to see cultDAO balance

export const dCultBalance = async (address: string, provider: any) => {
  try {
    if (!address) {
      return 0;
    }

    const cultDaoContract = new ethers.Contract(
      `${import.meta.env.VITE_dREALM_TOKEN}`,
      dRealmTokenContract.abi,
      provider,
    );

    const cultBalance = await cultDaoContract.balanceOf(address);

    return ethers.utils.formatEther(cultBalance);
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const pendingCult = async (address: string, provider: any) => {
  try {
    if (!address) {
      return 0;
    }

    const { dRealmContract } = await getContract(provider);

    const cultStaked = await dRealmContract.pendingREALM(0, address);

    return Number(cultStaked?.toString() / 1e18).toFixed(3);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const claimCult = async (adddress: string, provider: any) => {
  try {
    if (!adddress) {
      return 0;
    }

    const { dRealmContract } = await getContract(provider);

    const cultStaked = await dRealmContract.claimCULT(0);

    return cultStaked;
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const highestStaker = async (address: string, provider: any) => {
  try {
    if (!address) {
      return 0;
    }
    const cultDaoContract = new ethers.Contract(
      `${import.meta.env.VITE_dREALM_TOKEN}`,
      dRealmTokenContract.abi,
      provider,
    );
    const checkHS = await cultDaoContract.checkHighestStaker(0, address);

    return checkHS;
  } catch (error) {
    console.log(error);

    return '';
  }
};

export const totalVotes = async (address: string, provider: any) => {
  if (!address) {
    return 0;
  }
  const cultDaoContract = new ethers.Contract(
    `${import.meta.env.VITE_dREALM_TOKEN}`,
    dRealmTokenContract.abi,
    provider,
  );

  try {
    const votes = await cultDaoContract.getVotes(address);

    console.log(votes);
    return votes / Math.pow(10, 18);
  } catch (error) {
    return 0.0;
  }
};

export const delegate = async (toAddress: string, provider: any) => {
  if (!toAddress) {
    return 0;
  }

  const { dRealmContract } = await getContract(provider);

  console.log(dRealmContract);

  try {
    const delegated = await dRealmContract.delegate(toAddress);

    return delegated;
  } catch (error) {
    if (error?.code === 4001) {
      return error;
    } else return { code: 4002 };
  }
};

// export const totalStaked = async () => {
//   const cultDaoContract = new web3.eth.Contract(dCultABI, dCultAddress);

//   try {
//     const staked = await cultDaoContract.methods.totalSupply().call();

//     return staked / Math.pow(10, 18);
//   } catch (error) {
//     console.log(error);

//     return 0.0;
//   }
// };

// export const totalCultStaked = async () => {
//   const cultDaoContract = new web3.eth.Contract(dCultABI, dCultAddress);

//   try {
//     const staked = await cultDaoContract.methods.totalCULTStaked().call();

//     return staked / Math.pow(10, 18);
//   } catch (error) {
//     console.log(error);

//     return 0.0;
//   }
// };

// export const Guardianship = async () => {
//   const cultDaoContract = new web3.eth.Contract(dCultABI, dCultAddress);

//   try {
//     let highestStaker = 0;

//     for (let i = 0; i < 50; i++) {
//       highestStaker = await cultDaoContract.methods.highestStakerInPool(0, i).call();

//       if (parseInt(highestStaker?.deposited)) {
//         return (highestStaker?.deposited / Math.pow(10, 18)).toFixed(1);
//       }
//     }

//     return 0;
//   } catch (error) {
//     console.log(error);

//     return 0.0;
//   }
// };

// ///////////// cult--------------------------------

// // Function to send approved amount of cultToken to cultDAO

// export const approve = async () => {
//   try {
//     const account = await getAccount();

//     console.log('account', account[0]);
//     if (!account.length) {
//       return 0;
//     }
//     const cultDaoTokenContract = new web3.eth.Contract(cultABI, cultAddress);
//     const UINT256_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
//     const cultApprove = await cultDaoTokenContract.methods
//       .approve(dCultAddress, UINT256_MAX)
//       .send({ from: account[0] });

//     return cultApprove;
//   } catch (error) {
//     console.log('error', error);

//     return error;
//   }
// };

// // Function to call allowance function of cultToken

export const realmAllowance = async (address: string, provider: any) => {
  if (!address) {
    return 0;
  }
  const { realmContract } = await getContract(provider);

  try {
    const allowanceResponse = await realmContract.allowance(address, import.meta.env.VITE_dREALM_TOKEN);

    return Number(allowanceResponse?.toString() / 1e18);
  } catch (error) {
    return 0.0;
  }
};

// export const cutlDaoBalance = async () => {
//   try {
//     const account = await getAccount();

//     if (!account.length) {
//       return 0;
//     }
//     const cultDaoTokenContract = new web3.eth.Contract(cultABI, cultAddress);
//     const cultBalance = await cultDaoTokenContract.methods.balanceOf(account[0]).call();

//     return web3.utils.fromWei(cultBalance, 'ether');
//   } catch (error) {
//     console.log(error);

//     return '';
//   }
// };

// export const totalBurned = async () => {
//   try {
//     const cultDaoTokenContract = new web3.eth.Contract(cultABI, cultAddress);
//     const balance1 = await cultDaoTokenContract.methods.balanceOf(deadAddress1).call();

//     const balance2 = await cultDaoTokenContract.methods.balanceOf(deadAddress2).call();

//     const balance = (parseInt(balance1) + parseInt(balance2)) / Math.pow(10, 18);

//     return balance.toFixed(0);
//   } catch (error) {
//     console.log(error);

//     return '';
//   }
// };

// export const treasuryBalance = async () => {
//   try {
//     const cultDaoTokenContract = new web3.eth.Contract(cultABI, cultAddress);
//     const balance1 = await cultDaoTokenContract.methods.balanceOf(deadAddress3).call();

//     const balance = parseInt(balance1) / Math.pow(10, 18);

//     console.log('tres', balance1);

//     return balance.toFixed(2);
//   } catch (error) {
//     console.log(error);

//     return '';
//   }
// };
