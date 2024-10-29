document.addEventListener('DOMContentLoaded', async function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');

    let users = [];

   // Fetch users from API
   async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:5272/api/Customer/Get All Customers');
        users = await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


            await Promise.all([fetchUsers()]);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        if (currentUser === 'customer') {
            window.location.href = '../customer-page/customer.html';
        }
    }

    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const user = users.find(u => u.userName == username && u.password === password);
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'customer-page/customer.html';
            } else {
                alert('Invalid UserName or Password');
            }
        });
    }



    if (registerForm) {
        registerForm.addEventListener('submit',async function (e) {
            e.preventDefault();
    
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const nic = document.getElementById('registerNIC').value.trim();
            const email = document.getElementById('registeremail').value.trim();
            const number = document.getElementById('registernumber').value.trim();
    
            // Ensure unique ID generation
            const id = Number(Math.floor(Math.random() * 1000));
    
            const userdata = {
                UserName:username,
                Password:password,
                Nic:nic,
                mobilenumber:number,
                Id:id,
                Email:email
            }
            console.log(users)
            // Validate that the username and NIC are unique
            if (users.some(user => user.userName === username && user.nic === nic)) {
                alert('Username already exists or NIC already exists. Please choose a different username.');
                return;
            }

            try{
                // send post request to add customer
                const responce = await fetch('http://localhost:5272/api/Customer/Add Customer',{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                        
                    },
                    body: JSON.stringify(userdata)
                    
                })
                if(responce.ok){
                    await fetchUsers()

                alert('Registration successful. Please login.');
             // Reset the form after successful registration
             registerForm.reset();

                }else{
                    const errorMessage = await responce.json();
                    alert(`Registration failed: ${errorMessage.message}`);
                }

            
            }catch (error) {
                console.error('Error registering user:', error);
                alert('Username already exists or NIC already exists. Please choose a different username.');
            }
  
        });
    }
    

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser');
            window.location.href = '../landing-page/greetingpage.html';
        });
    }

    // Display user info
    if (userInfo && currentUser) {
        userInfo.textContent = `${currentUser.userName}`;
    }


    // Customer functionality
    if (window.location.pathname.includes('../customer-page/customer.html')) {

    }
});


