import {showError, showSuccess} from "./form.js";

$(document).ready(function(){
    $("#form-service").on("submit", function(e) {
        let service = $('#input-service').val()
        let staff = $('#input-staff').val()
        let details = $('#input-details').val()
        console.log(service,staff)
        if (!service){
            e.preventDefault();
            showError("Please select an service to put in the cart.", "#add-error-msg");
        } else if (!staff){
            e.preventDefault();
            showError("Please select a valid Preferred Staff option.", "#add-error-msg");
        } else {
            e.preventDefault();
            showSuccess("Added to cart successfully!", "#add-error-msg")
        }
    });
});