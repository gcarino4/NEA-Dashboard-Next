"use client";

import Dropdown from "../src/app/client/components/UI/dropdown/Dropdown";
import React from "react";
import { useYear } from "../src/app/client/components/UI/dropdown/hooks/useYear";

const years = ["2014", "2015", "2016"];

export default function FilterPage() {
  const { selectedYear, setSelectedYear } = useYear();

  return (
    <div className="flex gap-4">
      <Dropdown
        options={years}
        value={selectedYear || years[0]}
        onChange={setSelectedYear}
      />
    </div>
  );
}
