'use client';
import { PauseCircle } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RobotStatusPanelProps {
  name: string;
  model: string;
  status: string;
  batteryLevel: number;
  temperature: number;
  uptime: number;
  currentLocation: string;
   onEmergencyStop?: () => void; // ← thêm
   stopmanual?: () => void; // ← thêm
}

export function RobotStatusPanel({
  name,
  model,
  status,
  batteryLevel,
  temperature,
  uptime,
  currentLocation,
  onEmergencyStop, // ← thêm
  stopmanual, // ← thêm
}: RobotStatusPanelProps) {

  const statusColor = status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
                const battery = Number(batteryLevel);
  return (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>

            

            <p className="text-sm text-foreground/60 mt-1">{model}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
            {status === 'active' ? '● Trực Tuyến' : '● Ngoại Tuyến'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Robot Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden">
          <Image
            src="/images/robot.jpg"
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Battery */}
          
          <div className="col-span-2"></div>
          <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">
            Mức Pin: 
            <span className="text-primary font-bold ml-1">
              {battery}%
            </span>
          </p>

        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full ${
              battery < 20
                ? "bg-red-500"
                : battery < 50
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${battery}%` }}
          ></div>
        </div>
          {/* Temperature */}
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Nhiệt Độ</p>
            <p className="text-2xl font-bold text-primary mt-2">{temperature}°C</p>
            <p className="text-xs text-foreground/60 mt-1">Bình Thường</p>
          </div>

          {/* Uptime */}
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Thời Gian Hoạt Động</p>
            <p className="text-2xl font-bold text-primary mt-2">{uptime}h</p>
            <p className="text-xs text-foreground/60 mt-1">Phiên này</p>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Vị Trí</p>
            <p className="text-sm font-semibold text-foreground mt-2 line-clamp-2">{currentLocation}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Action Buttons */}
<div className="flex gap-2">
  <button
    onClick={onEmergencyStop}
    disabled={!onEmergencyStop}
    className="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 active:bg-red-800 transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
  >
    🛑 DỪNG KHẨN CẤP
  </button>
  <button
    onClick={stopmanual}
    disabled={!stopmanual}
    className="flex-1 px-6 py-4 bg-sky-600 text-white rounded-xl font-bold text-lg hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    <PauseCircle className="w-5 h-5" />
    TẠM DỪNG
  </button>
</div>
      </CardContent>
    </Card>
  );
}
