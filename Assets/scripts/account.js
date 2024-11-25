const getPassword = document.getElementById("password");
const togglePassword = document.getElementById("toggleIcon");
const togglePassword2 = document.getElementById("toggleIcon2");
const getConfirmation = document.getElementById("confirmation");

const URL = "http://localhost:3001/api/v1/";

const api = axios.create({
  // baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
  baseURL: `https://healthpal-61m8.onrender.com/api/v1/`,
  // baseURL: `http://localhost:3001/api/v1/`,
});

const submitBtn = document.getElementById("submit-btn");

togglePassword.addEventListener("click", () => {
  if (getPassword.type === "password") {
    togglePassword.src = "Assets/images/icons8_eye_2.svg";
    getPassword.type = "text";
  } else {
    togglePassword.src = "Assets/images/icons8_hide_1.svg";
    getPassword.type = "password";
  }
});

/* Signup section */
const signupform = document.getElementById("signup-form");
const successfulAccount = Swal.mixin({
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

signupform.addEventListener("submit", (e) => {
  submitBtn.textContent = "loading....";
  submitBtn.disabled = true;
  e.preventDefault();
  const signUpValues = {};
  const form = new FormData(e.target);
  form.forEach((value, name) => (signUpValues[name] = value));

  api
    .post(`user/create`, JSON.stringify(signUpValues), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((value) => {
      submitBtn.textContent = "";
      submitBtn.disabled = true;
      successfulAccount
        .fire({
          icon: "success",
          title: "Account created Successfully.",
        })
        .then(() => {
          // Redirect to landing page after success
          window.location.href = "login.html"; // Replace with your landing page URL
        });
    })
    .catch((err) => {
      submitBtn.textContent = "";
      submitBtn.disabled = false;
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "SignUp Failed",
        text: err.response.data.message,
        // 'Invalid username or password. Please try again!',
      });
    });
});
