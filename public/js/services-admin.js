import {showError, showSuccess} from "./form.js";

function getUniqueValues(arr, field) {
    const uniqueValues = new Set();
    arr.forEach(obj => {
      uniqueValues.add(obj[field]);
    });
    return Array.from(uniqueValues);
}

function hasEmptyField() {
    let doesTabularHaveEmpty = $(".services-list li input").filter(function() {
        return $(this).val() === '';
    })

    let doesStandaloneHaveEmpty = $(".standalone-services-list li input").filter(function() {
        return $(this).val() === '';
    })

    return doesTabularHaveEmpty.length > 0 || doesStandaloneHaveEmpty.length > 0
}
  

$(document).ready(function(){

    $("#add-service-collection-btn").on("click", function(e){
        let add_form = $('#form-add-service-collection')
        let service_concern = $('#input-service-concern').val()
        let service_title = $('#input-service-title').val()
        let services_list = $(".services-list")
        let standalone_services_list = $(".standalone-services-list")
        let service_obj = {}
        let services_arr = []
        let service_coll = {}
        let standalone_service_obj = {}
        let standalone_services_arr = []

        if (!service_concern) {
            e.preventDefault();
            showError("Please input a Service Concern", "#add-service-collection-error-msg");
        } else if (!service_title) {
            e.preventDefault();
            showError("Please input a Service Title", "#add-service-collection-error-msg");
        } else if (services_list.children().length == 0) {
            e.preventDefault();
            showError("Please add at least 1 service in the collection", "#add-service-collection-error-msg");
        } else if (hasEmptyField()) {
            e.preventDefault();
            showError("Please fill in all service fields", "#add-service-collection-error-msg");
        } else {
            
            // make service objects
            $(".services-list li").each(function(index) {
                service_obj = {
                    serviceTitle: service_title,
                    serviceOption1: $(this).find('.input-service-option-1').val(),
                    serviceOption2: $(this).find('.input-service-option-2').val(),
                    price: $(this).find('.input-price').val(),
                }
                services_arr.push(service_obj)
            });

            // make standalone service objects
            $(".standalone-services-list li").each(function(index) {
                standalone_service_obj = {
                    serviceTitle: service_title,
                    serviceOption: $(this).find('.input-standalone-service-option').val(),
                    price: $(this).find('.input-standalone-price').val(),
                }
                standalone_services_arr.push(standalone_service_obj)
            });

            // make option choices

            let optionChoices1 = getUniqueValues(services_arr, 'serviceOption1')
            let optionChoices2 = getUniqueValues(services_arr, 'serviceOption2')

            service_coll = {
                serviceConcern: service_concern,
                serviceTitle: service_title,
                services: services_arr,
                optionChoices1: optionChoices1,
                optionChoices2: optionChoices2,
                specialServices: standalone_services_arr
            }

            console.log(service_coll)

            $.post("/admin/services/add-service-collection", service_coll, function(response)
            {
                if (response.hasError) {
                    e.preventDefault();
                    showError(response.error, "#add-service-collection-error-msg");
                } else {
                    add_form[0].reset();
                    e.preventDefault();
                    showSuccess("Added Service Collection successfully!", "#add-service-collection-error-msg");
                }
            })
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

    $(".add-standalone-service").on("click", function(e){
        let $clone = $(`<li class="input-standalone-services">
                            <input class="form-control input-standalone-service-option" name="input-service-option-1" type="text" placeholder="Service Option">
                            <input class="form-control input-standalone-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-standalone-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $(".standalone-services-list").append($clone)
        e.preventDefault()
    })

    $(document).on("click", ".delete-service", function(e){
        let toDelete = $(this).closest('.input-services')
        toDelete.remove()
        e.preventDefault()
    })

    $(document).on("click", ".delete-standalone-service", function(e){
        let toDelete = $(this).closest('.input-standalone-services')
        toDelete.remove()
        e.preventDefault()
    })
});