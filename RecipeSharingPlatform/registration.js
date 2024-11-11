document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const birthdate = document.getElementById('birthdate').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (name === '' || birthdate === '' || gender === '' || email === '' || password === '' || confirmPassword === '') {
        alert('All fields are required.');
        return;
    }

    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    if (!datePattern.test(birthdate)) {
        alert('Please enter a valid birthdate (dd/mm/yyyy).');
        return;
    }

    const parts = birthdate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const dob = new Date(year, month, day);

    if (dob.getFullYear() !== year || dob.getMonth() !== month || dob.getDate() !== day) {
        alert('Please enter a valid date.');
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    const formData = {
        name,
        birthdate: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        gender,
        email,
        password,
    };

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            setTimeout(function() {
                window.location.href = 'LoginPage.html';
            }, 1000);
        } else {
            alert(result.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
    }
});
