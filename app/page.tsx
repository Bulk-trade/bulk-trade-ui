// File: app/page.tsx

'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image';
// import VaultPage from './vault/[id]/page';
import Link from 'next/link';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-white text-black shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,2px,2fr,1fr] gap-4 items-center">
          {/* <div className="flex justify-between mb-4"> */}
            <div>
                 <Image
                 src="/Drift logo.svg"
                 alt="Drift"
                 width={158}
                 height={300}
                 priority
               />
            </div>
            <div className="hidden md:block w-px bg-gray-200 h-full"></div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">TVL</p>
              <p className="font-bold">$5,000,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">APY</p>
              <p className="font-bold text-green-500">16%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">24h Volume</p>
              <p className="font-bold">$10,000,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pairs</p>
              <p className="font-bold">BTC/USD, ETH/USD</p>
            </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Link href="/vault/1">
            <Button className="bg-black">Provide liquidity</Button>
          </Link>
          </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-white text-black shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,2px,2fr,1fr] gap-4 items-center">
          {/* <div className="flex justify-between mb-4"> */}
            <div>
                 <Image
                 src="/Drift logo.svg"
                 alt="Drift"
                 width={158}
                 height={300}
                 priority
               />
            </div>
            <div className="hidden md:block w-px bg-gray-200 h-full"></div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">TVL</p>
              <p className="font-bold">$5,000,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">APY</p>
              <p className="font-bold text-green-500">16%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">24h Volume</p>
              <p className="font-bold">$10,000,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pairs</p>
              <p className="font-bold">BTC/USD, ETH/USD</p>
            </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Link href="/vault/1">
            <Button className="bg-black">Provide liquidity</Button>
          </Link>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}