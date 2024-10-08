import React from 'react';
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string;
  value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;