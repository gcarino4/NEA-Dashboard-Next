import type { Location } from "../types/EcLocation";

export async function fetchLocationData(): Promise<Location[]> {
  const endpoint = process.env.NEXT_PUBLIC_NEA_DEV_CENTRAL;
  try {
    const response = await fetch(`${endpoint}/api/dashboard/location-detail/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // Check if the response has the expected structure with ecCode array
    if (!responseData || !responseData.ecCode || !Array.isArray(responseData.ecCode)) {
      console.error('API response does not have the expected structure:', responseData);
      return [];
    }
    
    // Extract the required fields from the ecCode array
    const locations: Location[] = responseData.ecCode.map((item: any) => ({
      EC_CODE: item.EC_CODE,
      LOC_LONG: parseFloat(item.LOC_LONG),
      LOC_LAT: parseFloat(item.LOC_LAT)
    }));
    
    return locations;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return [];
  }
}
