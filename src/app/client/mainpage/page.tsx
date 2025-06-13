"use client";

import React from "react";
import SmallGrid from "../components/mainpage/Mainpage";

export default function MainPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Main Page View</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SmallGrid />
      </div>
    </div>
  );
}
