import {showError, showSuccess} from "./form.js";

$(document).ready(function(){
    $('.close-btn').on('click', function(e) {
        window.location.href = "/admin/services"
    })

    $('.delete-btn').on('click', function () {
        let serviceTitle = $(this).parent().siblings().children().first().text();

        console.log(serviceTitle)
        $('.service-title-info').text(serviceTitle)
    });

    $('#delete-service-collection-btn').on('click', function(e) {
        let serviceTitle = {serviceTitle: $(".service-title-info").first().text()};

        $.ajax({
            url:"/admin/services/delete-service-collection", 
            type: "DELETE",
            data: serviceTitle,
            success: function(response) {
                if (response.hasError) {
                    e.preventDefault();
                    showError(response.error, "#delete-service-collection-error-msg");
                    
                } else {
                    e.preventDefault();
                    showSuccess("Deleted " + serviceTitle.serviceTitle + " successfully!", "#delete-service-collection-error-msg");
                    
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error deleting service collection:", errorThrown);
            }
        })
    });
})