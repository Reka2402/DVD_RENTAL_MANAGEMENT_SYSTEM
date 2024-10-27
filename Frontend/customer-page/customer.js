function showdvd() {
  const rentContainer = document.getElementById("rent-container");



  // async function fetchdvd() {
  //   try{
  //     const response = await fetch('http://localhost:5272/api/Manager/Get All DVDs');
  //     Dvds = await response.json();
  //     displayDvd();
  //   }catch(error){
  //     console.error('error fetching dvd',error)
  //   }
  // }

  // function createDvdCard(Dvd) {
  //   const Dvdcard = document.createElement("div");
  //   Dvdcard.classList.add("rent-box");
  //   Dvdcard.innerHTML = `      <div class="card" id=${Dvd.id}>
  //           <img src="${Dvd.image}" alt="${Dvd.title}" class="item-image">
  //           <div class="card-content">
  //               <h2 class="item-title">Movie Name: ${Dvd.title}</h2>
  //               <p class="item-description">Genre: ${Dvd.category} <br> Release date: ${Dvd.Date} <br> Director: ${Dvd.Director}</p>
  //               <label>Quantity:</label><br>
  //               <input type="number" class="item-quantity" value="${Dvd.quantity}" min="1" readonly>  <br>
  //               <button class="rent-button" onclick="toggleRentButton(this)">Rent</button>
            
  //           </div>
  //       </div>
  //   `;

  //   return Dvdcard;
  // }

  // async function displayDvd() {
  //   const  Dvds = await fetchdvd();
  //   console.log(Dvds)
  //   Dvds.forEach((Dvd) => {
  //     const dvdCard = createDvdCard(Dvd);
  //     rentContainer.appendChild(dvdCard);
  //   });
  // }






  fetch("http://localhost:5272/api/Manager/Get All DVDs", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((Dvds) => {
      console.log("Array Of The DVD: ", Dvds);
      const rentContainer = document.getElementById("rent-container");
      rentContainer.innerHTML = ""; // Clear existing content
  
      Dvds.forEach((Dvd) => {
        // Create a card for each DVD
        const dvdCard = document.createElement("div");
        dvdCard.classList.add("card");
        dvdCard.id = Dvd.id; // Set the ID for the card
  
        dvdCard.innerHTML = `
          <img src="${Dvd.image || 'default-image.jpg'}" alt="${Dvd.title}" class="item-image">
          <div class="card-content">
            <h2 class="item-title">Movie Name: ${Dvd.title}</h2>
            <p class="item-description">
              Genre: ${Dvd.genre} <br>
              Release Date: ${Dvd.releaseDate} <br>
              Director: ${Dvd.director}
            </p>
            <label>Quantity:</label><br>
            <input type="number" class="item-quantity" value="${Dvd.copiesAvailable}" min="1" readonly> <br>
            <button class="rent-button" onclick="toggleRentButton(this)">Rent</button>
          </div>
        `;
  
        rentContainer.appendChild(dvdCard); // Append the card to the container
      });
    })
    .catch((error) => {
      console.error("Error fetching DVDs:", error);
    });

  displayDvd();
}

window.location.onload = showdvd();



function toggleRentButton(buttonElement) {
  if (buttonElement.innerText === "Rent") {
    buttonElement.innerText = "Confirm Rent";
  } else if (buttonElement.innerText === "Confirm Rent") {
    storeItemDetails(buttonElement); 
    buttonElement.innerText = "Rent";
  }
}

function storeItemDetails(buttonElement) {
  try {
      var card = buttonElement.closest(".card");

      if (!card) {
          console.error("Card not found!");
          return;
      }

      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      if (!currentUser) {
          alert("Please log in to rent a DVD.");
          return;
      }

      var dvdId = card.id; // Ensure this is a valid GUID
      console.log("Fetching DVD with ID:", dvdId); // Log the DVD ID being fetched

      // Fetch DVD details by ID
      fetch(`http://localhost:5272/api/DVD/GetDVDById/FA91C2C3-F53D-40A1-B52D-810DE6F81045`)
          .then((response) => {
              // Log the status and any other info
              console.log("Response status:", response.status);
              console.log("Response headers:", response.headers);

              if (!response.ok) {
                  if (response.status === 404) {
                      throw new Error("DVD not found");
                  } else {
                      throw new Error("Error fetching DVD");
                  }
              }
              return response.json();
          })
          .then((dvd) => {
              console.log("Fetched DVD:", dvd); // Log the fetched DVD

              // Check DVD availability
              if (dvd.copiesAvailable === 0) {
                  alert("Sorry, this DVD is out of stock.");
                  return;
              }

              // Example rental confirmation logic
              if (buttonElement.textContent === "Confirm Rent") {
                  const rentalDetails = {
                      rentalId: Math.floor(Math.random() * 1000), // Example rental ID
                      dvdId: dvd.id,
                      title: dvd.title,
                      user: currentUser.username,
                      NIC: currentUser.nic,
                      rentDate: new Date(),
                      status: "pending",
                      quantity: 1,
                      customerId: currentUser.id,
                  };

                  // POST rental data to the server
                  fetch("http://localhost:5272/api/Rental/AddRental", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify(rentalDetails),
                  })
                      .then((response) => {
                          if (!response.ok) {
                              throw new Error("Failed to create rental");
                          }
                          return response.json();
                      })
                      .then(() => {
                          alert(`Rental for "${dvd.title}" has been confirmed!`);
                          buttonElement.textContent = "Rent";
                      })
                      .catch((error) => {
                          console.error("Error creating rental:", error);
                      });
              }
          })
          .catch((error) => {
              console.error("Error fetching DVD:", error);
          });
  } catch (err) {
      console.error("An error occurred: " + err);
  }
}




function getAllCustomers() {
  fetch("/api/customers")
    .then((response) => response.json())
    .then((customers) => {
      const customerList = document.getElementById("customerList");
      customerList.innerHTML = ""; // Clear existing customers

      customers.forEach((customer) => {
        const customerItem = document.createElement("li");
        customerItem.innerText = `${customer.username} (${customer.email})`;
        customerList.appendChild(customerItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching customers:", error);
    });
}

document.addEventListener("DOMContentLoaded", getAllCustomers);

function getAllRentals() {
  fetch("/api/rentals")
    .then((response) => response.json())
    .then((rentals) => {
      const rentalList = document.getElementById("rentalList");
      rentalList.innerHTML = ""; // Clear existing rentals

      rentals.forEach((rental) => {
        const rentalItem = document.createElement("li");
        rentalItem.innerText = `Rental ID: ${rental.rentalId} | DVD: ${rental.title} | User: ${rental.user} | Status: ${rental.status}`;
        rentalList.appendChild(rentalItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching rentals:", error);
    });
}


document.addEventListener("DOMContentLoaded", getAllRentals);

document.getElementById("saveDetails").addEventListener("click", saveDetails);

function saveDetails() {
  let rentItem = JSON.parse(localStorage.getItem("rentItem"));

  alert(
    `You have rented ${rentItem.title} with quantity ${rentItem.quantity}. You must pick up the DVD within 24 hours, or your rental will be canceled.`
  );

  document.getElementById("rentpopup").style.display = "none";
}

window.onclick = function (event) {
  var modal = document.getElementById("rentpopup");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Function to close the modal
function closeModal() {
  document.getElementById("Profile").style.display = "none";
}

document.getElementById("userInfo").addEventListener("click", showProfile);

function showProfile() {
  const currentuser = JSON.parse(sessionStorage.getItem("currentUser"));

  if (currentuser) {
    document.getElementById("name").value = currentuser.username;
    document.getElementById("email").value = currentuser.email;
    document.getElementById("phone").value = currentuser.number;
    document.getElementById("nic").value = currentuser.nic;
  }

  document.getElementById("updateButton").addEventListener("click", enableEdit);
}

function enableEdit() {
  const form = document.getElementById("customerForm");
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    if (input.id !== "nic") {
      input.removeAttribute("readonly");
      input.style.backgroundColor = "#fff";
    }
  });

  document.getElementById("updateButton").innerText = "Save Details";
  document.getElementById("updateButton").onclick = saveDetails;
}

function saveDetails() {
  const customer = JSON.parse(localStorage.getItem("customers")) || [];

  const cus = customer.find(
    (c) => c.username === document.getElementById("name").value
  );

  cus.username = document.getElementById("name").value;
  cus.email = document.getElementById("email").value;
  cus.number = document.getElementById("phone").value;

  localStorage.setItem("customers", JSON.stringify(customer));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.setAttribute("readonly", "readonly");
    input.style.backgroundColor = "#e9ecef";
  });

  document.getElementById("updateButton").innerText = "Update Details";
  document.getElementById("updateButton").onclick = enableEdit;

  document.getElementById("msg").textContent =
    "Your profile has been updated successfully!";
}
