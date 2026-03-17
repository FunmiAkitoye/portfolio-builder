const users = JSON.parse(localStorage.getItem("users")) || [];

// SIGN UP
function signup() {
  const fullName = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!fullName || !email || !password) {
    alert("All fields required");
    return;
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    alert("User already exists");
    return;
  }

  const newUser = {
    fullName: fullName,        // ✅ saved at signup
    email: email,
    password: password,
    image: "",                 // profile picture (from settings)
    portfolios: []             // multiple portfolios support
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful");
  window.location.href = "login.html";
}

// LOGIN
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    alert("Invalid login");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}