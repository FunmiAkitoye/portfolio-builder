function savePortfolio() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users"));

  const imageInput = document.getElementById("profileImage");
  const file = imageInput.files[0];

  const portfolioData = {
    fullName: document.getElementById("fullName").value,
    title: document.getElementById("title").value,
    bio: document.getElementById("bio").value,
    skills: document.getElementById("skills").value.split(","),
    experience: [
      {
        role: document.getElementById("expRole").value,
        company: document.getElementById("expCompany").value,
        duration: document.getElementById("expDuration").value,
        description: document.getElementById("expDesc").value
      }
    ],
    projects: [
      {
        name: document.getElementById("projName").value,
        description: document.getElementById("projDesc").value,
        link: document.getElementById("projLink").value
      }
    ],
    email: document.getElementById("email").value,
    instagram: document.getElementById("instagram").value,
    github: document.getElementById("github").value,
    image: ""
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      portfolioData.image = reader.result;
      saveToStorage(portfolioData, currentUser, users);
    };
    reader.readAsDataURL(file);
  } else {
    saveToStorage(portfolioData, currentUser, users);
  }
}

function saveToStorage(portfolioData, currentUser, users) {
  const updatedUsers = users.map(user => {
    if (user.email === currentUser.email) {
      user.portfolio = portfolioData;
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
    return user;
  });

  localStorage.setItem("users", JSON.stringify(updatedUsers));
  window.location.href = "preview.html";
}
