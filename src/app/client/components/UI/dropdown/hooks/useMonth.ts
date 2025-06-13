import { useState, useEffect, useRef } from 'react';
import { pushMonth } from '../services/pushFilter';

export const useMonth = () => {
  const endpoint = process.env.NEXT_PUBLIC_NEA_STATE;
  
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Poll for MONTH changes
  useEffect(() => {
    const FetchMonth = async () => {
      try {
        const response = await fetch(`${endpoint}/api/get/month`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.month && data.month !== selectedMonth) {
          setSelectedMonth(data.month);
        }
      } catch (error) {
        console.error('Error fetching MONTH:', error);
      }
    };

    // Initial fetch
    FetchMonth();

    // Set up polling every 2 seconds
    pollingInterval.current = setInterval(FetchMonth, 2000);

    // Cleanup
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [selectedMonth]);

  const handleFilterChange = async (month: string | null) => {
    setSelectedMonth(month);
    
    if (month && month !== "Default") {
      try {
        await pushMonth(month);
      } catch (error) {
        console.error("Failed to sync FILTER with server:", error);
      }
    }
  };

  return {
    selectedMonth,
    setSelectedMonth: handleFilterChange
  };
}; 