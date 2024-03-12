test('Salon website renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/');
    const body = await response.text();
    expect(response.status).toBe(200);

  });


// test('Salon login page renders without errors',async () => {

//     const response = await fetch('https://stswengnaturelle.onrender.com/login');
//     const body = await response.text();
//     expect(response.status).toBe(200);

//   });

// test('Salon register page renders without errors',async () => {

//     const response = await fetch('https://stswengnaturelle.onrender.com/register');
//     const body = await response.text();
//     expect(response.status).toBe(200);

//   });

// test('Salon about page renders without errors',async () => {

//     const response = await fetch('https://stswengnaturelle.onrender.com/about');
//     const body = await response.text();
//     expect(response.status).toBe(200);

//   });
jest.mock('jquery');
import {onCancelReservationClick} from '../public/js/reserveinfo.js';

describe("Cancel a reservation", () => {
    it("It should change reservation status to cancelled upon clicking", async () => {
        const reservation_id = 1;
        const reservation_id_obj = {
            reservation_id: reservation_id
        }
        const response = {
            status: "Cancelled"
        }
        $.post.mockImplementation((url, data, callback) => {
            callback(response);
        });
        const showSuccess = jest.fn();
        const showReservations = jest.fn();
        const error_msg = {
            textContent: "",
            setAttribute: jest.fn()
        }
        const modal = {
            querySelector: jest.fn().mockReturnValue(error_msg)
        }
        const reservation_wrapper = {
            innerHTML: ""
        }
        const cancel_services_container = {
            innerHTML: ""
        }
        const RESERVATION_GET_URL = "/reserveinfo/get-user-reservations";
        const RESERVATION_WRAPPER = "#reservation-list-container";
        const event = {
            target: {
                value: "Cancelled"
            }
        }
        const e = {
            target: {
                value: "Cancelled"
            }
        }
        document.querySelectorAll = jest.fn().mockReturnValue([modal]);
        document.querySelector = jest.fn().mockReturnValue(reservation_wrapper);
        document.querySelector = jest.fn().mockReturnValue(cancel_services_container);
        showReservations.mockReturnValue();
        onCancelReservationClick(e, showSuccess, showReservations);
        expect($.post).toHaveBeenCalledWith("/reserveinfo/cancel", reservation_id_obj, expect.any(Function));
        expect(showSuccess).toHaveBeenCalledWith("Cancelled Reservation successfully!", "#cancel-reservation-error-msg");
        expect(modal.querySelector).toHaveBeenCalledWith(".error-msg");
        expect(error_msg.textContent).toBe("");
        expect(error_msg.setAttribute).toHaveBeenCalledWith("data-error-status", "normal");
        expect(document.querySelector).toHaveBeenCalledWith(RESERVATION_WRAPPER);
        expect(document.querySelector).toHaveBeenCalledWith("#cancel-services-container");
        expect(showReservations).toHaveBeenCalledWith(RESERVATION_GET_URL, RESERVATION_WRAPPER);
    });   
});
