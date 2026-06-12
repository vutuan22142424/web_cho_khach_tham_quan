'use client';

import { useState, useEffect } from 'react';
import { useMQTTBrokerUrl } from '@/hooks/useMQTTBrokerUrl';

interface MQTTBrokerSettingsProps {
  onChanged?: () => void;
}

export function MQTTBrokerSettings({ onChanged }: MQTTBrokerSettingsProps) {
  const { brokerUrl, setBrokerUrl, resetToDefault, defaultUrl } = useMQTTBrokerUrl();
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Sync input khi brokerUrl load xong từ localStorage
  useEffect(() => {
    setInput(brokerUrl);
  }, [brokerUrl]);

  const handleSave = () => {
    setError('');
    if (!input.startsWith('ws://') && !input.startsWith('wss://')) {
      setError('URL phải bắt đầu bằng ws:// hoặc wss://');
      return;
    }
    setBrokerUrl(input.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onChanged?.();
  };

  const handleReset = () => {
    resetToDefault();
    setInput(defaultUrl);
    setError('');
    onChanged?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-foreground/50 whitespace-nowrap">MQTT Broker:</span>
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setSaved(false); setError(''); }}
          onKeyDown={handleKeyDown}
          className="font-mono bg-muted border border-border rounded px-2 py-1 text-xs w-56 focus:outline-none focus:border-primary"
          placeholder="ws://192.168.x.x:9001"
          spellCheck={false}
        />
        <button
          onClick={handleSave}
          className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          {saved ? '✓ Đã lưu' : 'Lưu'}
        </button>
        {brokerUrl !== defaultUrl && (
          <button
            onClick={handleReset}
            className="px-2 py-1 bg-muted border border-border rounded text-xs hover:bg-muted/80 transition-colors text-foreground/60 whitespace-nowrap"
          >
            Reset
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 pl-[88px]">{error}</p>
      )}
    </div>
  );
}
