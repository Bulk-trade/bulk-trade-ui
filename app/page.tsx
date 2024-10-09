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

      <Card className="mb-8 bg-white-900 text-black shadow-lg">
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            
            <div>
              <p className="text-sm text-gray-400">TVL</p>
              <p className="text-2xl font-bold">$5000</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">APY</p>
              <p className="text-2xl font-bold text-green-500">16%</p>
            </div>
        
          <div>
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