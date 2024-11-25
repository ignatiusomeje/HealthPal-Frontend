const logoutButton = document.getElementById("logoutButton");
const userName = document.getElementById("userName");
const navbarToggle = document.getElementById("navbarToggle");
const navbarLinks = document.getElementById("navbarLinks");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("healthPal");
  window.location.href = "/login.html";
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
    fetchAllDrugs(user.token);
  } else {
    return null;
  }
}

if (!user) {
  window.location.href = "/login.html";
}

userName.textContent = user.fullName;

async function fetchAllDrugs(token) {
  const tableBody = document.querySelector("tbody");
  tableBody.textContent = "Loading...";
  const api = axios.create({
    // baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
    baseURL: `https://healthpal-61m8.onrender.com/api/v1/`,
    // baseURL: `http://localhost:3001/api/v1/`,
  });

  api
    .get(`drugs/`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    .then((value) => {
      tableBody.textContent = "";
      displayDrugDetails(value.data.message);
    })
    .catch((err) => {
      tableBody.textContent = "";
      displayDrugDetails(err.response.data.message, true);
    });
}

function displayDrugDetails(drug, error) {
  const tableBody = document.querySelector("tbody");
  if (error) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${drug}</td>`;
    return tableBody.appendChild(row);
  }
  drug.forEach((drugInner) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${drugInner.name}</td>
      <td>${drugInner.description}</td>
      <td>${new Date(drugInner.expiryDate).toLocaleDateString()}</td>
      <td>${new Date(drugInner.manufacturingDate).toLocaleDateString()}</td>
      <td><button name="${drugInner.name}_${
      drugInner._id
    }" class="download-btn">Download QR Code</button></td>
    `;
    const downloadBtn = row.querySelector(".download-btn");
    downloadBtn.addEventListener("click", (e) => downloadQRCode(e.target.name));
    tableBody.appendChild(row);
  });
}

// const downloadBtn = document.querySelectorAll(".download-btn");

// downloadBtn.forEach((btn) =>
//   btn.addEventListener("click", (e) => downloadQRCode(e.target.name))
// );

function downloadQRCode(name) {
  const check = document.getElementById("qr-code");
  // check.textContent = "";
  const downloadName = name.split("_")[0];
  const text = name.split("_")[1];

  // const newDiv = document.createElement("div");

  // var qrcode = new QRCode("qr-code", {
  //   text: text,
  //   width: 500,
  //   height: 500,
  //   correctLevel: QRCode.CorrectLevel.M,
  // });

  // var qrcode = new QRCode("qr-code");
  // qrcode.makeCode(name)

  const qr = new QRious({
    element: check,
    // background: "green",
    // backgroundAlpha: 0.8,
    // foreground: "blue",
    // foregroundAlpha: 0.8,
    level: "L",
    padding: 25,
    size: 500,
    value: text,
  });

  // const qrImage = check.querySelector("canvas");
  const downloadLink = document.createElement("a");
  downloadLink.href = qr.toDataURL();
  // qrImage.toDataURL("image/png");
  downloadLink.download = `${downloadName}.png`;
  downloadLink.click();

  // function generateAndDownloadQR(data) {
  //   // Create a container for the QR code
  //   const qrCodeContainer = document.getElementById("qrcode");
  //   qrCodeContainer.innerHTML = ""; // Clear previous QR codes if any

  //   // Generate QR Code
  //   const qrCode = new QRCode(qrCodeContainer, {
  //     text: data,
  //     width: 256,
  //     height: 256,
  //     correctLevel: QRCode.CorrectLevel.H,
  //   });

  //   // Delay to ensure the QR code is generated
  //   setTimeout(() => {
  //     // Get the QR code image
  //     const qrImage = qrCodeContainer.querySelector("img").src;

  //     // Create a link to download the QR code
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = qrImage;
  //     downloadLink.download = "qrcode.png";
  //     downloadLink.click();

  //     // Clean up: Optionally hide the QR code container
  //     qrCodeContainer.style.display = "none";
  //   }, 500);
  // }

  // console.log(id, "here")
}
