document.addEventListener('DOMContentLoaded', function () {
  function showdvd() {
    const rentContainer = document.getElementById("rent-container");



  //   fetch("http://localhost:5272/api/Manager/Get All DVDs")
  //   .then((response) => response.json())
  //   .then((Dvds) => {
  //     console.log("Array Of The Dvd: ", Dvds)
  //     rentContainer.innerHTML = ""; // Clear existing rows

  //     Dvds.forEach((Dvd) => {
  //       const row = document.createElement("tr");
  //       row.innerHTML = `
  //             <td>${Dvd.title}</td>
  //             <td>${Dvd.director}</td>
  //             <td>${Dvd.releaseDate}</td>
  //             <td>${Dvd.genre}</td>
  //             <td>${Dvd.copiesAvailable}</td>
  //             <td colspan="2"><button class="editBtn" >Edit </button>
  //             <button class="delete-button">Delete</button></td>
  //         `;
  //         rentContainer.appendChild(row);
  //     });
  //   });
  // }

  // window.onload=showdvd()


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
  







































//     async function fetchdvd() {
//       try {
//           const response = await fetch('http://localhost:5272/api/Manager/GetAllDVDs', {
//               method: 'POST', // Change to POST if that's what the API expects
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               // body: JSON.stringify({}) // Add request body if necessary
//           });
//           console.log('Response status:', response.status); // Log the response status
//           if (!response.ok) {
//               throw new Error('Network response was not ok: ' + response.statusText);
//           }
//           const Dvds = await response.json();
//           console.log('Fetched DVDs:', Dvds);
//           return Dvds;
//       } catch (error) {
//           console.error('Error fetching DVDs:', error);
//           return null; // Return null in case of an error
//       }
//   }
  
  

//     function createDvdCard(Dvd) {
//         const Dvdcard = document.createElement("div");
//         Dvdcard.innerHTML = `
//             <div class="card" id="${Dvd.id}">
//                 <img src="${Dvd.image || 'default-image.jpg'}" alt="${Dvd.title}" class="item-image">
//                 <div class="card-content">
//                     <h2 class="item-title">Movie Name: ${Dvd.title}</h2>
//                     <p class="item-description">Genre: ${Dvd.genre} <br> Release Date: ${Dvd.releaseDate} <br> Director: ${Dvd.director}</p>
//                     <label>Quantity:</label><br>
//                     <input type="number" class="item-quantity" value="${Dvd.copiesAvailable}" min="1" readonly> <br>
//                     <button class="rent-button" onclick="toggleRentButton(this)">Rent</button>
//                 </div>
//             </div>
//         `;
//         return Dvdcard;
//     }

//     async function displayDvd() {
//       rentContainer.innerHTML = ''; // Clear previous content
//       const Dvds = await fetchdvd(); // Fetch DVDs
//         console.log(Dvds)
//       if (Dvds && Array.isArray(Dvds)) {
//           Dvds.forEach((Dvd) => {
//               const dvdCard = createDvdCard(Dvd); // Create a card for each DVD
//               rentContainer.appendChild(dvdCard); // Append the card to the container
//           });
//       } else {
//           console.error('No DVDs to display or error fetching DVDs.');
//       }
//   }
  
  

//     displayDvd(); // Call the function to display DVDs
// }

// // Call the showdvd function when the window loads
  }
window.onload = showdvd;
  
  
});

document.getElementById('reviews').addEventListener('click', loadReviewsFromLocalStorage);
var reviewsContainer = document.querySelector(".reviews-container");

function loadReviewsFromLocalStorage() {
    // Retrieve reviews from local storage
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    // Render each review
    reviews.forEach(review => {
        const newReview = document.createElement('div');
        newReview.className = 'box';
        newReview.innerHTML = `
            <div class="rev-img">
                <img src="../img/avatar.png" alt="User Avatar">
            </div>
            <h1>${review.name}</h1>
            <div class="stars">
                ${'&#9733;'.repeat(review.rating)} ${review.rating < 5 ? '&#9734;'.repeat(5 - review.rating) : ''}
            </div>
            <p>${review.review}</p>
        `;
        reviewsContainer.appendChild(newReview);
    });
}

// Load reviews when page is loaded
loadReviewsFromLocalStorage();





