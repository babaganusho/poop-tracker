"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";
import type { Entry } from "@/lib/types";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

export default function EntryChart({ entries }: { entries: Entry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: entries.map((e) => e.entry_date.slice(5)),
        datasets: [
          {
            label: "Weight (g)",
            data: entries.map((e) => e.weight_grams),
            borderColor: "#92400e",
            backgroundColor: "#92400e33",
            pointBackgroundColor: "#92400e",
            pointRadius: 3,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { maxTicksLimit: 6, color: "#78716c" }, grid: { display: false } },
          y: { beginAtZero: false, ticks: { color: "#78716c" } },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [entries]);

  return (
    <div className="h-40">
      <canvas ref={canvasRef} />
    </div>
  );
}
