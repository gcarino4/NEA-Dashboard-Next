  import type { YearlyMetrics } from "./types/EcMetrics";

  export async function fetchYearlyData(
  year: string | null
): Promise<YearlyMetrics | null> {
  const endpoint = process.env.NEXT_PUBLIC_NEA_DEV_CENTRAL;

  if (!year) {
    console.log("No Year provided");
    return null;
  }

  try {
    const response = await fetch(
      `${endpoint}/api/dashboard/ec-classification-yearly-historical-report/?year=${year}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const record = await response.json(); // Directly use the object

    return {
      financial_assessment: {
        working_capital_ratio: Number(record.wcfCount) || 0,
        working_capital_percent: Number(record.wcfPercent) || 0,
        collection_efficiency: Number(record.coeffCount) || 0,
        collection_efficiency_percent: Number(record.coeffPercent) || 0,
        accounts_payable: Number(record.apCount) || 0,
        accounts_payable_percent: Number(record.apPercent) || 0,
        rfo: Number(record.rfoCount) || 0,
        rfo_percent: Number(record.rfoPercent) || 0,
        net_worth: Number(record.netWorthCount) || 0,
        net_worth_percent: Number(record.netWorthPercent) || 0,
      },
      reliability_assessment: {
        saifi: Number(record.saifiCount) || 0,
        saifi_percent: Number(record.saifiPercent) || 0,
        saidi: Number(record.saidiCount) || 0,
        saidi_percent: Number(record.saidiPercent) || 0,
        caidi: Number(record.caidiCount) || 0,
        caidi_percent: Number(record.caidiPercent) || 0,
        system_loss: Number(record.systemslossCount) || 0,
        system_loss_percent: Number(record.systemslossPercent) || 0,
      },
      ec_classification: {
        technical: Number(record.technicalCount) || 0,
        technical_percent: Number(record.technicalPercent) || 0,
        financial: Number(record.financialCount) || 0,
        financial_percent: Number(record.financialPercent) || 0,
        overall: Number(record.overallCount) || 0,
        overall_percent: Number(record.overallPercent) || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching EC data:", error);
    throw error;
  }
}

  
  