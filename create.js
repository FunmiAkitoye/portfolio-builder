function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 300;
      const scale = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedData = canvas.toDataURL("image/jpeg", 0.6);
      callback(compressedData);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const users = JSON.parse(localStorage.getItem("users")) || [];

let projectCount = 0;
const projectsWrapper = document.getElementById("projects-wrapper");


// Add a new project input set
function addProject(data = {}) {
  projectCount++;
  const div = document.createElement("div");
  div.className = "project-card";
  div.innerHTML = `
    <h5>Project ${projectCount}</h5>
    <input type="text" class="proj-name" placeholder="Project Name" value="${data.name || ""}">
    <textarea class="proj-desc" placeholder="Project Description">${data.description || ""}</textarea>
    <input type="text" class="proj-link" placeholder="Project Link" value="${data.link || ""}">
    <button type="button" onclick="removeProject(this)">Remove</button>
  `;
  projectsWrapper.appendChild(div);
}

// Remove project input set
function removeProject(btn) {
  btn.parentElement.remove();
}

let experienceCount = 0;
const experienceWrapper = document.getElementById("experience-wrapper");

function addExperience(data = {}) {
  experienceCount++;

  const div = document.createElement("div");
  div.className = "experience-card";

  div.innerHTML = `
    <h5>Experience ${experienceCount}</h5>
    <input type="text" class="exp-role" placeholder="Role" value="${data.role || ""}">
    <input type="text" class="exp-company" placeholder="Company" value="${data.company || ""}">
    <input type="text" class="exp-duration" placeholder="Duration (e.g. 2024 – Present)" value="${data.duration || ""}">
    <textarea class="exp-desc" placeholder="What you did">${data.description || ""}</textarea>
    <button type="button" onclick="this.parentElement.remove()">Remove</button>
  `;

  experienceWrapper.appendChild(div);
}


// Generate & preview portfolio (stay on page)
function savePortfolio() {
  const file = document.getElementById("profileImage").files[0];

  const portfolioData = {
    image: "",
    fullName: fullName.value.trim(),
    title: title.value.trim(),
    bio: bio.value.trim(),
    skills: skills.value.split(",").map(s => s.trim()),

    experience: Array.from(document.getElementsByClassName("experience-card")).map(card => ({
      role: card.querySelector(".exp-role").value.trim(),
      company: card.querySelector(".exp-company").value.trim(),
      duration: card.querySelector(".exp-duration").value.trim(),
      description: card.querySelector(".exp-desc").value.trim()
    })),


    projects: Array.from(document.getElementsByClassName("project-card")).map(card => ({
      name: card.querySelector(".proj-name").value,
      description: card.querySelector(".proj-desc").value,
      link: card.querySelector(".proj-link").value
    })),

    email: email.value.trim(),
    instagram: instagram.value.trim(),
    github: github.value.trim(),
    linkedin: linkedin.value.trim(),

    createdAt: Date.now()
  };

  const saveAndRedirect = () => {
    if (!currentUser.portfolios) currentUser.portfolios = [];

    // newest first
    currentUser.portfolios.unshift(portfolioData);

    const updatedUsers = users.map(u =>
      u.email === currentUser.email ? currentUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("selectedPortfolioIndex", 0);

    window.location.href = "preview.html";
  };

  if (file) {
    compressImage(file, compressedImage => {
      portfolioData.image = compressedImage;
      saveAndRedirect();
    });
  } else {
    saveAndRedirect();
  }
}
