export interface YearlyMetrics {
    financial_assessment: {
      working_capital_ratio: number;
      working_capital_percent: number;
      collection_efficiency: number;
      collection_efficiency_percent: number;
      accounts_payable: number;
      accounts_payable_percent: number;
      rfo: number;
      rfo_percent: number;
      net_worth: number;
      net_worth_percent: number;
    };
    reliability_assessment: {
      saifi: number;
      saifi_percent: number;
      saidi: number;
      saidi_percent: number;
      caidi: number;
      caidi_percent: number;
      system_loss: number;
      system_loss_percent: number;
    };
    ec_classification: {
      technical: number;
      technical_percent: number;
      financial: number;
      financial_percent: number;
      overall: number;
      overall_percent: number;
    };
  }
  
  