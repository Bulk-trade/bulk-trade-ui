import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

interface VaultCardProps {
  name: string;
  pairs: string[];
  tvl: string;
  apy: string;
  isActive: boolean;
}

const VaultCard: React.FC<VaultCardProps> = ({ name, pairs, tvl, apy, isActive }) => {
  return (
    <Card className={`bg-gray-900 border-gray-800 ${!isActive && 'opacity-50'}`}>
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-400">Pairs</p>
          <div className="flex flex-wrap gap-2">
            {pairs.map((pair, index) => (
              <span key={index} className="bg-gray-800 px-2 py-1 rounded text-sm">{pair}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">TVL</p>
            <p className="text-xl font-bold">{tvl}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">APY</p>
            <p className="text-xl font-bold text-green-500">{apy}</p>
          </div>
        </div>
        <Link href={`/vault/${name.toLowerCase()}`} passHref>
          <Button className="w-full bg-white text-black hover:bg-gray-200" disabled={!isActive}>
            {isActive ? 'Provide Liquidity' : 'Coming Soon'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default VaultCard;