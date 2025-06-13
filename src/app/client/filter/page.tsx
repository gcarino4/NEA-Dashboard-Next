"use client";

import Dropdown from "../components/UI/dropdown/Dropdown";
import React from "react";
import { useYear } from "../components/UI/dropdown/hooks/useYear";
import { useMonth } from "../components/UI/dropdown/hooks/useMonth";

const years = ["2014", "2015", "2016", "2023"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default function FilterPage() {
  const { selectedYear, setSelectedYear } = useYear();
  const { selectedMonth, setSelectedMonth } = useMonth();

  return (
    <div className="flex gap-4">
      <Dropdown
        options={years}
        value={selectedYear || years[0]}
        onChange={setSelectedYear}
      />
      <Dropdown
        options={months}
        value={selectedMonth || months[0]}
        onChange={setSelectedMonth}
      />
    </div>
  );
}
