import { CONNECT_TYPES } from '@/constans';
import { swithNetwork } from '@/utils/switch-network';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useCallback, useContext, useMemo, useState, createContext, useEffect } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const Web3Context = createContext<any>(null);

interface IWeb3Context {
  address: string;
  connect: () => void;
  disconnect: () => void;
  provider: JsonRpcProvider;
  connected: boolean;
  chainID: number;
  web3Modal: Web3Modal;
  providerChainID: number;
  checkWrongNetwork: () => void;
  connectType: string;
  wrongNetwork: boolean;
}

export const useWeb3Context = (): IWeb3Context => {
  const web3Context = useContext(Web3Context);

  if (!web3Context) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3ContextProvider />, ' + 'please declare it at a higher level.',
    );
  }
  const { onChainProvider } = web3Context;

  return useMemo(() => {
    return onChainProvider;
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();

  return address;
};

export const Web3ContextProvider = ({ children }: { children: any }) => {
  const [connected, setConnected] = useState(false);
  const [chainID] = useState(import.meta.env.VITE_NETWORK_DECIMAL_CHAIN_ID);
  const [connectType, setConnectType] = useState('');
  const [providerChainID, setProviderChainID] = useState<number>(Number(import.meta.env.VITE_NETWORK_DECIMAL_CHAIN_ID));
  const [address, setAddress] = useState('');
  const [wrongNetwork, setWrongNetwork] = useState<boolean>();
  const [provider, setProvider] = useState(new StaticJsonRpcProvider(`${import.meta.env.VITE_NETWORK_RPC_URI}`));

  const [web3Modal] = useState(
    new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              [`${import.meta.env.VITE_NETWORK_DECIMAL_CHAIN_ID}`]: `${import.meta.env.VITE_NETWORK_RPC_URI}`,
            },
            qrcode: true,
            mobileLinks: ['metamask'],
            desktopLinks: ['metamask'],
          },
        },
      },
    }),
  );

  const initListeners = useCallback(
    rawProvider => {
      if (!rawProvider.on) {
        return;
      }

      rawProvider.on('accountsChanged', () => setTimeout(() => window.location.reload(), 1));

      rawProvider.on('chainChanged', async (newNetwork: any) => {
        if (newNetwork !== import.meta.env.VITE_NETWORK_HEX_CHAIN_ID) window.location.reload();
      });

      rawProvider.on('network', (newNetwork: any, oldNetwork: any) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  useEffect(() => {
    if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
      connect();
    }
  }, []);

  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();

    initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, 'any');

    const chainId = await connectedProvider.getNetwork().then(network => Number(network.chainId));
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    const isMetamask = connectedProvider.provider.isMetaMask;

    setProviderChainID(chainId);
    setConnectType(isMetamask ? CONNECT_TYPES.METAMASK : CONNECT_TYPES.WALLET_CONNECT);

    if (chainId !== Number(import.meta.env.VITE_NETWORK_DECIMAL_CHAIN_ID)) {
      await swithNetwork(connectedProvider);
    }

    setProvider(connectedProvider);
    setConnected(true);
    setWrongNetwork(false);
    setAddress(connectedAddress);

    await web3Modal.toggleModal();
  }, [provider, web3Modal, connected]);

  const checkWrongNetwork = async () => {
    if (providerChainID !== Number(import.meta.env.VITE_NETWORK_DECIMAL_CHAIN_ID)) {
      const shouldSwitch = window.confirm('Switch network');

      if (shouldSwitch) {
        await swithNetwork(provider);
        window.location.reload();
      }

      return true;
    }

    return false;
  };

  const disconnect = useCallback(async () => {
    localStorage.clear();
    web3Modal.clearCachedProvider();

    setConnected(false);
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      provider,
      connected,
      address,
      chainID,
      web3Modal,
      providerChainID,
      checkWrongNetwork,
      connectType,
      wrongNetwork,
    }),
    [connect, disconnect, provider, connected, address, chainID, web3Modal, providerChainID, connectType, wrongNetwork],
  );

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
