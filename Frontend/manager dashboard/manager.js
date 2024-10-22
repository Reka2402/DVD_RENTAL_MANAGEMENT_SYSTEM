function dashboardshow() {
  document.getElementById("dashboardcontainer").style.display = "block";
  document.getElementById("customerdcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "none";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "none";
  document.getElementById("display").style.display = "none";
  document.getElementById("reportcontainer").style.display = "none";
}

function homepage() {
  document.getElementById("dashboardcontainer").style.display = "none";
  document.getElementById("customerdcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "none";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "none";
  document.getElementById("display").style.display = "none";
  document.getElementById("reportcontainer").style.display = "none";
}

function reports() {
  document.getElementById("dashboardcontainer").style.display = "none";
  document.getElementById("customerdcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "none";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "none";
  document.getElementById("display").style.display = "none";
  document.getElementById("reportcontainer").style.display = "block";


  // Call the function to load the report counts
  loadReportCounts();
}

// edit dvd function
function editDvd(index) {
  const Dvd = JSON.parse(localStorage.getItem("Dvds")) || [];
  const dvdToEdit = Dvd[index];

  // Populate the edit form with existing DVD data
  document.getElementById("edit-Dvd-title").value = dvdToEdit.title;
  document.getElementById("edit-Dvd-Director").value = dvdToEdit.Director;
  document.getElementById("edit-Dvd-category").value = dvdToEdit.category;
  document.getElementById("edit-dvd-date").value = dvdToEdit.Date;
  document.getElementById("edit-Dvd-Quantity").value = dvdToEdit.quantity;

  // Show the edit form
  document.getElementById("edit-Dvd-container").style.display = "block";
  document.getElementById("dashboardcontainer").style.display = "none";

  const editForm = document.getElementById("edit-Dvd-form");
  editForm.onsubmit = function (event) {
    event.preventDefault();
    updateDvd(index);
  };
}

function updateDvd(index) {
  const Dvd = JSON.parse(localStorage.getItem("Dvds")) || [];
  const updatedDvd = {
    title: document.getElementById("edit-Dvd-title").value.trim(),
    Director: document.getElementById("edit-Dvd-Director").value.trim(),
    category: document.getElementById("edit-Dvd-category").value.trim(),
    Date: document.getElementById("edit-dvd-date").value.trim(),
    quantity: document.getElementById("edit-Dvd-Quantity").value.trim(),
    image: Dvd[index].image // Keep the original image unless updated
  };


  // Check if a new image was uploaded
  const imageInput = document.getElementById("edit-Dvd-image");
  if (imageInput.files[0]) {
    const reader = new FileReader();
    reader.onloadend = function () {
      updatedDvd.image = reader.result; // Update with new image
      saveUpdatedDvd(index, updatedDvd);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveUpdatedDvd(index, updatedDvd); // Save without image change
  }
}

function saveUpdatedDvd(index, updatedDvd) {
  const Dvd = JSON.parse(localStorage.getItem("Dvds")) || [];
  Dvd[index] = updatedDvd; // Update the DVD
  localStorage.setItem("Dvds", JSON.stringify(Dvd)); // Save back to localStorage
  displayDvd(); // Refresh the displayed DVDs
  document.getElementById("edit-Dvd-container").style.display = "none"; // Hide edit form
  document.getElementById("dashboardcontainer").style.display = "block"; // Show dashboard
  // location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const DvdsTableBody = document
    .getElementById("Dvds-table")
    .querySelector("tbody");

  // Function to display Dvds in the table
  document.getElementById("displaydvd").addEventListener("click", displayDvd);
  function displayDvd() {
    document.getElementById("dashboardcontainer").style.display = "none";
    document.getElementById("customerdcontainer").style.display = "none";
    document.getElementById("rentaldcontainer").style.display = "none";
    document.getElementById("overduedcontainer").style.display = "none";
    document.getElementById("returncontainer").style.display = "none";
    document.getElementById("display").style.display = "block";
    document.getElementById("reportcontainer").style.display = "none";

    // Fetch all DVDs from the server
    fetch("http://localhost:5272/api/Manager/Get All DVDs")
      .then((response) => response.json())
      .then((Dvds) => {
        console.log("Array Of The Dvd: ", Dvds)
        DvdsTableBody.innerHTML = ""; // Clear existing rows

        Dvds.forEach((Dvd) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                <td>${Dvd.title}</td>
                <td>${Dvd.director}</td>
                <td>${Dvd.releaseDate}</td>
                <td>${Dvd.genre}</td>
                <td>${Dvd.copiesAvailable}</td>
                <td colspan="2"><button class="editBtn" >Edit </button>
                <button class="delete-button">Delete</button></td>
            `;
          DvdsTableBody.appendChild(row);
        });

        // Add event listeners for edit buttons
        document.querySelectorAll(".editBtn").forEach((button) => {
          button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            editDvd(index);
          });
        });

        // Add event listeners for delete buttons
        document.querySelectorAll(".delete-button").forEach((button) => {
          button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            deleteDvd(index);
          });
        });
      })
      .catch((error) => console.error("Error fetching DVDs:", error));
  }

  // Function to delete a DVD (using fetch)
  function deleteDvd(id) {
    fetch(`/api/dvds/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete DVD");
        }
        displayDvd(); // Refresh the list after deletion
      })
      .catch((error) => console.error("Error deleting DVD:", error));
  }



  document.getElementById("add-Dvd-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const title = document.getElementById("add-Dvd-title").value.trim();
    const director = document.getElementById("add-Dvd-Director").value.trim();
    const genre = document.getElementById("add-Dvd-category").value.trim();
    const releaseDate = document.getElementById("add-dvd-date").value.trim();
    const quantity = document.getElementById("add-Dvd-Quantity").value.trim();

    // Create a DVD object
    const dvdData = {
      title: title,
      director: director,
      genre: genre,
      releaseDate: releaseDate,
      copiesAvailable: quantity
    };

    // Send the DVD data to the server
    fetch("http://localhost:5272/api/Manager/AddDVD", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(dvdData), // Convert the object to a JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add DVD");
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        alert(`Success! New Movie "${data.title}" has been added to your inventory! 🎉`);
        document.getElementById("add-Dvd-form").reset(); // Reset the form
        displayDvd(); // Call your function to refresh the displayed DVDs
      })
      .catch((error) => console.error("Error adding DVD:", error));
  });
});





// customer show

function customershow() {
  document.getElementById("customerdcontainer").style.display = "block";
  document.getElementById("dashboardcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "none";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "none";
  document.getElementById("display").style.display = "none";
  document.getElementById("reportcontainer").style.display = "none";
}

async function displayCustomers() {
  try {
    const customerResponse = await fetch('http://localhost:5272/api/Customer/Get All Customers');
    const customers = await customerResponse.json();

    console.log("Dvd Customers: ", customers);


    const customerTable = document.getElementById('customer-body');
    customerTable.innerHTML = '';

    customers.forEach(async (customer) => {
      const row = document.createElement('tr');

      // const rentalResponse = await fetch(`http://localhost:5000/api/Customer/rentals/customer/${customer.id}`);
      // const customerRentals = await rentalResponse.json();

      // let rentalHistory = '<ul>';
      // customerRentals.forEach(rental => {
      //   rentalHistory += `<li>Reg: ${rental.motordvdID}, Date: ${rental.rentalDate}</li>`;
      // });
      // rentalHistory += '</ul>';

      row.innerHTML = `
              <td>${customer.userName}</td>
              <td>${customer.nic}</td>
              <td>${customer.email}</td>
              <td>${customer.mobilenumber}</td>
          `;
      customerTable.appendChild(row);
    });

    if (customers.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="6">No customers found.</td>';
      customerTable.appendChild(row);
    }
  } catch (error) {
    console.error('Error fetching customer or rental data:', error);
    const customerTable = document.getElementById('customer-body');
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="6">Error fetching customer or rental data.</td>';
    customerTable.appendChild(row);
  }
}

displayCustomers();









// rental show function
function rentalshow() {
  document.getElementById("dashboardcontainer").style.display = "none";
  document.getElementById("customerdcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "block";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "none";
}

function returnshow() {
  document.getElementById("customerdcontainer").style.display = "none";
  document.getElementById("dashboardcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "none";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "block";
  document.getElementById("display").style.display = "none";
  document.getElementById("reportcontainer").style.display = "none";
}

// function overdueshow() {
//   fetch('http://localhost:5000/api/Customer/CheckAndUpdateOverdueRentals')
//   .then(response => response.json())
//   .then(customers => {

//     const now = new Date();
//     const overdueList = document.getElementById('overdue-list');
//     overdueList.innerHTML = '';

//     customers.forEach(customer => {
//       customer.rentalHistory.forEach(rental => {
//         const returnDate = new Date(rental.returnDate);
//         if (!rental.returnProcessed && returnDate < now) {
//           const row = document.createElement('tr');
//           row.innerHTML = `
//                       <td>${customer.nic}</td>
//                       <td>${customer.username}</td>
//                       <td>${rental.regNumber}</td>
//                       <td>${new Date(rental.rentalDate).toLocaleString()}</td>
//                       <td>${returnDate.toLocaleString()}</td>
//                       <td>${((now - returnDate) / (1000 * 60 * 60)).toFixed(2)} hours</td>
//                   `;
//           overdueList.appendChild(row);
//         }
//       });
//     });

//     if (overdueList.innerHTML === '') {
//       overdueList.innerHTML = 'No overdue rentals found';
//     }
//   })
//   .catch(error => console.error('Error fetching data:', error));
//   // Show the overdue section and hide other sections
//   document.getElementById("dashboardcontainer").style.display = "none";
//   document.getElementById("customerdcontainer").style.display = "none";
//   document.getElementById("rentaldcontainer").style.display = "none";
//   document.getElementById("overduedcontainer").style.display = "block";
//   document.getElementById("returncontainer").style.display = "none";
//   document.getElementById("display").style.display = "none";
//   document.getElementById("reportcontainer").style.display = "none";
// };


//overdueshow();

// Function to load pending rental requests from localStorage
function loadPendingRentals() {
  const keys = Object.keys(localStorage);
  const pendingRentals = keys.filter((key) => key.startsWith("rentItem"));
  let foundPendingRental = false;
  pendingRentals.forEach((keys) => {
    const rentalRequest = JSON.parse(localStorage.getItem(keys));
    // console.log(rentalRequest)

    rentalRequest.forEach((e) => {
      if (e.status === "pending") {
        displayRentalRequest(e);
        console.log("Displaying Rental Request:", e);
        foundPendingRental = true;
      }
    }); //in the rental of the all array should assign in the rental request
  });
  // Check if no rental requests were found and display a message
  const rentalBody = document.getElementById("rental-body");
  if (!foundPendingRental) {
    rentalBody.innerHTML =
      '<tr><td colspan="6">No rental requests found.</td></tr>'; // Update table body to show the message
  }
  // Show the rental section and hide other sections
  document.getElementById("dashboardcontainer").style.display = "none";
  document.getElementById("customerdcontainer").style.display = "none";
  document.getElementById("rentaldcontainer").style.display = "block";
  document.getElementById("overduedcontainer").style.display = "none";
  document.getElementById("returncontainer").style.display = "none";
  document.getElementById("reportcontainer").style.display = "none";
  document.getElementById("display").style.display = "none";
}
// Function to display each pending rental request in the manager's dashboard
function displayRentalRequest(rentalRequest) {
  console.log(rentalRequest);

  const rentalBody = document.getElementById("rental-body");

  rentalBody.innerHTML += `<tr>
        <td>${rentalRequest.NIC}</td>
        <td>${rentalRequest.user}</td>
        <td>${rentalRequest.title}</td>
        <td>${rentalRequest.status}</td>
        <td>${rentalRequest.rentdate}</td>
        <td> <button onclick="approveRental('${rentalRequest.dvdid}')">Approve</button>
        <button onclick="declineRental('${rentalRequest.dvdid}')">Decline</button></td>
        </tr>

    `;
}

async function acceptRental(rentalId) {
  try {
    const response = await fetch(`http://localhost:5000/api/Customer/Rental-Accept/${rentalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      displayRentals(); // Refresh the rentals table
    } else {
      console.error('Error accepting rental:', await response.text());
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Function to reject a rental request
async function rejectRental(rentalId) {


  try {
    const response = await fetch(`http://localhost:5000/api/Customer/RejectRental/${rentalId}`, {
      method: 'DELETE', // Assuming DELETE is used for rejection
    });

    if (response.ok) {

      displayRentals(); // Refresh the rentals table
    } else {
      console.error('Error rejecting rental:', await response.text());
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

function mainquantity(dvdid, quantity) {
  const Dvds = JSON.parse(localStorage.getItem("Dvds")) || [];

  // Find the DVD to update
  const dvdToUpdate = Dvds.find((dvd) => dvd.id === dvdid);

  if (dvdToUpdate) {
    dvdToUpdate.quantity -= quantity;

    // Ensure quantity doesn't go below zero
    if (dvdToUpdate.quantity < 0) {
      alert("Quantity cannot be negative");
      dvdToUpdate.quantity = 0; // Set to zero or handle it as you see fit
    }

    // Save the updated DVD list back to local storage
    localStorage.setItem("Dvds", JSON.stringify(Dvds));

    console.log(`Updated Dvds after renting:`, Dvds);
  } else {
    console.log("Could not find DVD in the list.");
  }
}

async function returnMotordvd() {
  const nic = document.getElementById('return-nic').value;
  const registrationNumber = document.getElementById('return-registration').value;

  try {
    // Fetch all customers, dvd, and rentals
    let [customersResponse, motordvdsResponse, rentalsResponse] = await Promise.all([
      fetch('http://localhost:5000/api/Customer/all'),
      fetch('http://localhost:5000/api/Manager/Alldvd'),
      fetch('http://localhost:5000/api/Customer/GetAllRentals')
    ]);

    const customers = await customersResponse.json();
    const dvds = await dvdsResponse.json();
    const rentals = await rentalsResponse.json();
    console.log(dvds);
    console.log(customers);

    // Find the customer by NIC
    const customer = customers.find(c => c.nic == nic);
    console.log(rentals);


    if (!customer) {
      alert('Customer not found');
      return;
    }

    // Find the  by registration number
    const dvd = dvds.find(b => b.regnumber == registrationNumber);
    if (!dvd) {
      alert('dvd not found');
      return;
    }

    // Find the rental associated with the customer and dvd
    const rental = rentals.find(r => r.customerID === customer.id && r.dvdid === dvd.id);



    if (!rental) {
      alert('Rental record not found or already processed');
      return;
    }

    const returndvdResponse = await fetch(`http://localhost:5000/api/customer/dvd-return/${rental.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!returndvdResponse.ok) {
      alert('Failed to process dvd return');
      return;
    }

    alert('dvd returned successfully!');
    document.getElementById('return-dvd-form').reset();

  } catch (error) {
    console.error('Error during dvd return:', error);
    alert('An error occurred while processing the return.');
  }
}

function returnQuantity(dvdid, quantity) {
  const Dvds = JSON.parse(localStorage.getItem("Dvds")) || [];

  console.log("DVD ID to return:", dvdid);
  console.log("Current DVDs in local storage:", Dvds);

  // Find the DVD to update
  const dvdToUpdate = Dvds.find((dvd) => dvd.id === dvdid);
  console.log("assign dvd:", dvdToUpdate)

  if (dvdToUpdate) {
    dvdToUpdate.quantity += quantity; // Increase quantity for returns

    // Save the updated DVD list back to local storage
    localStorage.setItem("Dvds", JSON.stringify(Dvds));

    console.log(`Updated Dvds after returning:`, Dvds);

    // Check if localStorage was updated correctly
    const updatedDvds = JSON.parse(localStorage.getItem("Dvds"));
    console.log("DVDs from localStorage after update:", updatedDvds);
  } else {
    console.log("Could not find DVD in the list.");
  }
}


// Function to generate the rental report
async function displayRentals() {
  try {
    const rentalResponse = await fetch('http://localhost:5000/api/Customer/GetAllRentals');
    const rentals = await rentalResponse.json();
    //   console.log(rentals);

    const customerResponse = await fetch('http://localhost:5000/api/Customer/all');
    const customers = await customerResponse.json();
    // console.log(customers);

    const dvdResponse = await fetch('http://localhost:5000/api/Manager/Alldvd');
    const dvds = await dvdResponse.json();
    // console.log(dvds);

    const rentalTable = document.getElementById('rental-body');
    rentalTable.innerHTML = '';

    rentals.forEach((rental) => {


      const customer = customers.find(c => c.id === rental.customerID) || { firstName: 'Unknown', nic: 'Unknown', mobilenumber: 'Unknown' };
      const dvd = dvds.find(b => b.id === rental.motordvdID) || { regNumber: 'Unknown' };

      const row = document.createElement('tr');
      row.innerHTML = `
              <td>${customer.nic}</td>
              <td>${customer.firstName}</td>
              <td>${customer.mobilenumber}</td>
              <td>${dvd.regnumber}</td>
              <td>${rental.rentalDate}</td>
              <td>${rental.status}</td>
              <td>
                  <button class="btn btn-success btn-sm" onclick="acceptRental('${rental.id}')">Accept</button>
                  <button class="btn btn-danger btn-sm" onclick="rejectRental('${rental.id}')">Reject</button>
              </td>
          `;
      rentalTable.appendChild(row);
    });

    if (rentals.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="7">No rentals found.</td>';
      rentalTable.appendChild(row);
    }
  } catch (error) {
    console.error('Error fetching rentals:', error);
    const rentalTable = document.getElementById('rental-body');
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="7">Error fetching rentals.</td>';
    rentalTable.appendChild(row);
  }
}

// Function to generate the return report
function displayReturnReport() {
  const rentals = JSON.parse(localStorage.getItem("rentItem")) || [];
  const returnReportBody = document.getElementById("returnReportBody");
  returnReportBody.innerHTML = ""; // Clear previous entries

  rentals.forEach((rental) => {
    if (rental.status === "Returned") {
      const rentalDate = new Date(rental.rentdate);
      const returnDate = new Date(rental.returnDate);
      const actualReturnDate = new Date(rental.actualReturnDate);

      returnReportBody.innerHTML += `
        <tr>
          <td>${rental.rentalid}</td>
          <td>${rental.user} (${rental.NIC})</td>
          <td>${rental.title}</td>
          <td>${rentalDate.toLocaleDateString()}</td>
          <td>${returnDate.toLocaleDateString()}</td>
          <td>${actualReturnDate.toLocaleDateString()}</td>
          <td>${rental.status}</td>
        </tr>
      `;
    }
  });

  // Hide rental report and show return report
  document.getElementById("returnReport").style.display = "block";
  document.getElementById("rentalReport").style.display = "none";
}

// Event listeners for buttons
// document.getElementById("rentalReportBtn").addEventListener("click", displayRentalReport);

document.getElementById("returnReportBtn").addEventListener("click", displayReturnReport);




function loadReportCounts() {
  const rentals = JSON.parse(localStorage.getItem("rentItem")) || [];

  // Initialize counters for different rental statuses
  let totalPending = 0;
  let totalApproved = 0;
  let totalDeclined = 0;
  let totalReturned = 0;
  let totalRentals = rentals.length; // Total rental count

  // Loop through the rental items and count each status
  rentals.forEach(rental => {
    if (rental.status === "Pending") {
      totalPending++;
    } else if (rental.status === "Approved") {
      totalApproved++;
    } else if (rental.status === "Declined") {
      totalDeclined++;
    } else if (rental.status === "Returned") {
      totalReturned++;
    }
  });

  // Display the counts in the respective HTML elements
  document.getElementById("pendingCount").innerHTML = `Total Pending Rentals: ${totalPending}`;
  document.getElementById("approvedCount").innerHTML = `Total Approved Rentals: ${totalApproved}`;
  document.getElementById("declinedCount").innerHTML = `Total Declined Rentals: ${totalDeclined}`;
  document.getElementById("returnCount").innerHTML = `Total Returns: ${totalReturned}`;
  document.getElementById("totalRentalCount").innerHTML = `Total Rentals: ${totalRentals}`; // Display total rental count
}
