"use client";

import React, { useEffect, useState } from "react";
import { useYear } from "../UI/dropdown/hooks/useYear";
import { fetchYearlyData } from "./YearlyData";
import type { YearlyMetrics } from "./types/EcMetrics";

export default function Drilldown() {
  const { selectedYear } = useYear();

  const [data, setData] = useState<YearlyMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPercent, setShowPercent] = useState(false); // Toggle for percent mode

  useEffect(() => {
    const getData = async () => {
      if (!selectedYear) return;
      setLoading(true);
      setError(null);

      try {
        const result = await fetchYearlyData(selectedYear);
        setData(result);
      } catch (err) {
        setError("Failed to fetch EC data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [selectedYear]);

  const displayValue = (value: number | string | null | undefined) => {
    const num = Number(value);
    if (!isFinite(num) || num === 0) return "N/A";
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header and toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white text-gray-800 px-4 py-2 rounded shadow">
          <span className="font-semibold">Year:</span> {selectedYear || "N/A"}
        </div>
        <button
          onClick={() => setShowPercent(!showPercent)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          {showPercent ? "Show Actual Values" : "Show Percent Values"}
        </button>
      </div>

      {/* EC Classification */}
      <div className="grid grid-cols-3 gap-4">
        <CategoryCard
          title="TECHNICAL"
          value={displayValue(
            showPercent
              ? data?.ec_classification.technical_percent
              : data?.ec_classification.technical
          )}
        />
        <CategoryCard
          title="FINANCIAL"
          value={displayValue(
            showPercent
              ? data?.ec_classification.financial_percent
              : data?.ec_classification.financial
          )}
        />
        <CategoryCard
          title="OVERALL"
          value={displayValue(
            showPercent
              ? data?.ec_classification.overall_percent
              : data?.ec_classification.overall
          )}
        />
      </div>

      {/* Financial Assessment */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard
          title="WORKING CAPITAL RATIO"
          value={displayValue(
            showPercent
              ? data?.financial_assessment.working_capital_percent
              : data?.financial_assessment.working_capital_ratio
          )}
        />
        <MetricCard
          title="COLLECTION EFFICIENCY"
          value={displayValue(
            showPercent
              ? data?.financial_assessment.collection_efficiency_percent
              : data?.financial_assessment.collection_efficiency
          )}
        />
        <MetricCard
          title="ACCOUNTS PAYABLE"
          value={displayValue(
            showPercent
              ? data?.financial_assessment.accounts_payable_percent
              : data?.financial_assessment.accounts_payable
          )}
        />
        <MetricCard
          title="RFO"
          value={displayValue(
            showPercent
              ? data?.financial_assessment.rfo_percent
              : data?.financial_assessment.rfo
          )}
        />
        <MetricCard
          title="NET WORTH"
          value={displayValue(
            showPercent
              ? data?.financial_assessment.net_worth_percent
              : data?.financial_assessment.net_worth
          )}
        />
      </div>

      {/* Reliability Assessment */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="SAIFI"
          value={displayValue(
            showPercent
              ? data?.reliability_assessment.saifi_percent
              : data?.reliability_assessment.saifi
          )}
        />
        <MetricCard
          title="SAIDI"
          value={displayValue(
            showPercent
              ? data?.reliability_assessment.saidi_percent
              : data?.reliability_assessment.saidi
          )}
        />
        <MetricCard
          title="CAIDI"
          value={displayValue(
            showPercent
              ? data?.reliability_assessment.caidi_percent
              : data?.reliability_assessment.caidi
          )}
        />
        <MetricCard
          title="SYSTEM LOSS"
          value={displayValue(
            showPercent
              ? data?.reliability_assessment.system_loss_percent
              : data?.reliability_assessment.system_loss
          )}
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-yellow-400">
          Loading data for Year: {selectedYear}...
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
      <h2 className="text-xl font-bold mb-2">{title} EC</h2>
      <p className="text-sm">{value || "No data"}</p>
    </div>
  );
}
