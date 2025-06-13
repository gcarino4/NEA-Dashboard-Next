export interface ECMetrics {
  financial_assessment: {
    working_capital_ratio: number;
    collection_efficiency: number;
    accounts_payable: number;
    rfo: number;
    net_worth: number;
  };
  reliability_assessment: {
    saifi: number;
    saidi: number;
    caidi: number;
    system_loss: number;
  };
  ec_classification: {
    technical: string;
    financial: string;
    overall: string;
  };
}


export async function fetchECData(ecCode: string | null, year: string | null, month: string | null): Promise<ECMetrics | null> {
  const endpoint = process.env.NEXT_PUBLIC_NEA_DEV_CENTRAL;
  
  if (!ecCode || !year || !month) {
    console.log('No EC Code, Year, or Month provided');
    return null;
  }

  try {
    const response = await fetch(
      `${endpoint}/api/dashboard/ec-classification-quarterly-ec-report/?year=${year}&month=${month}&ecCode=${ecCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.error('API returned empty or invalid array');
      return null;
    }

    const record = data[0];

    return {
      financial_assessment: {
        working_capital_ratio: Number(record.working_cap_ratio) || 0,
        collection_efficiency: Number(record.collection_efficiency) || 0,
        accounts_payable: record.ap_assessment || 'N/A',
        rfo: Number(record.rfo) || 0,
        net_worth: Number(record.net_worth) || 0,
      },
      reliability_assessment: {
        saifi: Number(record.u_monthly_saifi) || 0,
        saidi: Number(record.u_monthly_saidi) || 0,
        caidi: Number(record.u_monthly_caidi) || 0,
        system_loss: Number(record.systemsloss) || 0,
      },
      ec_classification: {
        technical: record.saifi_assessment || 'N/A',
        financial: record.financial_assessment || 'N/A',
        overall: record.ec_classification || 'N/A',
      },
    };
  } catch (error) {
    console.error('Error fetching EC data:', error);
    throw error;
  }
}

