import { ethers } from 'ethers';
import RealmTokenContract from '../contracts/realm.sol/realm.json';
import dRealmTokenContract from '../contracts/drealm.sol/Drealm.json';
import governanceContract from '../contracts/governance.sol/GovernorBravoDelegate.json';

const CONFIG = import.meta.env;

export const getContract = async (provider: any) => {
  if (!provider) throw Error('No connector found');

  try {
    const signer = await provider.getSigner();

    const realmContractAbi: any = RealmTokenContract.abi;
    const dRealmContractAbi: any = dRealmTokenContract.abi;
    const governanceContractAbi: any = governanceContract.abi;
    // TODO: Get network address whenever JSON file change
    const realmContractAddress: any = CONFIG.VITE_REALM_TOKEN;
    const dRealmContractAddress: any = CONFIG.VITE_dREALM_TOKEN;
    const governanceContractAddress: any = CONFIG.VITE_GOVERNANCE;

    return {
      realmContract: new ethers.Contract(realmContractAddress, realmContractAbi, signer),
      dRealmContract: new ethers.Contract(dRealmContractAddress, dRealmContractAbi, signer),
      governanceContract: new ethers.Contract(governanceContractAddress, governanceContractAbi, signer),
    };
  } catch (e) {
    console.log(e);

    throw e;
  }
};
