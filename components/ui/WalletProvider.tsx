// File: components/WalletProvider.tsx

'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('@solana/wallet-adapter-react-ui/styles.css');

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={'https://bulk.rpcpool.com/1e245781-b06d-4601-b628-61babccfcfa2'}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        @typescript-eslint/no-unused-vars       
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}