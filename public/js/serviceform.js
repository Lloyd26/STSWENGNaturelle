import {showError, showSuccess} from "./form.js";
import {addToCart} from "./cart.js";

$(document).ready(function(){
    $("#form-service").on("submit", function(e) {
        let service_val = $('#input-service').val()
        let staff_val = $('#input-staff').val()
        let details_val = $('#input-details').val()

        if ($('#input-service').prop('disabled')) {
            e.preventDefault();
            showError("Select a valid reservation date first.", "#add-error-msg");
        } else if (!service_val) {
            e.preventDefault();
            showError("Please select an service to put in the cart.", "#add-error-msg");
        } else if (!staff_val) {
            e.preventDefault();
            showError("Please select a valid Preferred Staff option.", "#add-error-msg");
        } else {
            e.preventDefault();
            showSuccess("Added to cart successfully!", "#add-error-msg");

            let service_select = document.getElementById("input-service");
            let staff_select = document.getElementById("input-staff");

            let service = service_select.options[service_select.selectedIndex].text;
            let staff = staff_select.options[staff_select.selectedIndex].text;
            addToCart(service, staff, details_val);
        }
    });
});