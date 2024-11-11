document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const signInBtn = document.getElementById('signInBtn');

    signInBtn.disabled = true;
    signInBtn.textContent = 'Signing In...';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to login');
        }

        localStorage.setItem('userId', data.userId);
        window.location.href = '/HomePage.html';
        
    } catch (err) {
        errorMessage.textContent = err.message || 'Something went wrong';
        errorMessage.style.display = 'block';
    } finally {
        signInBtn.disabled = false;
        signInBtn.textContent = 'SIGN IN';
    }
});

document.getElementById('show-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        this.textContent = 'Show';
    }
});
