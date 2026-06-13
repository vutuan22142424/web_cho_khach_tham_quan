'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import mqtt from 'mqtt';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/StatCard';
import { RobotStatusPanel } from '@/components/RobotStatusPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandHistoryTable } from '@/components/CommandHistoryTable';
import { MQTTBrokerSettings } from '@/components/MQTTBrokerSettings';
import { useMQTTBrokerUrl } from '@/hooks/useMQTTBrokerUrl';
import Link from 'next/link';

import analytics from '@/public/data/analytics.json';
import robot from '@/public/data/robot.json';

export default function AdminDashboard() {
  const router = useRouter();
  const { brokerUrl, mqttUser, mqttPass } = useMQTTBrokerUrl();

  const [editMode, setEditMode]       = useState(false);
  const [battery, setBattery]         = useState<number | null>(null);
  const [robotState, setRobotState]   = useState<string | null>(null);
  const [pose, setPose]               = useState<{ x: number; y: number; yaw: number } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const mqttClientRef                 = useRef<any>(null);
  
  useEffect(() => {
    if (!brokerUrl) return;

    const client = mqtt.connect(brokerUrl, {
      username: mqttUser,  // ← thêm
      password: mqttPass,  // ← thêm
      connectTimeout: 5000,
      reconnectPeriod: 3000,
    });
    mqttClientRef.current = client;

    client.on('connect', () => {
      setIsConnected(true);
      client.subscribe('robot/battery/soc');
      client.subscribe('robot/state/state');
      client.subscribe('robot/state/pose');
    });
    client.subscribe('robot/state/service_feedback');
    client.on('message', (topic, message) => {
      const payload = message.toString();
      if (topic === 'robot/state/service_feedback') { /////////////////////// cần note kĩ
          const parsed = JSON.parse(payload);
          const inner = parsed?.data ?? parsed;
          fetch('/api/commands/upsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              command_id: inner.command_id,
              status: inner.status,
              eventId: `${inner.command_id}_${inner.status}_${Date.now()}`,
            }),
          }).catch(err => console.error('❌ Lưu lỗi:', err));
        }
      else if (topic === 'robot/battery/soc') {
        const value = Number(payload);
        if (!isNaN(value)) setBattery(value);

      } else if (topic === 'robot/state/state') {
        try {
          const parsed = JSON.parse(payload);
          const state = parsed?.data?.state ?? parsed?.state ?? payload;
          if (state) setRobotState(state);
        } catch {
          setRobotState(payload);
        }

      } else if (topic === 'robot/state/pose') {
        try {
          const parsed = JSON.parse(payload);
          const inner = parsed?.data ?? parsed;
          if (typeof inner.x === 'number') {
            setPose({ x: inner.x, y: inner.y, yaw: inner.yaw });
          }
        } catch {}
      }
    });

    client.on('close',   () => { setIsConnected(false); });
    client.on('offline', () => { setIsConnected(false); });
    client.on('error',   (err) => console.error('❌ MQTT Error:', err.message));

    return () => {
      client.end(true);
      setIsConnected(false);
      mqttClientRef.current = null;
    };
  }, [brokerUrl]); // ← reconnect tự động khi admin đổi IP

  const handleEmergencyStop = () => {
    if (!mqttClientRef.current?.connected) {
      alert('⚠️ MQTT chưa kết nối!');
      return;
    }
    const ok = confirm('⚠️ Xác nhận DỪNG KHẨN CẤP robot?');
    if (!ok) return;
    mqttClientRef.current.publish('robot/powerswitch/cmd', '"force_off"');
    console.log('🛑 Đã gửi lệnh DỪNG KHẨN CẤP');
  };

  const handlestopmanual = () => {
    if (!mqttClientRef.current?.connected) {
      alert('⚠️ MQTT chưa kết nối!');
      return;
    }
    const ok = confirm('⏸️ Bạn muốn TẠM DỪNG robot?');
    if (!ok) return;
    mqttClientRef.current.publish('robot/powerswitch/cmd', '"off"');
    console.log('⏸️ Đã gửi lệnh TẠM DỪNG');
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; max-age=0';
    router.push('/login');
  };

  const stateLabel: Record<string, string> = {
    IDLE:      '😴 Chờ',
    EXECUTING: '🚀 Đang di chuyển',
    WAITING:   '⏳ Chờ tại điểm',
    PAUSED:    '⏸ Tạm dừng',
    DOCKING:   '🔌 Về dock',
    RESTING:   '💤 Nghỉ',
    CHARGING:  '🔋 Đang sạc',
  };

  const cardStatus   = isConnected ? 'active' : 'inactive';
  const stateDisplay = robotState
    ? (stateLabel[robotState.toUpperCase()] ?? robotState)
    : '—';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-auto min-h-16 items-center justify-between px-4 py-2 gap-4 flex-wrap">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary-foreground">⚙️</span>
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bảng Điều Khiển Quản Trị
              </h1>
              <p className="text-xs text-foreground/60">Quản Lý Triển Lãm</p>
            </div>
          </div>

          {/* MQTT Settings — admin có thể đổi IP ngay đây */}
          <MQTTBrokerSettings />

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1.5 text-xs text-foreground/60">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
              {isConnected ? 'MQTT Online' : 'MQTT Offline'}
            </div>
            <Link href="/" className="text-sm text-foreground/70 hover:text-foreground">
              Xem Trang Công Khai
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-border">
              Đăng Xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Chào mừng quay lại!</h2>
          <p className="text-foreground/70">Đây là những gì đang diễn ra với triển lãm của bạn hôm nay.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="👥" title="Tổng Lượt Truy Cập"
            value={analytics.totalVisits?.toLocaleString?.() || '0'}
            subtitle="Những khách tham quan duy nhất tuần này" trend={12} />
          <StatCard icon="📊" title="Lượt Xem Trang"
            value={analytics.pageViews?.home?.toLocaleString?.() || '0'}
            subtitle="Lượt xem trang chủ" trend={8} />
          <StatCard icon="🤖" title="Chuyến Tham Quan"
            value={analytics.robustStats?.guidedTours?.toLocaleString?.() || '0'}
            subtitle="Chuyến tham quan do robot dẫn" trend={15} />
          <StatCard icon="❓" title="Câu Hỏi Được Trả Lời"
            value={analytics.robustStats?.questionsAnswered?.toLocaleString?.() || '0'}
            subtitle="Do TTH-T1" trend={20} />
        </div>

        {/* Robot Status & Exhibition Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <RobotStatusPanel
              name={robot.name}
              model={robot.model}
              status={cardStatus}
              batteryLevel={battery ?? 0}
              temperature={0}
              uptime={robot.uptime}
              currentLocation={
                pose
                  ? `(${pose.x.toFixed(2)}, ${pose.y.toFixed(2)})`
                  : robot.currentLocation
              }
              onEmergencyStop={handleEmergencyStop}
              stopmanual={handlestopmanual}
            />
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Trạng Thái Triển Lãm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Trạng Thái</p>
                  <p className="text-lg font-bold text-green-600 mt-1">🟢 Đang Hoạt Động</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Trạng Thái Robot</p>
                  <p className="text-base font-bold text-primary mt-1">{stateDisplay}</p>
                </div>

                {pose && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Vị Trí (ROS)</p>
                    <p className="text-sm font-mono text-foreground mt-1">
                      x: {pose.x.toFixed(2)} · y: {pose.y.toFixed(2)} · yaw: {(pose.yaw * 180 / Math.PI).toFixed(1)}°
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Pin Robot</p>
                  {battery === null ? (
                    <p className="text-sm text-foreground/40 mt-1">Đang kết nối...</p>
                  ) : (
                    <p className={`text-2xl font-bold mt-1 ${
                      battery < 20 ? 'text-red-500' : battery < 50 ? 'text-yellow-500' : 'text-green-600'
                    }`}>{battery}%</p>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Khách Tham Quan Hôm Nay</p>
                  <p className="text-2xl font-bold text-foreground mt-1">342</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide font-semibold">Sức Khỏe Hệ Thống</p>
                  <p className="text-lg font-bold text-primary mt-1">99.8%</p>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:bg-secondary/90 transition-colors border-0"
              >
                {editMode ? 'Chế Độ Xem' : 'Chế Độ Chỉnh Sửa'}
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Command History */}
        <section className="py-8 border-t border-border mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📋</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Lịch Sử Lệnh Robot
            </span>
          </h2>
          <div className="border border-purple-200/60 rounded-2xl p-4 bg-purple-50/30">
            <CommandHistoryTable />
          </div>
        </section>

        {/* Recent Activity */}
        <Card className="border-border mb-8">
          <CardHeader><CardTitle>Nhật Ký Hoạt Động Robot</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {robot.logs.slice(0, 3).map((log, idx) => (
                <div key={idx} className="flex items-start space-x-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="text-2xl">🔔</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{log.event}</p>
                    <p className="text-sm text-foreground/60 mt-1">{log.location}</p>
                    <p className="text-xs text-foreground/50 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visitor Statistics */}
        <Card className="border-border">
          <CardHeader><CardTitle>Phân Tích Khách Tham Quan (7 Ngày Qua)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-semibold text-foreground/70">Ngày</th>
                    <th className="text-right py-3 px-3 font-semibold text-foreground/70">Khách Tham Quan</th>
                    <th className="text-center py-3 px-3 font-semibold text-foreground/70">Xu Hướng</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.dailyVisitors.map((day, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-3 text-foreground">{day.date}</td>
                      <td className="py-3 px-3 text-right font-semibold text-foreground">{day.count}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-green-600 font-semibold">↑</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border bg-gradient-to-r from-primary/5 to-accent/5 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-foreground/70 text-sm">
          <p>&copy; 2026 Future Tech Exhibition Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
