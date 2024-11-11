
document.addEventListener('DOMContentLoaded', function () {

    const updateBtn = document.getElementById('update-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const nameDisplay = document.getElementById('name-display');
    const nameInput = document.getElementById('name-input');
    
    const birthdateDisplay = document.getElementById('birthdate-display');
    const birthdateInput = document.getElementById('birthdate-input');
    
    const genderDisplay = document.getElementById('gender-display');
    const genderInput = document.getElementById('gender-input');
    
    const emailDisplay = document.getElementById('email-display');
    const emailInput = document.getElementById('email-input');
    
    const passwordDisplay = document.getElementById('password-display');
    const passwordInput = document.getElementById('password-input');

    updateBtn.addEventListener('click', () => {
        nameDisplay.style.display = 'none';
        birthdateDisplay.style.display = 'none';
        genderDisplay.style.display = 'none';
        emailDisplay.style.display = 'none';
        passwordDisplay.style.display = 'none';

        nameInput.style.display = 'block';
        birthdateInput.style.display = 'block';
        genderInput.style.display = 'block';
        emailInput.style.display = 'block';
        passwordInput.style.display = 'block';

        updateBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        nameInput.style.display = 'none';
        birthdateInput.style.display = 'none';
        genderInput.style.display = 'none';
        emailInput.style.display = 'none';
        passwordInput.style.display = 'none';

        nameDisplay.style.display = 'block';
        birthdateDisplay.style.display = 'block';
        genderDisplay.style.display = 'block';
        emailDisplay.style.display = 'block';
        passwordDisplay.style.display = 'block';

        updateBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    });

    saveBtn.addEventListener('click', async () => {
        const nameValue = nameInput.value.trim();
        const birthdateValue = birthdateInput.value;
        const genderValue = genderInput.value;
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
    
        if (!nameValue || !birthdateValue || !emailValue || !passwordValue) {
            alert("All fields must be filled out.");
            return;
        }
    
        const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailValue)) {
            alert("Please enter a valid email address.");
            return;
        }
    
        const userId = localStorage.getItem('userId');
        
       
        passwordInput.value = ''; 

        try {
            const response = await fetch(`http://localhost:3000/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameValue,
                    birthdate: birthdateValue,
                    gender: genderValue,
                    email: emailValue,
                    password: passwordValue
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                nameDisplay.innerHTML = `<strong>Name:</strong> ${nameValue}`;
                birthdateDisplay.innerHTML = `<strong>Birthdate:</strong> ${birthdateValue}`;
                genderDisplay.innerHTML = `<strong>Gender:</strong> ${genderValue}`;
                emailDisplay.innerHTML = `<strong>Email Address:</strong> ${emailValue}`;
                passwordDisplay.innerHTML = `<strong>Password:</strong> ********`;
    
                cancelBtn.click();
                alert('Profile updated successfully.');
            } else {
                throw new Error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile information. Please try again later.');
        }
    });
});

document.getElementById("show-password").addEventListener("click", function () {
    const passwordField = document.getElementById("password-input");
    if (passwordField.type === "password") {
        passwordField.type = "text"; 
        this.textContent = "Hide"; 
    } else {
        passwordField.type = "password"; 
        this.textContent = "Show"; 
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-btn');


    logoutBtn.addEventListener('click', function () {
        window.location.href = 'LoginPage.html'; 
    });
});


const createRecipeBtn = document.getElementById('createRecipeBtn');

createRecipeBtn.addEventListener('click', function() {
    window.location.href = 'AddRecipePage.html';
});


document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        window.location.href = '/login.html';
        return;
    }

    try {
        // Fetch user data
        const userResponse = await fetch(`http://localhost:3000/user/${userId}`);
        const userData = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error(userData.error || 'Failed to load user data');
        }

        document.getElementById('name-display').innerHTML = `<strong>Name:</strong> ${userData.name}`;
        document.getElementById('name-input').value = userData.name;

        document.getElementById('birthdate-display').innerHTML = `<strong>Birthdate:</strong> ${new Date(userData.birthdate).toLocaleDateString()}`;
        document.getElementById('birthdate-input').value = userData.birthdate;

        document.getElementById('gender-display').innerHTML = `<strong>Gender:</strong> ${userData.gender}`;
        document.getElementById('gender-input').value = userData.gender;

        document.getElementById('email-display').innerHTML = `<strong>Email Address:</strong> ${userData.email}`;
        document.getElementById('email-input').value = userData.email;

        const dishesResponse = await fetch(`http://localhost:3000/user/${userId}/dishes`);
        const dishes = await dishesResponse.json();

        if (!dishesResponse.ok) {
            throw new Error(dishes.error || 'Failed to load user dishes');
        }

        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.innerHTML = '';
        dishes.forEach(dish => {
            const dishLink = document.createElement('a');
            dishLink.href = `/dish/${dish._id}.html`;
            dishLink.textContent = dish.title;
            dropdownContent.appendChild(dishLink);
        });

    } catch (error) {
        console.error('Error loading profile or dishes:', error);
        alert('Failed to load profile or dishes. Please try again later.');
    }
});
