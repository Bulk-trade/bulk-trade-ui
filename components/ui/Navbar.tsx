// File: components/ui/Navbar.tsx

'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black">BULK</Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-lg text-black">Vaults</Link>
          <WalletMultiButton />
          {/* <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700">Select Wallet</Button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;