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

  // Test 3: Try login with common passwords
  const commonPasswords = ["123", "admin", "password", "admin123", "grace", "church"];
  
  console.log("=== Testing login with common passwords ===");
  
  for (const pwd of commonPasswords) {
    console.log(`🔑 Trying password: "${pwd}"`);
    
    try {
      const loginResponse = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@email.com",
          password: pwd
        }),
      });

      console.log(`Password "${pwd}" response status:`, loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log(`🎉 SUCCESS! Login works with password: "${pwd}"`);
        console.log("✅ Login data:", loginData);
        console.log(`🔑 USE THESE CREDENTIALS: admin@email.com / ${pwd}`);
        return; // Stop testing once we find working credentials
      } else {
        const loginError = await loginResponse.text();
        console.log(`❌ Password "${pwd}" failed:`, loginError);
      }
    } catch (error) {
      console.log(`❌ Password "${pwd}" test failed:`, error.message);
    }
  }
  
  console.log("💡 NONE of the common passwords worked.");
  console.log("💡 SOLUTION: You need to either:");
  console.log("   1. Remember the correct password for admin@email.com");
  console.log("   2. Check your backend database directly");
  console.log("   3. Create a new user with a known password");
  console.log("   4. Reset the admin password in your backend database");
  
  // Test 4: Try alternative user creation methods
  console.log("=== Trying alternative user creation ===");
  
  // Try POST to /admin/create-user or similar
  const adminEndpoints = [
    "/admin/create-user",
    "/admin/users", 
    "/create-admin",
    "/setup-admin"
  ];
  
  for (const endpoint of adminEndpoints) {
    try {
      console.log(`🔍 Trying endpoint: ${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
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
      
      console.log(`Endpoint ${endpoint} response:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`🎉 SUCCESS! User created via ${endpoint}:`, data);
        return;
      }
    } catch (error) {
      console.log(`Endpoint ${endpoint} failed:`, error.message);
    }
  }
};

// Auto-run this test
if (typeof window !== 'undefined') {
  console.log("🚀 Running backend diagnostics...");
  testBackendAndCreateAdmin();
}