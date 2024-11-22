// app.js
document.addEventListener("DOMContentLoaded", () => {
  const reader = document.getElementById("reader");
  const startButton = document.getElementById("startScanning");
  const stopButton = document.getElementById("stopScanning");
  const resultElement = document.getElementById("result");

  let html5QrCode; // Declare the scanner variable

  // Function to start scanning
  function startScanning() {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode
      .start(
        { facingMode: "environment" }, // Use the back camera
        {
          fps: 10, // Scans per second
          qrbox: 500, // Size of the scanning box
          disableFlip:true
        },
        (decodedText, decodedResult) => {
          // Show the scanned result
          // console.log(decodedText,"heyyyyyy")
          // console.log(decodedResult,"hiiiiiiyyyyyy")
          fetchDrug(decodedText);
          stopScanning()
          // resultElement.textContent = `QR Code Result: ${decodedText}`;
        },
        (errorMessage) => {
          // Optional: Handle scan errors
          console.warn(`QR Code scanning error: ${errorMessage}`);
        }
      )
      .then(() => {
        startButton.disabled = true; // Disable the Start button
        stopButton.disabled = false; // Enable the Stop button
        console.log("QR Code scanning started.");
      })
      .catch((err) => {
        console.error("Unable to start QR Code scanning:", err);
      });
  }

  // Function to stop scanning
  function stopScanning() {
    if (html5QrCode) {
      html5QrCode
        .stop()
        .then(() => {
          console.log("QR Code scanning stopped.");
          startButton.disabled = false; // Enable the Start button
          stopButton.disabled = true; // Disable the Stop button
        })
        .catch((err) => {
          console.error("Error stopping scanning:", err);
        });
    }
  }

  // Event listeners for the buttons
  startButton.addEventListener("click", startScanning);
  stopButton.addEventListener("click", stopScanning);
});

// app.js
// document.addEventListener('DOMContentLoaded', () => {
//   const resultElement = document.getElementById('result');

//   // Create QR Code reader instance
//   const html5QrCode = new Html5Qrcode("reader");

//   // Start the QR code scanner
//   html5QrCode.start(
//     { facingMode: "environment" }, // Use the back camera
//     {
//       fps: 10, // Scans per second
//       qrbox: 250, // Size of the scanning box
//     },
//     (decodedText, decodedResult) => {
//       // Show the scanned result
//       resultElement.textContent = `QR Code Result: ${decodedText}`;

//       // Stop scanning after successful scan
//       html5QrCode.stop().then(() => {
//         console.log("QR Code scanning stopped.");
//       }).catch((err) => {
//         console.error("Error stopping scanning:", err);
//       });
//     },
//     (errorMessage) => {
//       // Optional: Handle scan errors
//       console.warn(`QR Code scanning error: ${errorMessage}`);
//     }
//   ).catch((err) => {
//     console.error("Unable to start QR Code scanning:", err);
//   });
// });


const fetchDrug = async (id) => {
  const displayFetchedItem = document.getElementById("displayFetchedItem");
  displayFetchedItem.textContent = "Loading...";
  const api = axios.create({
    baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
    // baseURL: `http://localhost:3001/api/v1/`,
  });

  api
    .get(`drugs/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((value) => {
      const { name, description, expiryDate, manufacturingDate } =
        value.data.message;
      const drug = { name, description, expiryDate, manufacturingDate };
      displayFetchedItem.textContent = "";
      displayDrugDetails(drug);
    })
    .catch((err) => {
      console.log(err, "hmmmm");
      displayFetchedItem.textContent = "";
      displayDrugDetails(err.response.data.message, true);
    });
};

function displayDrugDetails(drug, error) {
  const displayFetchedItem = document.getElementById("displayFetchedItem");
  if (error) {
    const errorDiv = document.createElement("div");
    errorDiv.textContent = drug;
    errorDiv.setAttribute("class", "danger");

    return displayFetchedItem.append(errorDiv);
  }
  // debugger;
  for (const key in drug) {
    const tableRow = document.createElement("div");
    tableRow.setAttribute("class", "table-row");
    const tableCell1 = document.createElement("div");
    const tableCell2 = document.createElement("div");

    tableCell1.setAttribute("class", "table-cell");
    tableCell2.setAttribute("class", "table-cell");
    if (key.includes("Date")) {
      tableCell1.textContent = key;
      tableCell2.textContent = new Date(drug[key]).toLocaleDateString();
      tableRow.append(tableCell1);
      tableRow.append(tableCell2);
      displayFetchedItem.append(tableRow);
    } else {
      tableCell1.textContent = key;
      tableCell2.textContent = drug[key];
      tableRow.append(tableCell1);
      tableRow.append(tableCell2);
      displayFetchedItem.append(tableRow);
    }
    // tableRow.append(tableCell1);
    // tableRow.append(tableCell2);
    // displayFetchedItem.append(tableRow);
  }
}
