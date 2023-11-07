import {showError, showSuccess} from "./form.js";

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

    $(".form-reservation").on("submit", function(e) {
        let current_date = new Date();
        let date_value = $('#input-date').val();
        let time_value = $('#input-time').val();
        let format_date = new Date(date_value);

        let time = time_value.split(':');
        let hours = parseInt(time[0], 10);
        let minutes = parseInt(time[1], 10);

        format_date.setHours(hours);
        format_date.setMinutes(minutes);

        if (!date_value){
            e.preventDefault();
            showError("Please fill in all fields.");
        } else if (format_date < current_date) {
            e.preventDefault();
            showError("Please pick a valid schedule.");
        } else {
            e.preventDefault();
            showSuccess("The desired schedule is available");
        }
    });
});