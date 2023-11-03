function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        form.removeClass("is-invalid");
        if (!form.val().trim().length)
            valid = false;
        return valid;
    });
    return valid;
}

function isEmailValid(email) {
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(validEmailRegex);
}

function isContactNumValid(contactnum) {
    const validContactNumRegex = /^(09)\\d{9}/;
    return contactnum.match(validContactNumRegex);
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
        let email = $("#input-email");
        let password = $("#input-password");

        let validForm = validateForm(email, password);

        if (!validForm) {
            e.preventDefault();
            email.focus();
            showError("Please enter your email and password.")
        } else if (!isEmailValid(email.val())) {
            e.preventDefault();
            email.focus();
            showError("Please enter a valid email address!");
        }
    })

    $("#form-register").on("submit", function(e) {
        let fname = $("#input-firstname");
        let lname = $("#input-lastname");
        let contact_num = $("#input-contactnum");
        let email = $("#input-email");
        let password = $("#input-password");

        let validForm = validateForm(fname, lname, contact_num, email, password);

        if (!validForm) {
            e.preventDefault();
            showError("Please fill out the form.")
        } else if (!isEmailValid(email.val())) {
            e.preventDefault();
            email.focus();
            email.addClass("is-invalid");
            showError("Please enter a valid email address!");
        } else if (!isContactNumValid(contact_num.val())) {
            e.preventDefault();
            contact_num.focus();
            contact_num.addClass("is-invalid");
            showError("Please follow the contact number format: 09XXXXXXXXX");
        } else if (password.val().length < 8) {
            e.preventDefault();
            password.focus();
            password.addClass("is-invalid");
            showError("Password must contain at least 8 characters!");
        }
    })
})