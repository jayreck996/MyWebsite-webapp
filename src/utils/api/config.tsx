export const API_CONFIG = {
  // Switch between Supabase and Lambda backends
  USE_LAMBDA: true, // Set to true to use Lambda backend
  
  // Lambda API Gateway endpoint
  LAMBDA_API_URL: 'https://b0c1xjduv3.execute-api.us-east-1.amazonaws.com',
  
  // Supabase endpoint (fallback)
  // SUPABASE_API_URL: 'https://bjjrurbqwuuhxnoxpwzs.supabase.co/functions/v1/make-server-928e78a6'
};

// export const getApiUrl = () => {
//   return API_CONFIG.USE_LAMBDA ? API_CONFIG.LAMBDA_API_URL : API_CONFIG.LAMBDA_API_URL;
// };


export const getApiUrl = () => API_CONFIG.LAMBDA_API_URL;