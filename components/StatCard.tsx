'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
}

export function StatCard({ icon, title, value, subtitle, trend }: StatCardProps) {
  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl sm:text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-foreground/60">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className={`text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}
