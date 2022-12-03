const switchRequest = async (provider: any) => {
  await provider.send('wallet_switchEthereumChain', [{ chainId: import.meta.env.VITE_NETWORK_HEX_CHAIN_ID }]);

  return true;

  return window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: import.meta.env.VITE_NETWORK_HEX_CHAIN_ID }],
  });
};

const addChainRequest = async (provider: any) => {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: import.meta.env.VITE_NETWORK_HEX_CHAIN_ID,
      chainName: import.meta.env.VITE_NETWORK_CHAIN_NAME,
      rpcUrls: [import.meta.env.VITE_NETWORK_RPC_URI],
      blockExplorerUrls: [import.meta.env.VITE_NETWORK_BLOCK_EXPLORER],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  ]);

  return true;

  return window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: import.meta.env.VITE_NETWORK_HEX_CHAIN_ID,
        chainName: import.meta.env.VITE_NETWORK_CHAIN_NAME,
        rpcUrls: [import.meta.env.VITE_NETWORK_RPC_URI],
        blockExplorerUrls: [import.meta.env.VITE_NETWORK_BLOCK_EXPLORER],
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
      },
    ],
  });
};

export const swithNetwork = async (provider: any) => {
  if (provider) {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: import.meta.env.VITE_NETWORK_HEX_CHAIN_ID }]);
    } catch (error) {
      try {
        console.log(`1. Chain not available on user's wallet`, error);
        console.log(`2. Add new chain to user's wallet`);

        await addChainRequest(provider);
        await switchRequest(provider);
      } catch (addError) {
        console.log(`'Add new chain to user's wallet`, addError);

        throw addError;
      }
    }
  }
};
