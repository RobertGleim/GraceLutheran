// Quick backend connectivity and admin creation test
const API_URL = "https://gracelutheranbacke.onrender.com";

export const testBackendAndCreateAdmin = async () => {
  console.log("=== Backend Connectivity Test ===");
  
  // Test 1: Check if backend is responding
  try {
    const healthCheck = await fetch(`${API_URL}/pastor-messages/active`);
    console.log("✅ Backend is responding:", healthCheck.status);
  } catch (error) {
    console.log("❌ Backend connection failed:", error.message);
    return;
  }

  // Test 2: Try to create/register a new admin user
  console.log("=== Attempting to create admin user ===");
  
  try {
    const registerResponse = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        email: "admin@email.com",
        password: "123",
        role: "admin"
      }),
    });

    console.log("Register response status:", registerResponse.status);
    
    if (registerResponse.ok) {
      const data = await registerResponse.json();
      console.log("✅ Admin user created successfully:", data);
    } else {
      const errorText = await registerResponse.text();
      console.log("❌ Failed to create admin user:", errorText);
      
      if (registerResponse.status === 409 || errorText.includes("already exists")) {
        console.log("💡 User already exists - this is expected if you've created it before");
        console.log("💡 Try logging in with the correct password for this email");
      }
    }
  } catch (error) {
    console.log("❌ Register request failed:", error.message);
  }

  // Test 3: Try login with the credentials
  console.log("=== Testing login with admin@email.com / 123 ===");
  
  try {
    const loginResponse = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@email.com",
        password: "123"
      }),
    });

    console.log("Login test response status:", loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log("✅ Login successful:", loginData);
    } else {
      const loginError = await loginResponse.text();
      console.log("❌ Login failed:", loginError);
    }
  } catch (error) {
    console.log("❌ Login test failed:", error.message);
  }
};

// Auto-run this test
if (typeof window !== 'undefined') {
  console.log("🚀 Running backend diagnostics...");
  testBackendAndCreateAdmin();
}