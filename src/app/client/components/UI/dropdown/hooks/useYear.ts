import { useState, useEffect, useRef } from 'react';
import { pushYear } from '../services/pushFilter';

export const useYear = () => {
  const endpoint = process.env.NEXT_PUBLIC_NEA_STATE;
  
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Poll for YEAR changes
  useEffect(() => {
    const FetchYear = async () => {
      try {
        const response = await fetch(`${endpoint}/api/get/year`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.year && data.year !== selectedYear) {
          setSelectedYear(data.year);
        }
      } catch (error) {
        console.error('Error fetching YEAR:', error);
      }
    };

    // Initial fetch
    FetchYear();

    // Set up polling every 2 seconds
    pollingInterval.current = setInterval(FetchYear, 2000);

    // Cleanup
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [selectedYear]);

  const handleFilterChange = async (year: string | null) => {
    setSelectedYear(year);
    
    if (year && year !== "Default") {
      try {
        await pushYear(year);
      } catch (error) {
        console.error("Failed to sync FILTER with server:", error);
      }
    }
  };

  return {
    selectedYear,
    setSelectedYear: handleFilterChange
  };
}; 