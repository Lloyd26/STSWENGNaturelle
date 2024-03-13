import {showError, showSuccess} from "./form.js";
import {Element} from "./element.js";

const RESERVATION_GET_URL="/reserveinfo/get-user-reservations"
const RESERVATION_WRAPPER="#reservation-list-container"

$(document).ready(function(){
    showReservations(RESERVATION_GET_URL, RESERVATION_WRAPPER);

    $("#confirm-cancel-reservation-btn").on("click", function(e){
        let reservation_id = $("#confirm-reservation-id").val()

        let reservation_id_obj = {
            reservation_id: reservation_id
        }

        console.log(reservation_id)
        $.post("/reserveinfo/cancel", reservation_id_obj, function(response){
            showSuccess("Cancelled Reservation successfully!", "#cancel-reservation-error-msg");
        })

    })

    document.querySelectorAll("#cancel-reservation-modal").forEach(modal => {
        modal.addEventListener("hidden.bs.modal", function () {
            let error_msg = this.querySelector(".error-msg");
            if (error_msg !== null) {
                error_msg.textContent = "";
                error_msg.setAttribute("data-error-status", "normal");
            }
            document.querySelector(RESERVATION_WRAPPER).innerHTML = "";
            document.querySelector("#cancel-services-container").innerHTML = "";
            showReservations(RESERVATION_GET_URL, RESERVATION_WRAPPER);
        });
    });

})

function showReservations (url, container) {
    $.get(url, {}, (data, status, xhr) => {
        data.forEach(rsrv => {

            let reservation_details_container
            if (rsrv.status == "Cancelled"){
                reservation_details_container = new Element(".reservation-details-container.cancelled", {
                    attr: {
                        "data-reservation-id": rsrv.reservationID
                    }
                }).getElement();
            } else {
                reservation_details_container = new Element(".reservation-details-container", {
                    attr: {
                        "data-reservation-id": rsrv.reservationID
                    }
                }).getElement();
            }
            
            let services_label = new Element(".services-label", {
                text: "Services"
            }).getElement();

            let services_container = new Element(".services-container").getElement();
            

            let timestamp = new Element(".timestamp", {
                text: rsrv.timestamp
            }).getElement();

            rsrv.services.forEach(srv => {
                let reservation_details = new Element(".reservation-details").getElement();

                let label_service_title = new Element("div.desc",{
                    text: "Service Title: "
                }).getElement()
                let label_preferred_employee = new Element("div.desc",{
                    text: "Preferred Employee: "
                }).getElement()
                let label_details = new Element("div.desc",{
                    text: "Details: "
                }).getElement()

                let service_title = new Element(".service-title.detail", {
                    text: srv.serviceTitle
                }).getElement();
                let preferred_employee = new Element(".preferred-employee.detail", {
                    text: srv.preferredEmployee
                }).getElement();
                let details = new Element(".details.detail", {
                    text: srv.details
                }).getElement();

                label_service_title.append(service_title)
                label_preferred_employee.append(preferred_employee)

                if (srv.details != "") {
                    label_details.append(details)
                    reservation_details.append(label_service_title, label_preferred_employee, label_details)
                } else {
                    reservation_details.append(label_service_title, label_preferred_employee)
                }
                services_container.append(reservation_details)
            });

            let status = new Element(".status", {
                text: rsrv.status
            }).getElement();

            let cancel_reservation_btn = new Element("button.cancel-reservation-btn", {
                text: "Cancel Reservation",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#cancel-reservation-modal"
                }
            }).getElement();
            let cancel_icon = new Element("i.fa.fa-cancel").getElement();
            cancel_reservation_btn.prepend(cancel_icon);
            cancel_reservation_btn.addEventListener("click", onCancelReservationClick);

            if (rsrv.status == "Cancelled"){
                reservation_details_container.append(timestamp, services_label, services_container, status)
            } else {
                reservation_details_container.append(timestamp, services_label, services_container, status, cancel_reservation_btn)
            }

            document.querySelector(container).append(reservation_details_container);
        });
    });
}

function onCancelReservationClick (e) {
    let reservation_id = e.currentTarget.closest(".reservation-details-container").getAttribute("data-reservation-id");
    let modal_confirm = document.getElementById("cancel-reservation-modal");
    let modal_confirm_id = modal_confirm.querySelector("#confirm-reservation-id");
    let cancel_services_container = document.getElementById("cancel-services-container")
    modal_confirm_id.value = reservation_id
    $.get("/reserveinfo/find-reservation", {id:reservation_id}, (data, status, xhr)=>{
        document.querySelector('#input-reservation-date').value = data.timestamp
        
        data.services.forEach(serv => {
            let confirm_services_container = new Element(".confirm-services-container").getElement()
            let label_service_title = new Element("div.desc",{
                text: "Service Title: "
            }).getElement()
            let label_preferred_employee = new Element("div.desc",{
                text: "Preferred Employee: "
            }).getElement()
            let label_details = new Element("div.desc",{
                text: "Details: "
            }).getElement()

            let confirm_service_title = new Element(".confirm-service-title.detail",{
                text: serv.serviceTitle
            }).getElement()
            let confirm_preferred_employee = new Element(".confirm-preferred-employee.detail",{
                text: serv.preferredEmployee
            }).getElement()
            let confirm_details = new Element(".confirm-details.detail",{
                text: serv.details
            }).getElement()

            label_service_title.append(confirm_service_title)
            label_preferred_employee.append(confirm_preferred_employee)

            if (serv.details != "") {
                label_details.append(confirm_details)
                confirm_services_container.append(label_service_title, label_preferred_employee, label_details)
            } else {
                confirm_services_container.append(label_service_title, label_preferred_employee)
            }
            
            cancel_services_container.append(confirm_services_container)
        })
        
    })
}

module.exports = reserveinfo;