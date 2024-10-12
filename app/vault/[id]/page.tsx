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
// import { handleTransactionResponse, versionedTransactionSenderAndConfirmationWaiter } from '@/components/lib/transaction-sender';

const TradingViewWidget = dynamic(() => import('@/components/ui/TradingViewWidget'), { ssr: false });

export default function VaultPage() {

  const { publicKey, signTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const supportedTransactionVersions = wallet?.adapter.supportedTransactionVersions;
  const drift_vault = 'DKocxJwJKebZoVDyisCiLwxrkthbnNVdrVnyoS6CG9xx';

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


      const response = await fetch('http://localhost:8000/deposit', {
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
              <p className="text-xl">SOL/USD, TIA/USD</p>
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
            <TabsList className="grid w-full grid-cols-2 text-xl">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
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
                    className="mb-4 bg-white"
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
        <MetricCard title="Sharpe Ratio" value="2.5" />
        <MetricCard title="Orders" value="1,234" />
        <MetricCard title="Balances" value="$500,000" />
        <MetricCard title="Max Drawdown" value="-15%" />
      </div>


        </div>
      </div>

     

      <Card className="bg-white-900 border-gray-800">
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add risk analysis content here */}
          <p>Detailed risk analysis and metrics will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}

