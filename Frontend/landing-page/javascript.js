document.addEventListener('DOMContentLoaded', function () {
    const rentContainer = document.getElementById('rent-container');


    const Dvds = JSON.parse(localStorage.getItem('Dvds')) || [];

    function createDvdCard(Dvd) {
        const Dvdcard = document.createElement('div');
        Dvdcard.classList.add('rent-box');

        Dvdcard.innerHTML = `
        <div class="card">
            <img src="${Dvd.image}" alt="${Dvd.title}">
            <div class="card-content">
                <h2>Name: ${Dvd.title}</h2>
                <p>Genre: ${Dvd.category} <br> Release date:${Dvd.Date} <br> Director:${Dvd.Director}<br> Quantity:${Dvd.quantity}</p>                  
                <a href="../login.html"><button class="request-btn">Request</button> </a>
            </div>
        </div>
        `;

        return Dvdcard;
    }

    function displayDvd() {
        Dvds.forEach(Dvd => {
            const dvdCard = createDvdCard(Dvd);
            rentContainer.appendChild(dvdCard);
        });
    }

    displayDvd();
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





