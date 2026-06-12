import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mqtt_broker_url';
const DEFAULT_URL = process.env.NEXT_PUBLIC_MQTT_BROKER ?? 'ws://172.24.36.100:9001';

export function useMQTTBrokerUrl() {
  const [brokerUrl, setBrokerUrlState] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBrokerUrlState(saved);
  }, []);

  const setBrokerUrl = (url: string) => {
    localStorage.setItem(STORAGE_KEY, url);
    setBrokerUrlState(url);
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBrokerUrlState(DEFAULT_URL);
  };

  return { brokerUrl, setBrokerUrl, resetToDefault, defaultUrl: DEFAULT_URL };
}
