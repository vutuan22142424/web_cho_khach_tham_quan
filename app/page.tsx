"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import ExhibitionMapViewer from '@/components/ExhibitionMapViewer';
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { RobotCard } from "@/components/RobotCard";
import { EventCard } from "@/components/EventCard";
import { ContactSection } from "@/components/ContactSection";
import { useMQTTBrokerUrl } from "@/hooks/useMQTTBrokerUrl";

import exhibition from "@/public/data/exhibition.json";
import robot from "@/public/data/robot.json";

export default function Home() {
  const { brokerUrl, mqttUser, mqttPass } = useMQTTBrokerUrl();

  const [battery, setBattery]         = useState<number | null>(null);
  const [robotState, setRobotState]   = useState<string | null>(null);
  const [pose, setPose]               = useState<{ x: number; y: number; yaw: number } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Chờ brokerUrl load xong từ localStorage (tránh connect sai URL)
    if (!brokerUrl) return;

    const client = mqtt.connect(brokerUrl, {
      username: mqttUser,  // ← thêm
      password: mqttPass,  // ← thêm
      connectTimeout: 5000,
      reconnectPeriod: 3000,
    });

    client.on("connect", () => {
      setIsConnected(true);
      client.subscribe("robot/battery/soc");
      client.subscribe("robot/state/state");
      client.subscribe("robot/state/pose");
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();

      if (topic === "robot/battery/soc") {
        const value = Number(payload);
        if (!isNaN(value)) setBattery(value);

      } else if (topic === "robot/state/state") {
        try {
          const parsed = JSON.parse(payload);
          const state = parsed?.data?.state ?? parsed?.state ?? payload;
          if (state) setRobotState(state);
        } catch {
          setRobotState(payload);
        }

      } else if (topic === "robot/state/pose") {
        try {
          const parsed = JSON.parse(payload);
          const inner = parsed?.data ?? parsed;
          if (typeof inner.x === 'number') {
            setPose({ x: inner.x, y: inner.y, yaw: inner.yaw });
          }
        } catch {
          console.error("❌ Parse pose lỗi");
        }
      }
    });

    client.on("error",   (err) => console.error("❌ MQTT Error:", err.message));
    client.on("close",   () => { setIsConnected(false); });
    client.on("offline", () => { setIsConnected(false); });

    return () => {
      client.end(true);
      setIsConnected(false);
    };
  }, [brokerUrl]); // ← reconnect tự động khi đổi IP

  const stateLabel: Record<string, string> = {
    IDLE:      '😴 Chờ',
    EXECUTING: '🚀 Đang di chuyển',
    WAITING:   '⏳ Chờ tại điểm',
    PAUSED:    '⏸ Tạm dừng',
    DOCKING:   '🔌 Về dock',
    RESTING:   '💤 Nghỉ',
    CHARGING:  '🔋 Đang sạc',
  };

  const isActive     = robotState?.toUpperCase() === 'EXECUTING';
  const cardStatus   = isConnected ? 'active' : 'inactive';
  const stateDisplay = robotState
    ? (stateLabel[robotState.toUpperCase()] ?? robotState)
    : '—';
  const batteryDisplay = battery ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroSection
        title={exhibition.name}
        description={exhibition.fullDescription}
        location={exhibition.location}
        address={exhibition.address}
      />

      {/* ROBOT SECTION */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Gặp Gỡ TTH-T1
              </span>
            </h2>
            <p className="text-foreground/70 text-sm sm:text-lg">
              Robot đồ án phục vụ triển lãm của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-1">
              <RobotCard
                name={robot.name}
                model={robot.model}
                status={cardStatus}
                batteryLevel={batteryDisplay}
                specifications={{
                  height: robot.specifications.height,
                  weight: robot.specifications.weight,
                  processor: robot.specifications.processor,
                  cameras: robot.specifications.cameras,
                }}
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">
                  Các Tính Năng Tiên Tiến
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {robot.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="text-primary font-bold text-lg sm:text-xl mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-sm sm:text-base text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-border space-y-2 sm:space-y-3">
                {/* Vị trí hiện tại */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm sm:text-base text-foreground/70 font-medium">Vị Trí Hiện Tại:</span>
                  <span className="text-sm sm:text-base text-primary font-semibold text-right">
                    {pose
                      ? `(${pose.x.toFixed(2)}, ${pose.y.toFixed(2)})`
                      : robot.currentLocation}
                  </span>
                </div>

                {/* Trạng thái hệ thống */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm sm:text-base text-foreground/70 font-medium">Trạng Thái:</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                    {stateDisplay}
                  </span>
                </div>

                {/* Pin */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm sm:text-base text-foreground/70 font-medium">Pin Robot:</span>
                  {battery === null ? (
                    <span className="text-sm text-foreground/40">Đang kết nối...</span>
                  ) : (
                    <span className={`text-sm sm:text-base font-semibold ${
                      battery < 20 ? 'text-red-500' : battery < 50 ? 'text-yellow-500' : 'text-green-600'
                    }`}>
                      {battery}%
                    </span>
                  )}
                </div>

                {/* Yaw nếu có pose */}
                {pose && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm sm:text-base text-foreground/70 font-medium">Hướng (Yaw):</span>
                    <span className="text-sm sm:text-base text-primary font-semibold">
                      {(pose.yaw * 180 / Math.PI).toFixed(1)}°
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BẢN ĐỒ */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bản Đồ Triển Lãm
              </span>
            </h2>
            <p className="text-foreground/70 mt-2">
              Theo dõi vị trí robot theo thời gian thực
            </p>
          </div>
          <div className="h-[600px]">
            <ExhibitionMapViewer
              pose={pose}
              isMoving={robotState?.toUpperCase() === "EXECUTING"}
            />
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        className="py-8 sm:py-16 bg-gradient-to-br from-primary/5 to-accent/5 border-t border-border"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Sự Kiện Hàng Ngày
              </span>
            </h2>
            <p className="text-foreground/70 text-sm sm:text-lg">
              Trải nghiệm các hoạt động tương tác và trình diễn
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {exhibition.events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                time={event.time}
                description={event.description}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactSection
        location={exhibition.location}
        address={exhibition.address}
        phone={exhibition.phone}
        email={exhibition.email}
        website={exhibition.website}
        openingHours={exhibition.openingHours}
      />

      <footer className="py-6 sm:py-8 border-t border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center text-foreground/70 text-xs sm:text-sm">
          <p>&copy; 2026 Tech Summit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
