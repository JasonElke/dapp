import { getContract } from '@/utils/getContract';

// import { ethers } from 'ethers';

// import { governanceAddress } from './Addresses';
// import governanceABI from '../contracts/governance.sol/GovernorBravoDelegate.json';

// const Web3 = require('web3');

// const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

// function encodeParameters(types, values) {
//   const abi = new ethers.utils.AbiCoder();

//   return abi.encode(types, values);
// }

// export const submitProposal = async data => {
//   try {
//     const account = await getAccount();

//     if (!account.length) {
//       return 0;
//     }
//     const governanceContract = new web3.eth.Contract(governanceABI, governanceAddress);
//     const proposal = await governanceContract.methods
//       .propose(
//         [governanceAddress],
//         [0],
//         ['_setInvesteeDetails(address)'],
//         [encodeParameters(['address'], [data.wallet])],
//         JSON.stringify(data),
//       )
//       .send({ from: account[0] });

//     return proposal;
//   } catch (error) {
//     if (error?.code === 4001) {
//       return error;
//     } else return { code: 4002 };
//   }
// };

const desc = (v: any, i: any) => {
  try {
    console.log(v);

    return JSON.parse(v[i - 1].args[8]);
  } catch (e) {
    return '';
  }
};

export const proposalDetail = async (provider: any, address = '') => {
  try {
    // const governanceAddress = '0x9C45CcA5d6cDFB1a334Aee58de8Ba8c26f3833C4';
    const { governanceContract } = await getContract(provider);

    const data = [];
    let description;

    const stateOptions: any = {
      0: 'Pending',
      1: 'Active',
      2: 'Canceled',
      3: 'Defeated',
      4: 'Succeeded',
      5: 'Queued',
      6: 'Expired',
      7: 'Executed',
    };
    // const governanceContract = new web3.eth.Contract(governanceABI, governanceAddress);
    const proposalCount = await governanceContract.proposalCount();
    const event: any = governanceContract.filters.ProposalCreated();

    const v = await governanceContract.queryFilter(event, 0, 'latest');

    for (let i = 1; i <= proposalCount; i++) {
      const proposalDetail = await governanceContract.proposals(i);
      const voteCount = address ? await governanceContract.getReceipt(i, address) : 0;
      const state = await governanceContract.state(i);
      const stateName = stateOptions[state];
      
      description = desc(v, i);

      data.push({
        ...proposalDetail,
        voteCount,
        description,
        state,
        stateName,
      });
    }

    return data;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const approveOrRejectProposal = async (id: number, value: number, address: string, provider: any) => {
  try {
    if (!address) {
      return 0;
    }

    const { governanceContract } = await getContract(provider);
    const vote = await governanceContract.castVote(id, value);

    return vote;
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const Queue = async (id: any, provider: any) => {
  try {
    const { governanceContract } = await getContract(provider);

    const vote = await governanceContract.queue(id);

    return vote;
  } catch (error) {
    console.log(error);

    return '';
  }
};

export const Execute = async (id: any, provider: any) => {
  try {
    const { governanceContract } = await getContract(provider);

    const vote = await governanceContract.execute(id);

    return vote;
  } catch (error) {
    console.log(error);

    return '';
  }
};

// export const totalInvestment = async id => {
//   try {
//     const governanceContract = new web3.eth.Contract(governanceABI, governanceAddress);
//     const vote = await governanceContract.methods.nextInvesteeFund().call();

//     return vote * 13;
//   } catch (error) {
//     console.log(error);

//     return '';
//   }
// };
