'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import dynamic from 'next/dynamic';
import MetricCard from '@/components/ui/MetricCard';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BlockhashWithExpiryBlockHeight, Connection,PublicKey,TransactionInstruction, TransactionMessage,VersionedTransaction } from '@solana/web3.js';
// import bs58 from 'bs58';
import { USDC_DECIMAL, USDC_MINT } from '@/components/lib/utils';
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddress, } from '@solana/spl-token';
import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base';
import Link from 'next/link';
// import { handleTransactionResponse, versionedTransactionSenderAndConfirmationWaiter } from '@/components/lib/transaction-sender';

const TradingViewWidget = dynamic(() => import('@/components/ui/TradingViewWidget'), { ssr: false });

export default function VaultPage() {

  const { publicKey, signTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const supportedTransactionVersions = wallet?.adapter.supportedTransactionVersions;
  const drift_vault = '5yptsfFoHCPaE9jwRkrYSNzQ8khwLWbuS2oMdnLq9NPt';

  const configureAndSendCurrentTransaction = async (
    transaction: VersionedTransaction,
    connection: Connection,
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight,
    signTransaction: SignerWalletAdapterProps['signTransaction']
  ) => {

    const signed = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction({
      blockhash: blockhashWithExpiryBlockHeight.blockhash,
      lastValidBlockHeight: blockhashWithExpiryBlockHeight.lastValidBlockHeight,
      signature
    });
    return signature;
  };

  const handleDeposit = async () => {
    setLoading(true);
    console.log('Deposit amount:', amount);
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    console.log("Wallet is connected", publicKey.toString());

    // let signature: TransactionSignature | undefined = undefined;
    try {
      if (!publicKey) throw new Error('Wallet not connected!');
      if (!supportedTransactionVersions) throw new Error("Wallet doesn't support versioned transactions!");
      if (!supportedTransactionVersions.has(0)) throw new Error("Wallet doesn't support v0 transactions!");
      if (!signTransaction) { throw new Error('signTransaction is undefined'); }


      console.log(`Sending ${amount} USDC from ${(publicKey.toString())} to ${(drift_vault)}.`)

      const transactionInstructions: TransactionInstruction[] = [];
      const associatedTokenFrom = await getAssociatedTokenAddress(
        new PublicKey(USDC_MINT),
        publicKey
      );
      const fromAccount = await getAccount(connection, associatedTokenFrom);
      const associatedTokenTo = await getAssociatedTokenAddress(
        new PublicKey(USDC_MINT),
        new PublicKey(drift_vault)
      );

      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenTo,
            new PublicKey(drift_vault),
            new PublicKey(USDC_MINT)
          )
        );
      }
      transactionInstructions.push(
        createTransferInstruction(
          fromAccount.address, // source
          associatedTokenTo, // dest
          publicKey,
          Number(amount) * Math.pow(10, USDC_DECIMAL)
        )
      );

      const blockhashResult = await connection.getLatestBlockhash();

      const messagev0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhashResult.blockhash,
        instructions: [
          ...transactionInstructions
        ],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messagev0);

      const signature = await configureAndSendCurrentTransaction(
        transaction,
        connection,
        blockhashResult,
        signTransaction!
      );

      console.log('Transaction sent:', signature);


      const response = await fetch('http://72.46.84.23:4001/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_pubkey: publicKey.toString(),
          amount: amount,
          signature: signature
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Deposit successful:', data);

    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    setLoading(true);
    console.log('Withdraw amount:', amount);
    // Add your withdraw logic here
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-white shadow-lg rounded-2xl py-4">
        <CardHeader>
          <CardTitle className="text-2xl">Vault Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <div>
              <Image
                src="/Drift logo.svg"
                alt="Drift"
                width={158}
                height={300}
                priority
              />
            </div>
            <div>
              <p className="text-sm text-white-400">TVL</p>
              <p className="text-2xl font-bold">$5000</p>
            </div>
            <div>
              <p className="text-sm text-white-400">APY</p>
              <p className="text-2xl font-bold text-green-500">16.6%</p>
            </div>
            <div>
              <p className="text-sm text-white-400">Pairs</p>
              <p className="text-xl">SOL/USD, BONK/USD APT/USD</p>
            </div>
            <div>
              <p className="text-sm text-white-400">30day Volume</p>
              <p className="text-2xl font-bold">$132,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <Card className="bg-white shadow-lg rounded-2xl">
            <CardContent>
              <div className="h-[500px]">
                <TradingViewWidget />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs defaultValue="deposit">
            <TabsList className="grid w-full grid-cols-2 text-xl bg-transparent">
              <TabsTrigger value="deposit" className="flex items-center justify-center space-x-2 bg-transparent">
                <span>Deposit</span>
                <Image src="/deposit.svg" alt="Deposit" width={20} height={20} />
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="flex items-center justify-center space-x-2 bg-transparent">
                <span>Withdraw</span>
                <Image src="/withdraw.svg" alt="Withdraw" width={20} height={20} />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              {/* <Card className="bg-inherit">
                <CardContent className="pt-6"> */}
                <div className="pt-4">
                  <Input
                    placeholder="Amount in usdc"
                    type="number"
                    className="mb-4 bg-white shadow-lg rounded-2xl border-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                   <div className="flex w-full items-center space-x-2">
                   <Input type="" placeholder="vault address"
                   value={drift_vault}
                   className="w-full"
                   />
                  <Button
                    className="bg-black text-white"
                    onClick={handleDeposit}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Deposit'}
                  </Button>
                  </div>
                  </div>
                {/* </CardContent>
              </Card> */}
            </TabsContent>

            <TabsContent value="withdraw">
           <div>
                  <Input
                    placeholder="Amount in usdc"
                    className="mb-4 bg-white shadow-lg rounded-2xl border-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button
                    className="w-full bg-black text-white hover:bg-white-200"
                    onClick={handleWithdraw}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </Button>
               </div>
            </TabsContent>

          </Tabs>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 pt-8 mt-6">
        <MetricCard title="Sharpe Ratio" value="1.5" />
        <MetricCard title="Orders" value="153" />
        <MetricCard title="Balances" value="$4,940" />
        <MetricCard title="Max Drawdown" value="13.55%" />
      </div>
<div>
  <Link href="https://app.drift.trade/?authority=5yptsfFoHCPaE9jwRkrYSNzQ8khwLWbuS2oMdnLq9NPt">
  <p> View vault on Drift</p>
  </Link>
</div>

        </div>
      </div>

     

      <Card className="bg-white-900 border-gray-800">
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add risk analysis content here */}
          <p>Volatility Risk
Vault is exposed to volatility risk because rapid and large price movements can impact its ability to buy or sell instrument at desired prices. High volatility can widen bid-ask spreads, reducing profitability for the vault.
</p>
        </CardContent>
      </Card>
    </main>
  );
}
