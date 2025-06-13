import axios from 'axios';

const STATE_ENDPOINT = process.env.NEXT_PUBLIC_NEA_STATE;

export const pushYear = async (year: string | null) => {
  if (!year) {
    throw new Error("EC Code cannot be null");
  }

  try {
    // Send EC_CODE in the request body (JSON)
    const response = await axios.post(`${STATE_ENDPOINT}/api/push/year`, { year: year });
    return response.data;
  } catch (error) {
    console.error("Error pushing Year:", error);
    throw error;
  }
};

export const pushMonth = async (month: string | null) => {
  if (!month) {
    throw new Error("EC Code cannot be null");
  }

  try {
    // Send EC_CODE in the request body (JSON)
    const response = await axios.post(`${STATE_ENDPOINT}/api/push/month`, { month: month });
    return response.data;
  } catch (error) {
    console.error("Error pushing Year:", error);
    throw error;
  }
};