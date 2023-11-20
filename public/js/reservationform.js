import {showError, showSuccess, disableForms} from "./form.js";
import {setCartDateTime} from "./cart.js";

function generateTimeOptions() {
    let input_time = $("#input-time");

    let opening_time = new Date();
    opening_time.setHours(10, 0, 0); // Set initial time to 10:00 AM
  
    let closing_time = new Date();
    closing_time.setHours(20, 0, 0); // Set end time to 8:00 PM
  
    let curr_time = new Date(opening_time);
  
    while (curr_time <= closing_time) {
      let hours = curr_time.getHours();
      let minutes = curr_time.getMinutes();
      let ampm = hours >= 12 ? 'PM' : 'AM';

      let hour24 = hours
      let hour12 = hours % 12;
      hour12 = hour12 || 12;
  
      let timeString = hour12 + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
      let value = hour24 + ':' + (minutes < 10 ? '0' : '') + minutes;
  
      input_time.append($('<option>', {
        value: value,
        text: timeString
      }));
      
      curr_time.setMinutes(curr_time.getMinutes() + 15);
    }
  }

$(document).ready(function(){
    generateTimeOptions();

    $("#form-reservation").on("submit", function(e) {
        let current_date = new Date();
        let date_value = $('#input-date').val();
        let time_value = $('#input-time').val();
        let format_date = new Date(date_value);

        current_date.setHours(0,0,0,0)

        let reservation_limit = new Date()
        reservation_limit.setDate(current_date.getDate() + 14)

        let time_diff = format_date.getTime() - current_date.getTime(); 
        let day_diff = (time_diff / (1000 * 3600 * 24));

        let service_forms = ['#input-service', '#input-staff', '#input-details'];

        let error_container = "#reserve-error-msg";

        if (!date_value){
            e.preventDefault();
            disableForms(true, service_forms);
            showError("Please fill in all fields.", error_container);
        } else if (format_date < current_date) {
            e.preventDefault();
            disableForms(true, service_forms);
            showError("Please pick a valid schedule.", error_container);
        } else if (day_diff < 1 && format_date.getDate() == current_date.getDate()) {
            e.preventDefault();
            disableForms(true, service_forms);
            showError("Same day reservations are not accommodated.", error_container);
        } else if (format_date > reservation_limit) {
            e.preventDefault();
            disableForms(true, service_forms);
            showError("You can only reserve a date that is within two weeks from now.", error_container);
        } else {
            e.preventDefault();
            disableForms(false, service_forms);
            showSuccess("The desired schedule is available", error_container);

            setCartDateTime(format_date.toLocaleDateString(), $("#input-time option:selected").text())
        }
    });
});