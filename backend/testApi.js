async function testServer() {
  const tokenData = await fetch("http://localhost:5000/api/auth/login", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email: "doctor@test.com", password: "password123" })
  }).then(r => r.json());
  
  console.log("Login User:", tokenData);

  const appointments = await fetch("http://localhost:5000/api/appointments").then(r => r.json());
  console.log("Appointments Response:", appointments);
}
testServer();
