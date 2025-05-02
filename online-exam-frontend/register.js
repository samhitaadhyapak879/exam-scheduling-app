function toggleStudentFields() {
    const role = document.getElementById("role").value;
    document.getElementById("student-fields").style.display = role === "STUDENT" ? "block" : "none";
  }
  
  document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const role = document.getElementById("role").value;
  
    const statusField = document.getElementById("register-status");
  
    if (password !== confirmPassword) {
      statusField.innerText = "Passwords do not match!";
      return;
    }
  
    const payload = {
      username,
      email,
      password,
      role
    };
  
    if (role === "STUDENT") {
      payload.name = document.getElementById("name").value.trim();
      payload.usn = document.getElementById("usn").value.trim();
    }
  
    fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        if (msg.includes("successful")) {
          window.location.href = "index.html";
        } else {
          statusField.innerText = msg;
        }
      })
      .catch(err => {
        console.error("Registration error:", err);
        statusField.innerText = "Server error. Please try again.";
      });
  });
  