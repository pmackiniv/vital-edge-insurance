"use client";

import { AIConcierge } from "@/components/AIConcierge";

type AIChatPanelProps = {
  compact?: boolean;
  onRequestAgent?: () => void;
};

export function AIChatPanel({ compact = false, onRequestAgent }: AIChatPanelProps) {
  return <AIConcierge compact={compact} onRequestAgent={onRequestAgent} />;
}
