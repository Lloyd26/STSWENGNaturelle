function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        if (!form.trim().length)
            valid = false;
        return valid;
    });
    return valid;
}

function isEmailValid(email) {
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(validEmailRegex);
}

function showError(error_text) {
    let error_container = $('#error-msg');
    error_container.attr('data-error-status', 'error');
    error_container.css('animation', 'shake ease-in-out 0.375s');
    setTimeout(function() {
        error_container.css('animation', '');
    }, 500);
    error_container.text(error_text);
}

$(document).ready(function() {
    $("#form-login").on("submit", function(e) {
        let email = $("#input-email").val();
        let password = $("#input-password").val();

        let email_input = $("#input-email");
        let password_input = $("#input-password");

        let validForm = validateForm(email, password);

        if (!validForm) {
            e.preventDefault();
            email_input.focus();
            showError("Please enter your email and password.")
        } else if (!isEmailValid(email)) {
            e.preventDefault();
            email_input.focus();
            showError("Please enter a valid email address!");
        }
    })
})