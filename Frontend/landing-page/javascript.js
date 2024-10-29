document.addEventListener('DOMContentLoaded', function () {
  function showdvd() {
    fetch("http://localhost:5272/api/Manager/Get All DVDs")
    .then((response) => response.json())
    .then((Dvds) => {
      console.log("Array Of The Dvd: ", Dvds);
      const rentContainer = document.getElementById('rent-container')
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
            <button class="rent-button" onclick="gologin()">Rent</button>
          </div>
        `;
  
        rentContainer.appendChild(dvdCard); // Append the card to the container
      });
    })
    .catch((error) => {
      console.error("Error fetching DVDs:", error);
    });
// // Call the showdvd function when the window loads
  }

    // Call the showdvd function when the DOM is fully loaded
    showdvd();
  
});
// Function to navigate to the login page
function gologin() {
  window.location.href = "../login.html"; // Replace with the actual path to the login page
}
// document.getElementById('reviews').addEventListener('click', loadReviewsFromLocalStorage);
// var reviewsContainer = document.querySelector(".reviews-container");

// function loadReviewsFromLocalStorage() {
//     // Retrieve reviews from local storage
//     let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

//     // Render each review
//     reviews.forEach(review => {
//         const newReview = document.createElement('div');
//         newReview.className = 'box';
//         newReview.innerHTML = `
//             <div class="rev-img">
//                 <img src="../img/avatar.png" alt="User Avatar">
//             </div>
//             <h1>${review.name}</h1>
//             <div class="stars">
//                 ${'&#9733;'.repeat(review.rating)} ${review.rating < 5 ? '&#9734;'.repeat(5 - review.rating) : ''}
//             </div>
//             <p>${review.review}</p>
//         `;
//         reviewsContainer.appendChild(newReview);
//     });
// }

// // Load reviews when page is loaded
// loadReviewsFromLocalStorage();





