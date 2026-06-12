'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EventCardProps {
  title: string;
  time: string;
  description: string;
}

export function EventCard({ title, time, description }: EventCardProps) {
  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm sm:text-base mt-2">
          <span className="inline-block bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            🕐 {time}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        <p className="text-sm sm:text-base text-foreground/80">{description}</p>
      </CardContent>
    </Card>
  );
}
