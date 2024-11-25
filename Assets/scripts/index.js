const getPassword = document.getElementById("password");
const togglePassword = document.getElementById("toggleIcon");
const togglePassword2 = document.getElementById("toggleIcon2");
const getConfirmation = document.getElementById("confirmation");

const URL = "http://localhost:3001/api/v1/";
const returnIcon = document.getElementById("returnIcon");
returnIcon?.addEventListener("click", ()=>{
  window.location.href = "/index.html"
})

const api = axios.create({
  // baseURL: `http://localhost:3001/api/v1/`,
  // baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
  baseURL: `https://healthpal-61m8.onrender.com/api/v1/`,
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

// togglePassword2.addEventListener('click', () => {
//     if (getConfirmation.type === 'password') {
//         togglePassword2.src = 'Assets/images/icons8_eye_2.svg'
//         getConfirmation.type = 'text'
//     } else {
//         togglePassword2.src = 'Assets/images/icons8_hide_1.svg'
//         getConfirmation.type = 'password'
//     }
// })

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

signupform?.addEventListener("submit", (e) => {
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
      submitBtn.textContent = "Sign up";
      submitBtn.disabled = false;
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
      submitBtn.textContent = "Sign up";
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

/* Login section */
const loginform = document.getElementById("login-form");
const successfulLogin = Swal.mixin({
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

loginform?.addEventListener("submit", (e) => {
  submitBtn.textContent = "loading....";
  submitBtn.disabled = true;
  e.preventDefault();
  const loginValues = {};
  const form = new FormData(e.target);
  form.forEach((value, name) => (loginValues[name] = value));

  api
    .post(`user/login`, JSON.stringify(loginValues), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(async (value) => {
      submitBtn.textContent = "Log in";
      submitBtn.disabled = false;
      const user = value.data.message;
      saveUserCredentials(user);
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Login Successful',
      //   text: `Welcome ${user.fullName}`,
      //   showConfirmButton: false,
      //   timer: 2000, // Auto-close after 2 seconds
      // })
      successfulAccount
        .fire({
          icon: "success",
          title: `Welcome ${user.fullName}`,
        })
        .then(() => {
          ("fired")
          // Redirect to landing page after success
          window.location.href = "dashboard.html"; // Replace with your landing page URL
        });
        ("must have fired")
    })
    .catch((err) => {
      submitBtn.textContent = "Log in";
      submitBtn.disabled = false;
      Swal.fire({
        icon: "error",
        title: "SignUp Failed",
        text: err.response.data.message,
        // 'Invalid username or password. Please try again!',
      });
    });
});

function saveUserCredentials(user) {
  // Check if credentials exist in localStorage
  let savedCredentials = localStorage.getItem("healthPal");

  if (savedCredentials) {
    // Parse existing credentials and update with new values
    savedCredentials = JSON.parse(savedCredentials);
    saveUserCredentials = user;
  } else {
    // Create new credentials object
    savedCredentials = user;
  }

  // Save the updated credentials back to localStorage
  localStorage.setItem("healthPal", JSON.stringify(savedCredentials));
}

function getUserCredentials() {
  const savedCredentials = localStorage.getItem("healthPal");

  if (savedCredentials) {
    return JSON.parse(savedCredentials);
  } else {
    return null;
  }
}
