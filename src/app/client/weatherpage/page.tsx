"use client";

import React from "react";
import dynamic from "next/dynamic";

const WeatherPage = dynamic(
  () => import("../components/weatherpage/WeatherMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

export default function WeatherPageContainer() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Information</h1>
      <WeatherPage />
    </div>
  );
}
