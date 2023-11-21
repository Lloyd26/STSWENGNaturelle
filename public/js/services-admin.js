import {showError, showSuccess} from "./form.js";

function deleteService (){
    let to_delete = $(this).closest("li")
    to_delete.remove()
}

$(document).ready(function(){

    $("#add-service-collection-btn").on("click", function(e){
        let add_form = $('#form-add-service-collection')
        let service_concern = $('#input-service-concern').val()
        let service_title = $('#input-service-title').val()
        let options1 = $('#input-service-option-choices-1').val()
        let options2 = $('#input-service-option-choices-2').val()
        let services_list = $(".services-list")
        let formData = {serviceConcern:service_concern, serviceTitle: service_title, options1:options1, options2:options2}

        if (!service_concern) {
            e.preventDefault();
            showError("Please input a Service Concern", "#add-service-collection-error-msg");
        } else if (!service_title) {
            e.preventDefault();
            showError("Please input a Service Title", "#add-service-collection-error-msg");
        } else if (services_list.children().length == 0) {
            e.preventDefault();
            showError("Please add at least 1 service in the collection", "#add-service-collection-error-msg");
        } else if (!options2) {
            e.preventDefault();
            showError("Please input Service Option Choices (Row Headers)", "#add-service-collection-error-msg");
        } else {
            $.post("/admin/services/add-service-collection", formData, function(response)
            {
                console.log(response)
            })
            add_form[0].reset();
            e.preventDefault();
            showSuccess("Added Service Collection successfully!", "#add-service-collection-error-msg");
        }
    })

    $(".add-service").on("click", function(e){
        let $clone = $(`<li class="input-services">
                            <input class="form-control input-service-option-1" name="input-service-option-1" type="text" placeholder="Service Option 1">
                            <input class="form-control input-service-option-2" name="input-service-option-2" type="text" placeholder="Service Option 2">
                            <input class="form-control input-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $(".services-list").append($clone)
        e.preventDefault()
    })

    $(document).on("click", ".delete-service", function(e){
        let toDelete = $(this).closest('.input-services')
        toDelete.remove()
        e.preventDefault()
    })
});