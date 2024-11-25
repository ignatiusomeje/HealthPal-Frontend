const logoutButton = document.getElementById("logoutButton");
const userName = document.getElementById("userName");
const navbarToggle = document.getElementById("navbarToggle");
const navbarLinks = document.getElementById("navbarLinks");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("healthPal");
  window.location.href = "/login.html";
});

const api = axios.create({
  // baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
  baseURL: `https://healthpal-61m8.onrender.com/api/v1/`,
  // baseURL: `http://localhost:3001/api/v1/`,
});

// Toggle navbar links visibility
navbarToggle.addEventListener("click", () => {
  navbarLinks.classList.toggle("show");
});

let user;

getUserCredentials();

function getUserCredentials() {
  const savedCredentials = localStorage.getItem("healthPal");

  if (savedCredentials) {
    user = JSON.parse(savedCredentials);
  } else {
    return null;
  }
}

if (!user) {
  window.location.href = "/login.html";
}

userName.textContent = user.fullName;

const drugForm = document.getElementById("drugForm");
const submitBtn = document.getElementById("submitBtn");
const successfulDrugCreation = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  timer: 3000, // Auto-close after 2 seconds
});

drugForm.addEventListener("submit", (e) => {
  submitBtn.textContent = "loading....";
  submitBtn.disabled = true;
  e.preventDefault();
  const drugValues = {};
  const form = new FormData(e.target);
  form.forEach((value, name) => (drugValues[name] = value));

  api
    .post(`drugs/`, JSON.stringify(drugValues), {
      headers: {
        "Content-Type": "application/json",
        "authorization":`Bearer ${user.token}`
      },
    })
    .then((value) => {
      submitBtn.textContent = "Create Drug";
      submitBtn.disabled = true;
      successfulDrugCreation.fire({
        icon: "success",
        title: "drug created Successfully.",
      });
    })
    .catch((err) => {
      submitBtn.textContent = "Create Drug";
      submitBtn.disabled = false;
      Swal.fire({
        icon: "error",
        title: "Drug Creation Failed",
        text: err.response.data.message,
        // 'Invalid username or password. Please try again!',
      });
    });

  // Reset form
  drugForm.reset();
});
