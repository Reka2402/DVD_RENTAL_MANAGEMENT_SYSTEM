document.addEventListener('DOMContentLoaded', function () {
    function showdvd() {
        const rentContainer = document.getElementById("rent-container");
      
      
      
        async function fetchdvd() {
          try{
            const response = await fetch('https://api.example.com/dvd');
            Dvds = await response.json();
            displayDvd();
          }catch(error){
            console.error('error fetching dvd',error)
          }
        }
      
        function createDvdCard(Dvd) {
          const Dvdcard = document.createElement("div");
          Dvdcard.classList.add("rent-box");
          Dvdcard.innerHTML = `      <div class="card" id=${Dvd.id}>
                  <img src="${Dvd.image}" alt="${Dvd.title}" class="item-image">
                  <div class="card-content">
                      <h2 class="item-title">Movie Name: ${Dvd.title}</h2>
                      <p class="item-description">Genre: ${Dvd.category} <br> Release date: ${Dvd.Date} <br> Director: ${Dvd.Director}</p>
                      <label>Quantity:</label><br>
                      <input type="number" class="item-quantity" value="${Dvd.quantity}" min="1" readonly>  <br>
                      <button class="rent-button" onclick="toggleRentButton(this)">Rent</button>
                  
                  </div>
              </div>
          `;
      
          return Dvdcard;
        }
      
        async function displayDvd() {
          const  Dvds = await fetchdvd();
          Dvds.forEach((Dvd) => {
            const dvdCard = createDvdCard(Dvd);
            rentContainer.appendChild(dvdCard);
          });
        }
      
        displayDvd();
      }
      
      window.location.onload = showdvd();
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





