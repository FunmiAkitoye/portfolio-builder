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

      const compressedImage = canvas.toDataURL("image/jpeg", 0.6);
      callback(compressedImage);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

const user = JSON.parse(localStorage.getItem("currentUser"));
const users = JSON.parse(localStorage.getItem("users")) || [];

if (!user) {
  window.location.href = "login.html";
}

/* Pre-fill signup info */
document.getElementById("settingsName").value = user.fullName || "";
document.getElementById("settingsEmail").value = user.email || "";

function updateSettings() {
  const name = document.getElementById("settingsName").value.trim();
  const email = document.getElementById("settingsEmail").value.trim();
  const password = document.getElementById("settingsPassword").value;
  const imageFile = document.getElementById("settingsImage").files[0];

  if (!name || !email) {
    alert("Name and email are required");
    return;
  }

  user.fullName = name;
  user.email = email;

  if (password) {
    user.password = password;
  }

  const saveUser = () => {
    const updatedUsers = users.map(u =>
      u.email === user.email ? user : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(user));

    showSuccess();
  };

  if (imageFile) {
    compressImage(imageFile, compressedImage => {
      user.profileImage = compressedImage; // DASHBOARD IMAGE ONLY
      saveUser();
    });
  } else {
    saveUser();
  }
}

/* Green success message */
function showSuccess() {
  let msg = document.getElementById("successMsg");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "successMsg";
    msg.textContent = "Changes saved!";
    msg.style.background = "#16a34a";
    msg.style.color = "#fff";
    msg.style.padding = "10px";
    msg.style.marginTop = "10px";
    msg.style.borderRadius = "6px";
    msg.style.textAlign = "center";

    document.querySelector(".form-container").appendChild(msg);
  }

  setTimeout(() => msg.remove(), 2500);
}
