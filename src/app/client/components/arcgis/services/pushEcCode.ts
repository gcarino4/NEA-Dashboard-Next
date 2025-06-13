import axios from 'axios';

const STATE_ENDPOINT = process.env.NEXT_PUBLIC_NEA_STATE;

export const pushECCode = async (ecCode: string | null) => {
  if (!ecCode) {
    throw new Error("EC Code cannot be null");
  }

  try {
    // Send EC_CODE in the request body (JSON)
    const response = await axios.post(`${STATE_ENDPOINT}/api/push/ec`, { ec_code: ecCode });
    return response.data;
  } catch (error) {
    console.error("Error pushing EC Code:", error);
    throw error;
  }
};
