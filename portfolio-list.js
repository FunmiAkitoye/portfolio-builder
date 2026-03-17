const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) window.location.href = "login.html";

const list = document.getElementById("portfolioList");

if (!user.portfolios || user.portfolios.length === 0) {
  list.innerHTML = "<p>No portfolios created yet.</p>";
} else {
  // Show newest first
  [...user.portfolios].reverse().forEach((p, reversedIndex) => {
    const originalIndex = user.portfolios.length - 1 - reversedIndex;

    const div = document.createElement("div");
    div.className = "portfolio-item";

    div.innerHTML = `
      <div class="portfolio-card">
        <h3>${p.fullName}</h3>
        <p>${p.title}</p>
        <button onclick="viewPortfolio(${originalIndex})">
          View Portfolio
        </button>
      </div>
    `;

    list.appendChild(div);
  });
}

function viewPortfolio(index) {
  localStorage.setItem("selectedPortfolioIndex", index);
  window.location.href = "preview.html";
}
