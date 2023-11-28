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
import {Element} from "./element.js";

const RESERVATION_GET_URL = "/admin/reservations/get";
const RESERVATION_WRAPPER = "#admin-reservations-wrapper";

let cached_data = [];

document.addEventListener("DOMContentLoaded", function() {
    showReservations(RESERVATION_GET_URL, RESERVATION_WRAPPER);
});

function showReservations(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        if (!checkCache(data)) return;
        document.querySelector(container).innerHTML = "";

        data.forEach(reservations => {
            let admin_reservations_container = new Element(".admin-reservations-container", {
                attr: {
                    "data-reservation-id": reservations._id
                }
            }).getElement();
     
            let reservation_button = new Element("button.reservation-button").getElement();
            let reservation_date = new Element("span.reservation-date", {
                text: reservations.timestamp
            }).getElement();
            let reservation_id= new Element("span.reservation-id", {
                text: reservations._id
            }).getElement();
            
            reservation_button.appendChild(reservation_date);
            reservation_button.appendChild(reservation_id);

            admin_reservations_container.appendChild(reservation_button);

            reservation_button.addEventListener("click", () => {
                showDetails(reservation._id);// Call a function to show details
            });

            document.querySelector(container).append(admin_reservations_container);
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



function checkCache(data) {
    if (cached_data.length === 0) {
        data.forEach(d => cached_data.push(d._id));
        return true;
    }

    let temp_data = [];
    data.forEach(d => temp_data.push(d._id));

    for (let i in cached_data) {
        if (cached_data[i] !== temp_data[i]) {
            return false;
        }
    }

    return true;
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
