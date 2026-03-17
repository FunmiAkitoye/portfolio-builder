const user = JSON.parse(localStorage.getItem("currentUser"));
const index = Number(localStorage.getItem("selectedPortfolioIndex"));

if (!user || !Array.isArray(user.portfolios) || isNaN(index) || !user.portfolios[index]) {
    window.location.href = "dashboard.html";
}

const p = user.portfolios[index];

// Basic Info
document.getElementById("p-name").textContent = p.fullName;
document.getElementById("p-title").textContent = p.title;
document.getElementById("p-bio").textContent = p.bio;

// Image
if (p.image) document.getElementById("p-image").src = p.image;

// Skills
const skillsContainer = document.getElementById("skills-container");
skillsContainer.innerHTML = "";
if (p.skills && p.skills.length > 0) {
    p.skills.forEach(skill => {
        const div = document.createElement("div");
        div.className = "skill-badge";
        div.innerHTML = `<i class="fa-solid fa-star"></i> <span>${skill}</span>`;
        skillsContainer.appendChild(div);
    });
}

// Experience
const expContainer = document.getElementById("experience-container");
expContainer.innerHTML = "";
if (p.experience && p.experience.length > 0) {
    p.experience.forEach((exp, i) => {
        expContainer.innerHTML += `
            <div class="item-card">
                <h4>💼 Experience ${i + 1}</h4>
                <p><strong>Role:</strong> ${exp.role}</p>
                <p><strong>Company:</strong> ${exp.company}</p>
                <p><strong>Duration:</strong> ${exp.duration}</p>
                <p><strong>Description:</strong> ${exp.description}</p>
            </div>
        `;
    });
} else {
    expContainer.innerHTML = "<p>No experience added.</p>";
}

// Projects
const projContainer = document.getElementById("projects-container");
projContainer.innerHTML = "";
if (p.projects && p.projects.length > 0) {
    p.projects.forEach((proj, i) => {
        projContainer.innerHTML += `
            <div class="item-card">
                <h4>🧩 Project ${i + 1}</h4>
                <p><strong>Project Name:</strong> ${proj.name}</p>
                <p><strong>Description:</strong> ${proj.description}</p>
                ${proj.link ? `<p><strong>Link:</strong> <a href="${proj.link}" target="_blank">View Project</a></p>` : ""}
            </div>
        `;
    });
} else {
    projContainer.innerHTML = "<p>No projects added.</p>";
}

// Contact
document.querySelector(".contact").innerHTML = `
    <h4>Contact</h4>
    <p><i class="fa-solid fa-envelope"></i> Email: ${p.email || ""}</p>
    <p><i class="fa-brands fa-github"></i> GitHub: ${p.github || ""}</p>
    <p><i class="fa-brands fa-instagram"></i> Instagram: ${p.instagram || ""}</p>
    <p><i class="fa-brands fa-linkedin"></i> LinkedIn: ${p.linkedin || ""}</p>
`;

const editBtn = document.getElementById("editPortfolioBtn");
const deleteBtn = document.getElementById("deletePortfolioBtn");

editBtn.addEventListener("click", () => {
  // Store the selected portfolio index so create.html can load it for editing
  localStorage.setItem("editPortfolioIndex", index);
  window.location.href = "create.html"; // redirect to create.html for editing
});

deleteBtn.addEventListener("click", () => {
  const confirmDelete = confirm(
    "⚠️ WARNING! You are about to delete this portfolio. This action cannot be undone."
  );
  if (!confirmDelete) return;

  // Remove the portfolio
  user.portfolios.splice(index, 1);

  // Save changes to localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const updatedUsers = users.map(u => u.email === user.email ? user : u);
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("currentUser", JSON.stringify(user));

  alert("Portfolio deleted successfully.");
  window.location.href = "portfolio-list.html"; // redirect back to list
});
const shareBtn = document.getElementById("shareBtn");
const shareOptions = document.getElementById("shareOptions");
const shareLinkBtn = document.getElementById("shareLinkBtn");

shareBtn.addEventListener("click", () => {
  shareOptions.classList.toggle("hidden");
});

shareLinkBtn.addEventListener("click", () => {
  const url = window.location.href;

  navigator.clipboard.writeText(url)
    .then(() => {
      alert("Portfolio link copied to clipboard!");
      shareOptions.classList.add("hidden");
    })
    .catch(() => {
      alert("Failed to copy link. Please copy manually.");
    });
});

document.addEventListener("DOMContentLoaded", () => {
  window.downloadPDF = function () {
    const element = document.querySelector(".portfolio-card");

    if (!element) {
      alert("Portfolio not found");
      return;
    }

    // Temporarily remove height/overflow restrictions
    const originalOverflow = element.style.overflow;
    const originalHeight = element.style.height;

    element.style.overflow = "visible";
    element.style.height = "auto";

    const options = {
      margin: 0.5,
      filename: "portfolio.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      },
      pagebreak: { mode: ["css", "legacy"] }
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        // Restore original styles
        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;
      });
  };
});
