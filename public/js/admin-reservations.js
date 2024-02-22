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
});

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
                text: formatDateTime(reservation.timestamp)
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
                text: "Services"
            }).getElement();

            let btn_services_icon = new Element("i.fa.fa-cog").getElement();
            btn_services.prepend(btn_services_icon);

            let btn_update = new Element("button.btn.admin-btn-reservation-update", {
                text: "Update"
            }).getElement();

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

function formatDateTime(datetime) {
    let date = new Date(datetime);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    let AMPM = date.getHours() > 12 ? "PM" : "AM";

    return monthNames[date.getMonth()] + ". " + date.getDate() + " – " + date.getHours() + ":" + minutes + " " + AMPM;
}