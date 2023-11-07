export function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        form.removeClass("is-invalid");
        if (!form.val().trim().length)
            valid = false;
        return valid;
    });
    return valid;
}

export function showError(error_text) {
    let error_container = $('#error-msg');
    error_container.attr('data-error-status', 'error');
    error_container.css('animation', 'shake ease-in-out 0.375s');
    setTimeout(function() {
        error_container.css('animation', '');
    }, 500);
    error_container.text(error_text);
}

export function showSuccess(success_text) {
    let error_container = $('#error-msg');
    error_container.attr('data-error-status', 'success');
    error_container.text(success_text);
}