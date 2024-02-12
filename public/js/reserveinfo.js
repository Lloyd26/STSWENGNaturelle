import {showError, showSuccess} from "./form.js";


$(document).ready(function(){
    $("#confirm-cancellation-btn").on("click", function(e){
        let reservation_id = $("#confirm-reservation-id").val()

        let reservation_id_obj = {
            reservation_id: reservation_id
        }

        $.post("/reserveinfo/cancel", reservation_id_obj, function(response){
        })

    })

})

function onCancelReservationClick (e) {
    let reservation_id = e.currentTarget.closest(".reservation-details-container").getAttribute("data-reservation-id");
    let modal_confirm = document.getElementById("cancel-reservation-modal");
    let modal_confirm_id = modal_confirm.querySelector("#confirm-reservation-id");

    modal_confirm_id.value = reservation_id
}