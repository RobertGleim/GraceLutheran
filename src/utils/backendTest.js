// Test backend connectivity
export const testBackendConnection = async () => {
  const API_URL = import.meta.env.VITE_API_URL || "https://gracelutheranbacke.onrender.com";
  
  try {
    console.log('Testing backend connection to:', API_URL);
    const response = await fetch(`${API_URL}/pastor-messages/active`);
    console.log('Backend test response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend is reachable, sample response:', data);
      return { success: true, status: response.status };
    } else {
      console.log('Backend responded with error:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return { success: false, error: error.message };
  }
};