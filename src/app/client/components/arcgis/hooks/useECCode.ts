import { useState, useEffect, useRef } from 'react';
import { pushECCode } from '../services/pushEcCode';

export const useECCode = () => {
  const endpoint = process.env.NEXT_PUBLIC_NEA_STATE;
  
  const [selectedECCode, setSelectedECCode] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Poll for EC code changes
  useEffect(() => {
    const fetchECCode = async () => {
      try {
        const response = await fetch(`${endpoint}/api/get/ec`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.ec_code && data.ec_code !== selectedECCode) {
          setSelectedECCode(data.ec_code);
        }
      } catch (error) {
        console.error('Error fetching EC code:', error);
      }
    };

    // Initial fetch
    fetchECCode();

    // Set up polling every 2 seconds
    pollingInterval.current = setInterval(fetchECCode, 2000);

    // Cleanup
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [selectedECCode]);

  const handleECCodeChange = async (code: string | null) => {
    setSelectedECCode(code);
    
    if (code && code !== "Default") {
      try {
        await pushECCode(code);
      } catch (error) {
        console.error("Failed to sync EC_CODE with server:", error);
      }
    }
  };

  return {
    selectedECCode,
    setSelectedECCode: handleECCodeChange
  };
}; 