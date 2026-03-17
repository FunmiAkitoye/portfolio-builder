const user = JSON.parse(localStorage.getItem("currentUser")); 

if (!user) {
  window.location.href = "login.html";
}

// Display the name that was entered when signing up
document.getElementById("signupFullName").textContent = user.fullName || "";
// Optional: display email or other signup info
document.getElementById("signupEmail").textContent = user.email || "";

document.getElementById("dash-image").src =
  user.profileImage || "assets/images/default-avatar.png";
