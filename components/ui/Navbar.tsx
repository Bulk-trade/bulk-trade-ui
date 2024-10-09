// File: components/ui/Navbar.tsx

'use client'

import React from 'react';
import Link from 'next/link';
// import { Button } from "@/components/ui/button"
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  return (
    <nav className="bg-custom-bg p-4">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image
          src="/Logo.svg"
          alt="BULK Logo"
          width={143}  
          height={60}
          priority
        />
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl text-black">Vaults</Link>
          <WalletMultiButton />
          {/* <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700">Select Wallet</Button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;