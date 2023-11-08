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

export function disableServiceForm (boolVal){
    let input_service = $('#input-service')
    let input_staff = $('#input-staff')
    let input_details = $('#input-details')

    if (boolVal) {
        input_service.prop("disabled", true)
        input_staff.prop("disabled", true)
        input_details.prop("disabled", true)
    } else {
        input_service.prop("disabled", false)
        input_staff.prop("disabled", false)
        input_details.prop("disabled", false)
    }
}