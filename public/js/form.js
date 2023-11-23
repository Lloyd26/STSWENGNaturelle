export function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        if (form instanceof jQuery) {
            form.removeClass("is-invalid");
            if (!form.val().trim().length)
                valid = false;
            return valid;
        } else {
            form.classList.remove("is-invalid");
            if (!form.value.trim().length)
                valid = false;
            return valid;
        }
    });
    return valid;
}

export function showError(error_text, msg_field) {
    let error_container = $(msg_field);
    error_container.attr('data-error-status', 'error');
    error_container.css('animation', 'shake ease-in-out 0.375s');
    setTimeout(function() {
        error_container.css('animation', '');
    }, 500);
    error_container.text(error_text);
}

export function showSuccess(success_text, msg_field) {
    let error_container = $(msg_field);
    error_container.attr('data-error-status', 'success');
    error_container.text(success_text);
}

export function disableForms(isDisabled, forms){
    forms.forEach(form => {
        document.querySelectorAll(form).forEach(el => {
            el.disabled = isDisabled;
        });
    })
}

export function isEmailValid(email) {
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validEmailRegex.test(email);
}

export function isContactNumValid(contactNum) {
    const validContactNumRegex = /^(09)\d{9}/;
    return validContactNumRegex.test(contactNum);
}