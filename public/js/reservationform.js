function generateTimeOptions() {
    var input_time = $("#input-time");
    var opening_time = new Date();
    opening_time.setHours(10, 0, 0); // Set initial time to 10:00 AM
  
    var closing_time = new Date();
    closing_time.setHours(20, 0, 0); // Set end time to 8:00 PM
  
    var curr_time = new Date(opening_time);
  
    while (curr_time <= closing_time) {
      var hours = curr_time.getHours();
      var minutes = curr_time.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';

      military_hours = hours
      hours = hours % 12;
      hours = hours ? hours : 12;
  
      var timeString = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
      var value = military_hours + ':' + (minutes < 10 ? '0' : '') + minutes;
  
      input_time.append($('<option>', {
        value: value,
        text: timeString
      }));
      
      curr_time.setMinutes(curr_time.getMinutes() + 15);
    }
  }

$(document).ready(function(){
    generateTimeOptions()
})