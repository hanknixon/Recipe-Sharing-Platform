document.getElementById('resetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    const successMessage = 'A reset link has been sent to ' + email;
    alert(successMessage);

    setTimeout(function() {
        window.location.href = 'LoginPage.html';
    }, 1000); 
});
