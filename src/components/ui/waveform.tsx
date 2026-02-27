"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveformVisualizerProps {
  isActive: boolean;
  color?: string;
  barCount?: number;
  className?: string;
}

export function WaveformVisualizer({
  isActive,
  color = "#8b5cf6",
  barCount = 24,
  className,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const barsRef = useRef<number[]>([]);
  const propsRef = useRef({ isActive, color, barCount });

  useEffect(() => {
    propsRef.current = { isActive, color, barCount };
  }, [isActive, color, barCount]);

  useEffect(() => {
    barsRef.current = Array.from({ length: barCount }, () => 0);

    function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      const { isActive: active, color: c, barCount: count } = propsRef.current;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / count - 2;

      for (let i = 0; i < count; i++) {
        if (active) {
          const target = Math.random() * 0.6 + 0.2;
          barsRef.current[i] =
            (barsRef.current[i] || 0) +
            (target - (barsRef.current[i] || 0)) * 0.15;
        } else {
          barsRef.current[i] = (barsRef.current[i] || 0) * 0.92;
        }

        const barHeight = Math.max(2, (barsRef.current[i] || 0) * height);
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, c + "cc");
        gradient.addColorStop(0.5, c);
        gradient.addColorStop(1, c + "cc");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={48}
      className={cn("w-full h-12", className)}
    />
  );
}
