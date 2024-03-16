$(document).ready(function(){
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#input-password');
    togglePassword.addEventListener('click', () => {
        const type = password
            .getAttribute('type') === 'password' ?
            'text' : 'password';
        password.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
    });
})