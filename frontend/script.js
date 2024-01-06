const MY_Server = "http://127.0.0.1:8000";

// Function to check if the user is authenticated
function checkAuthentication() {
    axios.get(`${MY_Server}/api/check-auth`, { withCredentials: true })
        .then(response => {
            if (response.data.authenticated) {
                // User is authenticated, continue with the page
                console.log('User is authenticated');
                // Additional functionality can be added here based on authentication
                fetchAnimals(); // Fetch animals when the user is authenticated
            }
        })
        .catch(error => {
            window.location.href = './login.html';  // Redirect to the login page
            console.log('User is not authenticated. Redirecting to login.');
            console.error('Error:', error);
        });
}
// Function to toggle the display of the "Add New Animal" form
function toggleAnimalForm() {
    const animalForm = document.getElementById('animal-form');
    const toggleButton = document.getElementById('toggle-form-button');

    // Toggle the display property of the animal form
    if (animalForm.style.display === 'none' || animalForm.style.display === '') {
        animalForm.style.display = 'block';
        toggleButton.textContent = 'Hide Form';
    } else {
        animalForm.style.display = 'none';
        toggleButton.textContent = 'Add New Animal';
    }
}
// Function to fetch animals
function fetchAnimals() {
    axios.get(`${MY_Server}/api/animals`)
        .then(response => {
            const animalsTable = document.getElementById('animals-table');
            animalsTable.innerHTML = ''; // Clear existing content

            response.data.animals.forEach(animal => {
                const animalRow = document.createElement('tr');
                animalRow.innerHTML = `<td>${animal.id}</td>
                                      <td>${animal.name}</td>
                                      <td>${animal.species}</td>
                                      <td>${animal.average_age}</td>
                                      <td>
                                          <button onclick="showEditForm(${animal.id})">Edit</button>
                                          <button onclick="deleteAnimal(${animal.id})">Delete</button>
                                      </td>`;
                animalsTable.appendChild(animalRow);
            });
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
        });
}


// Function to create a new animal
function createAnimal() {
    const nameInput = document.getElementById('name');
    const speciesInput = document.getElementById('species');
    const averageAgeInput = document.getElementById('average_age');

    const newAnimal = {
        name: nameInput.value,
        species: speciesInput.value,
        average_age: averageAgeInput.value
    };

    axios.post(`${MY_Server}/api/animals`, newAnimal)
        .then(response => {
            console.log('Animal created successfully');
            // Fetch updated animal list after creating a new animal
            fetchAnimals();
        })
        .catch(error => {
            console.error('Error creating animal:', error);
        });
}

// Function to show/hide the edit form and populate it with animal data
function showEditForm(animalId) {
    const editForm = document.getElementById('edit-animal-container');

    // Toggle the display property of the edit form
    if (editForm.style.display === 'none' || editForm.style.display === '') {
        // Fetch animal data based on the ID (you need to implement this endpoint on the server)
        axios.get(`${MY_Server}/api/animals/${animalId}`, { withCredentials: true })
            .then(response => {
                const animal = response.data.animal;
                editForm.style.display = 'block';

                // Populate form fields with animal data
                document.getElementById('edit-animal-id').value = animal.id;
                document.getElementById('edit-animal-name').value = animal.name;
                document.getElementById('edit-animal-species').value = animal.species;
                document.getElementById('edit-animal-average_age').value = animal.average_age;
            })
            .catch(error => {
                console.error(`Error fetching animal with ID ${animalId}:`, error);
            });
    } else {
        // Hide the edit form
        editForm.style.display = 'none';
    }
}


// Function to update an animal
function updateAnimal() {
    const form = document.getElementById('edit-animal-form');
    const formData = new FormData(form);

    // Convert FormData to a plain object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Send data as JSON
    axios.put(`${MY_Server}/api/animals/${formObject.id}`, formObject, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // Handle successful update
            console.log('Animal updated successfully');
            // Fetch animals again to update the table
            fetchAnimals();
            // Hide the edit form
            document.getElementById('edit-animal-form').style.display = 'none';
        })
        .catch(error => {
            // Handle update failure
            console.error('Animal update failed:', error.response.data);
            // You can display an error message to the user or perform other actions here
        });
}

// Function to handle deleting an animal
function deleteAnimal(animalId) {
    const confirmDelete = confirm('Are you sure you want to delete this animal?');

    if (confirmDelete) {
        axios.delete(`${MY_Server}/api/animals/${animalId}`, { withCredentials: true })
            .then(response => {
                // Handle successful deletion
                console.log('Animal deletion successful');
                // Refresh the animal list after deletion
                fetchAnimals();
            })
            .catch(error => {
                console.error('Animal deletion failed:', error.response.data);
                // You can display an error message to the user or perform other actions here
            });
    } else {
        console.log('Deletion canceled.');
    }
}

// Function to submit the login form
function submitLoginForm(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const form = document.getElementById('loginForm');
    const formData = new FormData(form);

    // Convert FormData to a plain object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Send data as JSON
    axios.post(`${MY_Server}/api/login`, formObject, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // Handle successful login
            console.log('Login successful');
            // Redirect to the home page after successful login
            window.location.href = './index.html';
        })
        .catch(error => {
            // Handle login failure
            console.error('Login failed:', error.response.data);

            // Display error message above the login form
            const errorMessageContainer = document.getElementById('errorMessage');
            errorMessageContainer.textContent = error.response.data.error;

            // You can clear the error message after a certain duration if needed
            setTimeout(() => {
                errorMessageContainer.textContent = '';
            }, 5000); // Clear error message after 5 seconds (adjust as needed)
        });
}

// Function to submit the signup form
function submitSignupForm(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const form = document.querySelector('.loginBxR form'); // Select the form by its class
    const formData = new FormData(form);

    // Convert FormData to a plain object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Send data as JSON
    axios.post(`${MY_Server}/api/signup`, formObject, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // Handle successful signup
            console.log('Signup successful');
            // Redirect to the login page after successful signup
            window.location.href = './login.html';
        })
        .catch(error => {
            // Handle signup failure
            console.error('Signup failed:', error.response.data);

            // Display error message above the signup form
            const errorMessageContainer = document.getElementById('errorMessage');
            errorMessageContainer.textContent = error.response.data.error;

            // You can clear the error message after a certain duration if needed
            setTimeout(() => {
                errorMessageContainer.textContent = '';
            }, 5000); // Clear error message after 5 seconds (adjust as needed)
        });
}

// Function to handle logout
function logout() {
    axios.get(`${MY_Server}/api/logout`, { withCredentials: true })
        .then(response => {
            // Handle successful logout
            console.log('Logout successful');
            // Redirect to the login page after successful logout
            window.location.href = './login.html';
        })
        .catch(error => {
            // Handle logout failure
            console.error('Logout failed:', error.response.data);
            // You can display an error message to the user or perform other actions here
        });
}

// Add event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.querySelector('.logout-link a');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.querySelector('.loginBxR form');

    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the link from navigating
            logout();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', submitLoginForm);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', submitSignupForm);
    }

    // Check authentication only when the page is index.html
    if (window.location.pathname === '/frontend/index.html') {
        checkAuthentication();
        fetchAnimals();
    }
});

