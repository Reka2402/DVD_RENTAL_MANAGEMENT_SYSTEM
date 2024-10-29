function showdvd() {
  const rentContainer = document.getElementById("rent-container");
  fetch("http://localhost:5272/api/Manager/Get All DVDs")
  .then((response) => response.json())
  .then((Dvds) => {
    console.log("Array Of The Dvd: ", Dvds);
    rentContainer.innerHTML = ""; // Clear existing content

    Dvds.forEach((Dvd) => {
      // Create a card for each DVD
      const dvdCard = document.createElement("div");
      dvdCard.classList.add("card");
      dvdCard.id = Dvd.id; // Set the ID for the card
      console.log("card id :" ,Dvd.id)

      // Handle multiple images
      const imageUrls = Dvd.imageUrl.split(',');
      let imagesHtml = '';
      imageUrls.forEach(url => {
        const fullUrl = `http://localhost:5272${url.trim()}`; // Ensure the URL is trimmed
        imagesHtml += `<img src="${fullUrl}" alt="${Dvd.title}" class="item-image" style="max-width: 100px; margin-right: 10px;" />`;
      });

      // Set the inner HTML for the card
      dvdCard.innerHTML = `
        <div class="image-container">${imagesHtml || '<img src="default-image.jpg" alt="Default Image" class="item-image" />'}</div>
        <div class="card-content">
          <h2 class="item-title">Movie Name: ${Dvd.title}</h2>
          <p class="item-description">
            Genre: ${Dvd.genre} <br>
            Release Date: ${Dvd.releaseDate} <br>
            Director: ${Dvd.director}<br>
            Quantity:${Dvd.copiesAvailable}
          </p>
          <button class="rent-button" onclick="toggleRentButton(this)">Rent</button>
        </div>
      `;

      rentContainer.appendChild(dvdCard); // Append the card to the container
    });
  })
  .catch((error) => {
    console.error("Error fetching DVDs:", error);
  });


}

window.location.onload = showdvd();



function toggleRentButton(buttonElement) {
  if (buttonElement.innerText === "Rent") {
    buttonElement.innerText = "Confirm Rent";
  } else if (buttonElement.innerText === "Confirm Rent") {
    storeItemDetails(buttonElement);
    // buttonElement.innerText = "Rent";
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

    fetch(`http://localhost:5272/api/Manager/GetDVDById/${dvdId}`)
      .then((response) => {
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
        console.log("Fetched DVD:", dvd);
        console.log("DVD Copies Available:", dvd.copiesAvailable);

        if (dvd.copiesAvailable === 0) {
          alert("Sorry, this DVD is out of stock.");
          return;
        }
        var text = buttonElement.textContent
        //console.log(text);


        if (buttonElement.textContent == "Confirm Rent") {
          buttonElement.textContent = "Processing..."; // Change to indicate processing

          const rentalDetails = {
            customerID: currentUser.id,
            dvdId: dvd.id,
            rentalDate: new Date(),
            returnDate: new Date(new Date().setDate(new Date().getDate() + 7))
        };
        
          console.log("Rental Details:", rentalDetails);

          fetch("http://localhost:5272/api/Rental/Add Rental", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(rentalDetails),
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then(err => {
                  throw new Error(`Failed to create rental: ${err.message || 'Unknown error'}`);
                });
              }
              return response.json();
            })
            .then(() => {
              confirm(`Rental for "${dvd.title}" has been confirmed!`);
              buttonElement.textContent = "Rent";
            })
            .catch((error) => {
              console.error("Error creating rental:", error);
              alert(`Error: ${error.message}`);
              buttonElement.textContent = "Confirm Rent"; // Reset button text on error
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



















//document.getElementById("saveDetails").addEventListener("click", saveDetails);

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