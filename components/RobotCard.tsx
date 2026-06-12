'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RobotCardProps {
  name: string;
  model: string;
  status: string;
  batteryLevel: number;
  specifications: {
    height: string;
    weight: string;
    processor: string;
    cameras: number;
  };
}

export function RobotCard({ name, model, status, batteryLevel, specifications }: RobotCardProps) {
  const statusColor = status === 'active' ? 'text-green-600' : 'text-red-600';
  const statusBg = status === 'active' ? 'bg-green-100' : 'bg-red-100';

  return (
    <Card className="overflow-hidden border-border shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
        <Image
          src="/images/robot.jpg"
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader className="space-y-2 sm:space-y-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-2xl">{name}</CardTitle>
            <CardDescription className="text-xs sm:text-base">{model}</CardDescription>
          </div>
          

          
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap ${statusBg} ${statusColor}`}>
            {status === 'active' ? '● Hoạt Động' : '● Ngoại Tuyến'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
        {/* Battery */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-medium">Mức Pin</span>
            <span className="font-bold text-primary">{batteryLevel}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
  batteryLevel < 20
    ? "bg-red-500"
    : batteryLevel < 50
    ? "bg-yellow-500"
    : "bg-green-500"
}`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wide">Chiều Cao</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">{specifications.height}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wide">Cân Nặng</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">{specifications.weight}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-foreground/60 uppercase tracking-wide">Bộ Xử Lý</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">{specifications.processor}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-foreground/60 uppercase tracking-wide">Camera</p>
            <p className="text-sm sm:text-base font-semibold text-foreground">{specifications.cameras} Camera HD</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
