"use client";

import React, { useEffect, useState } from "react";
import { useECCode } from "../arcgis/hooks/useECCode";
import { useYear } from "../UI/dropdown/hooks/useYear";
import { useMonth } from "../UI/dropdown/hooks/useMonth";
import { fetchECData, ECMetrics } from "./ECData";

export default function Drilldown() {
  const { selectedECCode } = useECCode();
  const { selectedYear } = useYear();
  const { selectedMonth } = useMonth();

  const [data, setData] = useState<ECMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (!selectedECCode || !selectedYear) return;
      setLoading(true);
      setError(null);

      try {
        const result = await fetchECData(
          selectedECCode,
          selectedYear,
          selectedMonth
        );
        setData(result);
      } catch (err) {
        setError("Failed to fetch EC data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [selectedECCode, selectedYear]);

  const displayValue = (value: number | string | null | undefined) => {
    const num = Number(value);
    return !isFinite(num) || num === 0 ? "N/A" : num.toFixed(2);
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Display selected year and EC code */}
      <div className="flex justify-end gap-4 mb-4">
        <div className="bg-white text-gray-800 px-4 py-2 rounded shadow">
          <span className="font-semibold">Year:</span> {selectedYear || "N/A"}
        </div>
        <div className="bg-white text-gray-800 px-4 py-2 rounded shadow">
          <span className="font-semibold">Month:</span> {selectedMonth || "N/A"}
        </div>
        <div className="bg-white text-gray-800 px-4 py-2 rounded shadow">
          <span className="font-semibold">EC Code:</span>{" "}
          {selectedECCode || "N/A"}
        </div>
      </div>

      {/* Top Section - Three Main Categories */}
      <div className="grid grid-cols-3 gap-4">
        <CategoryCard
          title="TECHNICAL"
          value={data?.ec_classification.technical}
        />
        <CategoryCard
          title="FINANCIAL"
          value={data?.ec_classification.financial}
        />
        <CategoryCard title="OVERALL" value={data?.ec_classification.overall} />
      </div>

      {/* First Row of Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard
          title="WORKING CAPITAL RATIO"
          value={displayValue(
            data?.financial_assessment.working_capital_ratio ?? 0
          )}
        />
        <MetricCard
          title="COLLECTION EFFICIENCY"
          value={displayValue(
            data?.financial_assessment.collection_efficiency ?? 0
          )}
        />
        <MetricCard
          title="ACCOUNTS PAYABLE"
          value={displayValue(data?.financial_assessment.accounts_payable ?? 0)}
        />
        <MetricCard
          title="RFO"
          value={displayValue(data?.financial_assessment.rfo ?? 0)}
        />
        <MetricCard
          title="NET WORTH"
          value={displayValue(data?.financial_assessment.net_worth ?? 0)}
        />
      </div>

      {/* Second Row of Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="SAIFI"
          value={displayValue(data?.reliability_assessment.saifi ?? 0)}
        />
        <MetricCard
          title="SAIDI"
          value={displayValue(data?.reliability_assessment.saidi ?? 0)}
        />
        <MetricCard
          title="CAIDI"
          value={displayValue(data?.reliability_assessment.caidi ?? 0)}
        />
        <MetricCard
          title="SYSTEM LOSS"
          value={displayValue(data?.reliability_assessment.system_loss ?? 0)}
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-yellow-400">
          Loading data for EC Code: {selectedECCode}...
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <p className="text-3xl font-bold text-blue-400">{value}</p>
    </div>
  );
}

function CategoryCard({ title, value }: { title: string; value?: string }) {
  return (
    <div className="bg-gray-600 text-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm">{value || "PLEASE SELECT AN EC"}</p>
    </div>
  );
}
