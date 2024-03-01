import {formatDateTime} from "./datetime.js";

// to change
/**
document.addEventListener('DOMContentLoaded', function() {
    var reservationButtons = document.querySelectorAll('.reservation-button');
   // var reservationModal = document.getElementById('reservation-modal');
    //var closeModalButton = document.querySelector('.modal-close');

    reservationButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var reservationId = button.dataset.reservationId;
            fetchReservationDetails(reservationId);
            reservationModal.style.display = 'block';
        });
    });

    closeModalButton.addEventListener('click', function() {
        reservationModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == reservationModal) {
            reservationModal.style.display = 'none';
        }
    });
});
*/
import { Element } from "./element.js";
import { checkCache } from "./dataCache.js";

const RESERVATION_GET_URL = "/admin/reservations/get";
const RESERVATION_WRAPPER = "#admin-reservations-container";

let reservations_cache = [];

document.addEventListener("DOMContentLoaded", function () {
    showReservations(RESERVATION_GET_URL, RESERVATION_WRAPPER);

    document.getElementById("btn-modal-reservation-save").addEventListener("click", function() {
        let modal_reservation_status = this.closest("#modal-reservation-status");

        let reservation_id = document.getElementById("input-reservation-id").value;
        let reservation_status_radio = document.querySelector("#modal-reservation-status-controls-container > input[type='radio']:checked");

        if (reservation_status_radio.hasAttribute("disabled")) {
            bootstrap.Modal.getInstance(modal_reservation_status).hide();
            snackbar({
                type: "primary",
                text: "No changes were made to the reservation status."
            });
            return;
        }

        let reservation_status = reservation_status_radio.id.split("-")[1];
        reservation_status = reservation_status.charAt(0).toUpperCase() + reservation_status.slice(1);

        let btn_save = this.closest(".modal-content").querySelector(".btn-modal-success");
        btn_save.disabled = true;

        let btn_save_icon = btn_save.querySelector("i");
        btn_save_icon.className = "";
        btn_save_icon.classList.add("spinner-border", "me-2");

        $.post("/admin/reservations/update-status", {
            reservation_id: reservation_id,
            reservation_status: reservation_status
        }, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                btn_save_icon.className = "";
                btn_save_icon.classList.add("fa", "fa-floppy-disk");

                bootstrap.Modal.getInstance(modal_reservation_status).hide();
                btn_save.disabled = false;
                snackbar({
                    type: "primary",
                    text: "Reservation status has been updated."
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while updating the status of the reservation."
                });
            }
        }).fail(function(res) {
            btn_save_icon.className = "";
            btn_save_icon.classList.add("fa", "fa-floppy-disk");
            btn_save.disabled = false;
            snackbar({
                type: "error",
                text: "Error: Something went wrong while updating the status of the reservation."
            });
        });
    });

    document.querySelectorAll("#modal-reservation-status").forEach(modal => {
        modal.addEventListener("hidden.bs.modal", function() {
            this.querySelectorAll("input, textarea").forEach(input => {
                input.value = "";
            });
            this.querySelectorAll("input[type=checkbox], input[type=radio]").forEach(input => {
                input.checked = "";
            });
            let error_msg = this.querySelector(".error-msg");
            if (error_msg !== null) {
                error_msg.textContent = "";
                error_msg.setAttribute("data-error-status", "normal");
            }

            showReservations(RESERVATION_GET_URL, RESERVATION_WRAPPER);
        })
    })
});

function resetModalServices() {
    let modal_reservation_services = document.querySelector("#modal-reservation-services");

    let modal_reservation_services_container = modal_reservation_services.querySelector("#modal-reservation-services-container");
    modal_reservation_services_container.innerHTML = "";
}

function onBtnServicesClick(e) {
    resetModalServices();

    let btn_services_icon = e.currentTarget.querySelector("i");
    btn_services_icon.className = "";
    btn_services_icon.classList.add("spinner-border", "me-2");

    let reservation_id = e.currentTarget.closest(".reservation-container").getAttribute("data-reservation-id");

    let reservation_user = e.currentTarget.closest(".reservation-container").querySelector(".reservation-user").textContent;
    let reservation_datetime = e.currentTarget.closest(".reservation-container").querySelector(".reservation-datetime").textContent;

    let modal_reservation_user = document.getElementById("modal-reservation-services-user");
    let modal_reservation_datetime = document.getElementById("modal-reservation-services-datetime");

    modal_reservation_user.textContent = reservation_user;
    modal_reservation_datetime.textContent = reservation_datetime;

    $.get("/admin/reservations/get-services", {
        reservation_id: reservation_id
    }, (data, status, xhr) => {
        btn_services_icon.className = "";
        btn_services_icon.classList.add("fa", "fa-cog");
        for (var i = 0; i < data.services.length; i++) {
            let accordion_item = new Element(".accordion-item").getElement();

            let accordion_header = new Element("h2.accordion-header").getElement();

            let accordion_button = new Element("button.accordion-button.collapsed", {
                text: (i + 1) + ": " + data.services[i].serviceTitle,
                attr: {
                    "type": "button",
                    "data-bs-toggle": "collapse",
                    "data-bs-target": "#accordion-reservation-service-" + i
                }
            }).getElement();
            accordion_header.append(accordion_button);

            let accordion_collapse = new Element(".accordion-collapse.collapse", {
                id: "accordion-reservation-service-" + i
            }).getElement();

            let accordion_body = new Element(".accordion-body").getElement();

            let preferredEmployee = new Element("div", {
                text: data.services[i].preferredEmployee
            }).getElement();
            let preferredEmployeeHeader = new Element("b", {
                text: "Preferred Employee: "
            }).getElement();
            preferredEmployee.prepend(preferredEmployeeHeader);

            let serviceDetails = new Element("div", {
                text: data.services[i].details
            }).getElement();
            let serviceDetailsHeader = new Element("b", {
                text: "Details: "
            }).getElement();
            serviceDetails.prepend(serviceDetailsHeader);

            accordion_body.append(preferredEmployee, serviceDetails);
            accordion_collapse.append(accordion_body);

            accordion_item.append(accordion_header, accordion_collapse);

            document.querySelector("#modal-reservation-services-container").append(accordion_item);

        }

        bootstrap.Modal.getOrCreateInstance(document.querySelector("#modal-reservation-services")).show();
    });

}

function resetModalStatus() {
    let modal_reservation_status = document.querySelector("#modal-reservation-status");

    modal_reservation_status.querySelectorAll("#modal-reservation-status-controls-container > input[type='radio']").forEach(i => {
        i.checked = false;
        i.disabled = false;
    })

    modal_reservation_status.querySelectorAll("#modal-reservation-status-controls-container > label.btn").forEach(lb => {
        lb.classList.remove("disabled");
    });
}

function onBtnUpdateClick(e) {
    resetModalStatus();

    let reservation_id = e.currentTarget.closest(".reservation-container").getAttribute("data-reservation-id");
    let modal_reservation_id = document.getElementById("input-reservation-id");
    modal_reservation_id.value = reservation_id;

    let reservation_user = e.currentTarget.closest(".reservation-container").querySelector(".reservation-user").textContent;
    let reservation_datetime = e.currentTarget.closest(".reservation-container").querySelector(".reservation-datetime").textContent;

    let modal_reservation_user = document.getElementById("modal-reservation-status-user");
    let modal_reservation_datetime = document.getElementById("modal-reservation-status-datetime");

    modal_reservation_user.textContent = reservation_user;
    modal_reservation_datetime.textContent = reservation_datetime;

    let reservation_status = e.currentTarget.closest(".reservation-container").querySelector(".reservation-status").getAttribute("data-reservation-status");
    let modal_reservation_status_radio = document.getElementById("status-" + reservation_status);
    modal_reservation_status_radio.checked = true;
    modal_reservation_status_radio.disabled = true;
    let modal_reservation_status_btn = document.querySelector(".btn.status-" + reservation_status);
    modal_reservation_status_btn.classList.add("disabled");
}

function showReservations(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        if (checkCache(data, reservations_cache)) return;
        document.querySelector(container).innerHTML = "";

        data.forEach(reservation => {
            let reservation_container = new Element(".reservation-container", {
                attr: {
                    "data-reservation-id": reservation._id
                }
            }).getElement();

            let reservation_header = new Element(".reservation-header").getElement();

            let reservation_details = new Element(".reservation-details").getElement();

            let reservation_user = new Element(".reservation-user", {
                text: reservation.userID.firstName + " " + reservation.userID.lastName
            }).getElement();

            let reservation_datetime = new Element(".reservation-datetime", {
                text: formatDateTime(new Date(reservation.timestamp), "%MMM. %dd – %h:%mm %tt")
            }).getElement();

            reservation_details.append(reservation_user, reservation_datetime);

            let reservation_status = new Element(".reservation-status", {
                text: reservation.status,
                attr: {
                    "data-reservation-status": reservation.status.toLowerCase()
                }
            }).getElement();

            let status_icon_class = new Map();
            status_icon_class.set('Pending', 'fa-clock');
            status_icon_class.set('Approved', 'fa-check');
            status_icon_class.set('Cancelled', 'fa-xmark');

            let status_icon = new Element("i.fa." + status_icon_class.get(reservation.status)).getElement();
            reservation_status.prepend(status_icon);

            reservation_header.append(reservation_details, reservation_status);

            let reservation_controls = new Element(".reservation-controls").getElement();

            let btn_services = new Element("button.btn.admin-btn-reservation-services", {
                text: "Services",
            }).getElement();
            btn_services.addEventListener("click", onBtnServicesClick);

            let btn_services_icon = new Element("i.fa.fa-cog").getElement();
            btn_services.prepend(btn_services_icon);

            let btn_update = new Element("button.btn.admin-btn-reservation-update", {
                text: "Update",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#modal-reservation-status"
                }
            }).getElement();
            btn_update.addEventListener("click", onBtnUpdateClick);

            let btn_update_icon = new Element("i.fa.fa-pen").getElement();
            btn_update.prepend(btn_update_icon);

            reservation_controls.append(btn_services, btn_update);

            reservation_container.append(reservation_header, reservation_controls);

            document.querySelector(container).append(reservation_container);
        });
    });
}

function showDetails(reservationId) {
    // Fetch reservation details from the database using the reservationId
    Reservation.findById(reservationId, (err, reservation) => {
        if (err) {
            console.error(err);
            return;
        }

        // Get the existing modal container
        let modalContainer = document.querySelector('.modal');

        // Create modal content if it doesn't exist
        let modalContent = modalContainer.querySelector('.modal-content');
        if (!modalContent) {
            modalContent = new Element('.modal-content').getElement();
            modalContainer.appendChild(modalContent);
        }

        // Clear previous content
        modalContent.innerHTML = "";

        // Add reservation details to the modal content
        let reservationDate = new Element('p', {
            text: `Reservation Date: ${reservation.timestamp}`
        }).getElement();
        let reservationStatus = new Element('p', {
            text: `Status: ${reservation.status}`
        }).getElement();

        modalContent.appendChild(reservationDate);
        modalContent.appendChild(reservationStatus);

        // Display the modal
        showModal();
    });
}

function showModal() {
    let modal = document.querySelector('.modal');

    modal.classList.add('modal-show');

}

/**

$(document).ready(function(){
    showReservations();
})

function showReservations() {
    $.get('/admin/reservations/get', {}, (data, status, xhr) => {
       console.log(data)
    });
}
*/