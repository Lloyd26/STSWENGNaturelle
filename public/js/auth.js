import {showError, validateForm} from "./form.js";

function isEmailValid(email) {
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validEmailRegex.test(email);
}

function isContactNumValid(contactNum) {
    const validContactNumRegex = /^(09)\d{9}/;
    return validContactNumRegex.test(contactNum);
}

$(document).ready(function() {

    $("#form-login-admin").on("submit", function(e) {
        let username = $("#input-username");
        let password = $("#input-password");

        let validForm = validateForm(username, password);

        if (!validForm) {
            e.preventDefault();
            username.focus();
            showError("Please enter your username and password.", "#login-admin-error-msg")
        }
    });

    $("#form-login").on("submit", function(e) {
        let email = $("#input-email");
        let password = $("#input-password");

        let validForm = validateForm(email, password);

        if (!validForm) {
            e.preventDefault();
            email.focus();
            showError("Please enter your email and password.", "#login-error-msg")
        } else if (!isEmailValid(email.val())) {
            e.preventDefault();
            email.focus();
            email.addClass("is-invalid");
            showError("Please enter a valid email address!", "#login-error-msg");
        }
    });

    $("#form-register").on("submit", function(e) {
        let fname = $("#input-firstname");
        let lname = $("#input-lastname");
        let contact_num = $("#input-contactnum");
        let email = $("#input-email");
        let password = $("#input-password");

        let validForm = validateForm(fname, lname, contact_num, email, password);

        if (!validForm) {
            e.preventDefault();
            showError("Please fill out the form.", "#reg-error-msg")
        } else if (!isEmailValid(email.val())) {
            e.preventDefault();
            email.focus();
            email.addClass("is-invalid");
            showError("Please enter a valid email address!", "#reg-error-msg");
        } else if (!isContactNumValid(contact_num.val())) {
            e.preventDefault();
            contact_num.focus();
            contact_num.addClass("is-invalid");
            showError("Please follow the contact number format: 09XXXXXXXXX", "#reg-error-msg");
        } else if (password.val().length < 8) {
            e.preventDefault();
            password.focus();
            password.addClass("is-invalid");
            showError("Password must contain at least 8 characters!", "#reg-error-msg");
        }
    });
});