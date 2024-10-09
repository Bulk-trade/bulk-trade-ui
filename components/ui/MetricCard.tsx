import React from 'react';
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string;
  value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <Card className="bg-white shadow-lg rounded-2xl">
      <CardContent className="pt-6">
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;