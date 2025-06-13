"use client";

import React from "react";
import ArcGIS from "../components/arcgis/ArcGIS";

export default function ArcGISPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ArcGIS Map</h1>
      <ArcGIS />
    </div>
  );
}
