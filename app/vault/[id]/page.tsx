'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic';
import MetricCard from '@/components/ui/MetricCard';

const TradingViewWidget = dynamic(() => import('@/components/ui/TradingViewWidget'), { ssr: false });

export default function VaultPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-white-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Drift Vault Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-white-400">TVL</p>
              <p className="text-2xl font-bold">$5,000,000</p>
            </div>
            <div>
              <p className="text-sm text-white-400">APY</p>
              <p className="text-2xl font-bold text-green-500">16%</p>
            </div>
            <div>
              <p className="text-sm text-white-400">Pairs</p>
              <p className="text-xl">BTC/USD, ETH/USD</p>
            </div>
            <div>
              <p className="text-sm text-white-400">24h Volume</p>
              <p className="text-2xl font-bold">$10,000,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-white-900">
            <CardContent>
            <div className="h-[600px]">
              <TradingViewWidget />
            </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs defaultValue="deposit">
            <TabsList className="grid w-full grid-cols-2 bg-white-900">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <Card className="bg-white-900 border-gray-800">
                <CardContent className="pt-6">
                  <Input placeholder="Amount" className="mb-4 bg-white-800 border-gray-700" />
                  <Button className="w-full bg-white text-black hover:bg-white-200">Deposit</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="withdraw">
              <Card className="bg-white-900 border-gray-800">
                <CardContent className="pt-6">
                  <Input placeholder="Amount" className="mb-4 bg-white-800 border-gray-700" />
                  <Button className="w-full bg-white text-black hover:bg-white-200">Withdraw</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Sharpe Ratio" value="2.5" />
        <MetricCard title="Orders" value="1,234" />
        <MetricCard title="Balances" value="$500,000" />
        <MetricCard title="Max Drawdown" value="-15%" />
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
