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


function editDvd(id) {
  console.log(`Fetching DVD with ID: ${id}`);

  fetch(`http://localhost:5272/api/Manager/GetDVDById/${id}`)
    .then((response) => {
      if (!response.ok) {
        console.error("Response status:", response.status);
        throw new Error("Failed to fetch DVD details");
      }
      return response.json();
    })
    .then((dvdToEdit) => {
      // Populate the edit form with existing DVD data
      document.getElementById("edit-Dvd-title").value = dvdToEdit.title;
      document.getElementById("edit-Dvd-Director").value = dvdToEdit.director;
      document.getElementById("edit-Dvd-category").value = dvdToEdit.genre; // Ensure the property matches
      document.getElementById("edit-dvd-date").value = new Date(dvdToEdit.releaseDate).toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      document.getElementById("edit-Dvd-Quantity").value = dvdToEdit.copiesAvailable;
      // document.getElementById("add-Dvd-Image").files = dvdToEdit.imageUrl
      // Show the edit form
      document.getElementById("edit-Dvd-container").style.display = "block";
      document.getElementById("dashboardcontainer").style.display = "none";

      const editForm = document.getElementById("edit-Dvd-form");
      editForm.onsubmit = function (event) {
        event.preventDefault();
        updateDvd(id); // Pass the ID to updateDvd
      };
    })
    .catch((error) => console.error("Error fetching DVD details:", error));
}

function updateDvd(id) {
  const updatedDvd = {
    title: document.getElementById("edit-Dvd-title").value.trim(),
    director: document.getElementById("edit-Dvd-Director").value.trim(),
    genre: document.getElementById("edit-Dvd-category").value.trim(),
    releaseDate: document.getElementById("edit-dvd-date").value.trim(),
    copiesAvailable: document.getElementById("edit-Dvd-Quantity").value.trim(),
    imageUrl: document.getElementById("edit-Dvd-Image")

  };

  // Get the image input element
  const imageInput = document.getElementById("edit-Dvd-Image");
  let hasNewImage = imageInput && imageInput.files.length > 0;

  // Use FormData if there is a new image
  if (hasNewImage) {
    const formData = new FormData();

    // Append updated DVD fields to FormData
    for (const key in updatedDvd) {
      formData.append(key, updatedDvd[key]);
    }

    // Append the new image file
    formData.append("ImageFile", imageInput.files[0]); // Use the first file only

    // Send the FormData to the server
    fetch(`http://localhost:5272/api/Manager/UpdateDVDById/${id}`, {
      method: "PUT",
      body: formData, // Send FormData instead of JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update DVD");
        }
        return response.json();
      })
      .then((data) => {
        alert(`DVD "${data.title}" updated successfully!`);
        displayDvd(); // Refresh the list
        document.getElementById("edit-Dvd-form").reset(); // Reset the form
        document.getElementById("edit-Dvd-container").style.display = "none"; // Hide the form
      })
      .catch((error) => console.error("Error updating DVD:", error));
  } else {
    // If no new image is provided, send the updated fields as JSON
    fetch(`http://localhost:5272/api/Manager/UpdateDVDById/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDvd),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update DVD");
        }
        return response.json();
      })
      .then((data) => {
        alert(`DVD "${data.title}" updated successfully!`);
        displayDvd(); // Refresh the list
        document.getElementById("edit-Dvd-form").reset(); // Reset the form
        document.getElementById("edit-Dvd-container").style.display = "none"; // Hide the form
      })
      .catch((error) => console.error("Error updating DVD:", error));
  }
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
          console.log(Dvd.id)
          const imageUrls = Dvd.imageUrl.split(',');
          let imagesHtml = '';
          imageUrls.forEach(url => {
            const fullUrl = `http://localhost:5272${url}`.trim();
            console.log(fullUrl);
            // Ensure proper URL with no spaces
            imagesHtml += `<img src="${fullUrl}" alt="${Dvd.title}" style="max-width: 100px; margin-right: 10px;" />`;
          });
          row.innerHTML = `<td>${imagesHtml}</td>
                <td>${Dvd.title}</td>
                <td>${Dvd.director}</td>
                <td>${Dvd.releaseDate}</td>
                <td>${Dvd.genre}</td>
                <td>${Dvd.copiesAvailable}</td>
                <td colspan="2"><button class="editBtn" data-id="${Dvd.id}">Edit </button>
                <button class="delete-button" data-id="${Dvd.id}">Delete</button></td>
            `;
          DvdsTableBody.appendChild(row);
        });

        // Add event listeners for edit buttons
        document.querySelectorAll(".editBtn").forEach((button) => {
          button.addEventListener("click", function () {
            const index = this.getAttribute("data-id");
            editDvd(index);
          });
        });

        // Add event listeners for delete buttons
        document.querySelectorAll(".delete-button").forEach((button) => {
          button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            deleteDvd(id);
          });
        });
      })
  
  }

 // Delete Dvd by Id 
 
  function deleteDvd(id) {
    fetch(`http://localhost:5272/api/Manager/${id}`, {
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


  //Add Dvd from form submit function

document.getElementById("add-Dvd-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Gather form data
  const title = document.getElementById("add-Dvd-title").value.trim();
  const director = document.getElementById("add-Dvd-Director").value.trim();
  const genre = document.getElementById("add-Dvd-category").value.trim();
  const releaseDate = document.getElementById("add-dvd-date").value.trim();
  const quantity = document.getElementById("add-Dvd-Quantity").value.trim();
  const imageInput = document.getElementById("add-Dvd-image").files;

  // Check for required fields
  if (!title || !director || !genre || !releaseDate || !quantity) {
    alert('All fields are required.');
    return;
  }

  // Create FormData object
  const formData = new FormData();
  formData.append("title", title);
  formData.append("director", director);
  formData.append("genre", genre);
  formData.append("releasedate", releaseDate);
  formData.append("copiesavailable", quantity);

  // Check if an image file is selected
  if (imageInput.length > 0) {
    formData.append("imagefile", imageInput[0]);
  } else {
    alert('Please upload an image.');
    return;
  }

  try {
    const response = await fetch("http://localhost:5272/api/Manager/Adddvd?${formData}", {
      method: "POST",
      body: formData, // Send the FormData object
    });

    



      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        alert(`Success! New Movie "${data.title}" has been added to your inventory! 🎉`);
        document.getElementById("add-Dvd-form").reset(); // Reset the form
        displayDvd(); // Call your function to refresh the displayed DVDs
      } else {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
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

// // Function to load pending rental requests from localStorage
// function loadPendingRentals() {
//   const keys = Object.keys(localStorage);
//   const pendingRentals = keys.filter((key) => key.startsWith("rentItem"));
//   let foundPendingRental = false;
//   pendingRentals.forEach((keys) => {
//     const rentalRequest = JSON.parse(localStorage.getItem(keys));
//     // console.log(rentalRequest)

//     rentalRequest.forEach((e) => {
//       if (e.status === "pending") {
//         displayRentalRequest(e);
//         console.log("Displaying Rental Request:", e);
//         foundPendingRental = true;
//       }
//     }); //in the rental of the all array should assign in the rental request
//   });
//   // Check if no rental requests were found and display a message
//   const rentalBody = document.getElementById("rental-body");
//   if (!foundPendingRental) {
//     rentalBody.innerHTML =
//       '<tr><td colspan="6">No rental requests found.</td></tr>'; // Update table body to show the message
//   }
//   // Show the rental section and hide other sections
//   document.getElementById("dashboardcontainer").style.display = "none";
//   document.getElementById("customerdcontainer").style.display = "none";
//   document.getElementById("rentaldcontainer").style.display = "block";
//   document.getElementById("overduedcontainer").style.display = "none";
//   document.getElementById("returncontainer").style.display = "none";
//   document.getElementById("reportcontainer").style.display = "none";
//   document.getElementById("display").style.display = "none";
// }
// // Function to display each pending rental request in the manager's dashboard
// function displayRentalRequest(rentalRequest) {
//   console.log(rentalRequest);

//   const rentalBody = document.getElementById("rental-body");

//   rentalBody.innerHTML += `<tr>
//         <td>${rentalRequest.NIC}</td>
//         <td>${rentalRequest.user}</td>
//         <td>${rentalRequest.title}</td>
//         <td>${rentalRequest.status}</td>
//         <td>${rentalRequest.rentdate}</td>
//         <td> <button onclick="approveRental('${rentalRequest.dvdid}')">Approve</button>
//         <button onclick="declineRental('${rentalRequest.dvdid}')">Decline</button></td>
//         </tr>

//     `;
// }
// Function to generate the rental report
async function displayRentals() {
  try {
    const rentalResponse = await fetch('http://localhost:5272/api/Rental/GetAllRentals');
    const rentals = await rentalResponse.json();
       console.log("All rental details: ",rentals);

    const customerResponse = await fetch('http://localhost:5272/api/Customer/Get All Customers');
    const customers = await customerResponse.json();
    console.log("All Customer Details: ",customers);

    const dvdResponse = await fetch('http://localhost:5272/api/Manager/Get All DVDs');
    const dvds = await dvdResponse.json();
     console.log("Get all Dvd:  ",dvds);
  // Show the rental section and hide other sections
      document.getElementById("dashboardcontainer").style.display = "none";
      document.getElementById("customerdcontainer").style.display = "none";
    document.getElementById("rentaldcontainer").style.display = "block"; 
      document.getElementById("overduedcontainer").style.display = "none";
      document.getElementById("returncontainer").style.display = "none";
      document.getElementById("reportcontainer").style.display = "none";
      document.getElementById("display").style.display = "none";


    const rentalTable = document.getElementById('rental-body');
    rentalTable.innerHTML = '';

    rentals.forEach((rental) => {


      const customer = customers.find(c => c.id === rental.customerID) || {};
      const dvd = dvds.find(b => b.id === rental.dvdId) || { title: 'rental.title' };

      if(rental.status === "Pending"){
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${customer.userName}</td>
                <td>${dvd.title}</td>
                <td>${rental.rentalDate}</td>
                <td>${rental.returndate}</td>
                <td>${rental.status}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="acceptRental('${rental.rentalId}')">Accept</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectRental('${rental.rentalId}')">Reject</button>
                </td>
            `;
        rentalTable.appendChild(row);
      }
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






async function acceptRental(rentalId) {
  try {
    const response = await fetch(`http://localhost:5272/api/Rental/Accept RentalById?id=${rentalId}`, {
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
    const response = await fetch(`http://localhost:5272/api/Rental/RejectRentalById?rentalid=${rentalId}`, {
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



// async function returndvd() {


//   const customerid = document.getElementById('return-customer').value; // Trim whitespace

//   try {
//     // Fetch all rentals for the specific customer
//     const rentalResponse = await fetch(`http://localhost:5272/api/Rental/GetAllRentalCustomers?customerId=${customerid}`);
//     const rentals = await rentalResponse.json();
//     console.log("Customer rental details: ", rentals);

//     // Check if any rentals were found
//     if (!Array.isArray(rentals) || rentals.length === 0) {
//       alert('No rentals found for this customer.');
//       return;
//     }

//     // Loop through each rental and process the return
//     for (const rental of rentals) {
//       console.log(rental.rentalId)
//       // Ensure rentalId is properly accessed based on your response structure
//       const returndvdResponse = await fetch(`http://localhost:5272/api/Rental/returnDVDById/${rental.rentalId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!returndvdResponse.ok) {
//         alert(`Failed to process return for rental ID: ${rental.rentalId}`);
//         continue; // Skip to the next rental
//       }

//       alert(`DVD with rental ID: ${rental.rentalId} returned successfully!`);
//     }

//     // Reset the form after processing
//     document.getElementById('return-dvd-form').reset();

//   } catch (error) {
//     console.error('Error during DVD return:', error);
//     alert('An error occurred while processing the return.');
//   }
// }


// function returnQuantity(dvdid, quantity) {
//   const Dvds = JSON.parse(localStorage.getItem("Dvds")) || [];

//   console.log("DVD ID to return:", dvdid);
//   console.log("Current DVDs in local storage:", Dvds);

//   // Find the DVD to update
//   const dvdToUpdate = Dvds.find((dvd) => dvd.id === dvdid);
//   console.log("assign dvd:", dvdToUpdate)

//   if (dvdToUpdate) {
//     dvdToUpdate.quantity -= quantity; // Increase quantity for returns

//     // Save the updated DVD list back to local storage
//     localStorage.setItem("Dvds", JSON.stringify(Dvds));

//     console.log(`Updated Dvds after returning:`, Dvds);

//     // Check if localStorage was updated correctly
//     const updatedDvds = JSON.parse(localStorage.getItem("Dvds"));
//     console.log("DVDs from localStorage after update:", updatedDvds);
//   } else {
//     console.log("Could not find DVD in the list.");
//   }
// }

async function returndvd() {
  const customerid = document.getElementById('return-customer').value.trim(); // Trim whitespace

  try {
    // Fetch all rentals for the specific customer
    const rentalResponse = await fetch(`http://localhost:5272/api/Rental/GetAllRentalCustomers?customerId=${customerid}`);
    
    if (!rentalResponse.ok) {
      alert('Failed to fetch rentals for this customer.');
      return;
    }

    const rentals = await rentalResponse.json();
    console.log("Customer rental details: ", rentals);

    // Check if any rentals were found
    if (!Array.isArray(rentals) || rentals.length === 0) {
      alert('No rentals found for this customer.');
      return;
    }

    // Loop through each rental and process the return
    for (const rental of rentals) {
      // Ensure rentalId is properly accessed based on your response structure
      const returndvdResponse = await fetch(`http://localhost:5272/api/Rental/returnDVDById/${rental.rentalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!returndvdResponse.ok) {
        console.log(`Failed to process return for rental ID: ${rental.rentalId}`);
        alert(`Failed to process return for rental ID: ${rental.rentalId}`);
        continue; // Skip to the next rental
      }

      console.log(`DVD with rental ID: ${rental.rentalId} returned successfully!`);
      alert(`DVD with rental ID: ${rental.rentalId} returned successfully!`);
    }

    // Reset the form after processing
    document.getElementById('return-dvd-form').reset();

  } catch (error) {
    console.error('Error during DVD return:', error);
    alert('An error occurred while processing the return.');
  }
}


// Function to generate the return report
async function displayReturnReport() {
  try {
    const rentalResponse = await fetch('http://localhost:5272/api/Rental/GetAllRentals');
    const rentals = await rentalResponse.json();
       console.log("All rental details: ",rentals);

       const customerResponse = await fetch('http://localhost:5272/api/Customer/Get All Customers');
       const customers = await customerResponse.json();
       console.log("All Customer Details: ",customers);


       
    const dvdResponse = await fetch('http://localhost:5272/api/Manager/Get All DVDs');
    const dvds = await dvdResponse.json();
     console.log("Get all Dvd:  ",dvds);
``   
      



  const returnReportBody = document.getElementById("returnReportBody");
  returnReportBody.innerHTML = ""; // Clear previous entries

  rentals.forEach((rental) => {

    const customer = customers.find(c => c.id === rental.customerID) || {};
      const dvd = dvds.find(b => b.id === rental.dvdId) || { title: 'rental.title' };


    if (rental.status === "Return") {
      returnReportBody.innerHTML += `
        <tr>
          <td>${customer.userName}</td>
          <td>${dvd.title}</td>
          <td>${rental.rentalDate})</td>
          <td>${rental.returndate}</td>
          <td>${rental.status}</td>
        </tr>
      `;
    }
  });
}catch(error){
  console.error('Error fetching rentals:', error);
  const returnReportBody = document.getElementById('returnReportBody');
  const row = document.createElement('tr');
  row.innerHTML = '<td colspan="7">Error fetching rentals reports.</td>';
  returnReportBody.appendChild(row);
}

  // Hide rental report and show return report
  document.getElementById("returnReport").style.display = "block";
  document.getElementById("rentalReport").style.display = "none";
}


async function displayrentalReport() {
  try {
    const rentalResponse = await fetch('http://localhost:5272/api/Rental/GetAllRentals');
    const rentals = await rentalResponse.json();
       console.log("All rental details: ",rentals);

       const customerResponse = await fetch('http://localhost:5272/api/Customer/Get All Customers');
       const customers = await customerResponse.json();
       console.log("All Customer Details: ",customers);


       
    const dvdResponse = await fetch('http://localhost:5272/api/Manager/Get All DVDs');
    const dvds = await dvdResponse.json();
     console.log("Get all Dvd:  ",dvds);
``   
      



  const rentalReportBody = document.getElementById("rentalReportBody");
  rentalReportBody.innerHTML = ""; // Clear previous entries

  rentals.forEach((rental) => {

    const customer = customers.find(c => c.id === rental.customerID) || {};
      const dvd = dvds.find(b => b.id === rental.dvdId) || {};


    if (rental.status === "Rent") {
      rentalReportBody.innerHTML += `
        <tr>
          <td>${customer.userName}</td>
          <td>${dvd.title}</td>
          <td>${rental.rentalDate})</td>
          <td>${rental.returndate}</td>
          <td>${rental.status}</td>
        </tr>
      `;
    }
  });
}catch(error){
  console.error('Error fetching rentals:', error);
  const rentalReportBody = document.getElementById('rentalReportBody');
  const row = document.createElement('tr');
  row.innerHTML = '<td colspan="7">Error fetching rentals reports.</td>';
  rentalReportBody.appendChild(row);
}

  // Hide rental report and show return report
  document.getElementById("returnReport").style.display = "none";
  document.getElementById("rentalReport").style.display = "block";
}


// Event listeners for buttons

//For rental report
document.getElementById("rentalReportBtn").addEventListener("click",  displayrentalReport);


//for return report 
document.getElementById("returnReportBtn").addEventListener("click", displayReturnReport);




async function loadReportCounts() {
  const rentalResponse = await fetch('http://localhost:5272/api/Rental/GetAllRentals');
  const rentals = await rentalResponse.json();
     console.log("All rental details: ",rentals);


  // Initialize counters for different rental statuses
  let totalPending = 0;
  let totalApproved = 0;
  let totalReturned = 0;
  let totalRentals = rentals.length; // Total rental count

  // Loop through the rental items and count each status
  rentals.forEach(rental => {
    if (rental.status === "Pending") {
      totalPending++;
    } else if (rental.status === "Rent") {
      totalApproved++;
    } 
     else if (rental.status === "Return") {
      totalReturned++;
    }
  });

  // Display the counts in the respective HTML elements
  document.getElementById("pendingCount").innerHTML = `Total Pending Rentals: ${totalPending}`;
  document.getElementById("approvedCount").innerHTML = `Total Approved Rentals: ${totalApproved}`;
  document.getElementById("returnCount").innerHTML = `Total Returns: ${totalReturned}`;
  document.getElementById("totalRentalCount").innerHTML = `Total Rentals: ${totalRentals}`; // Display total rental count
}
