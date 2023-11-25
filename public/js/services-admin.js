import {showError, showSuccess} from "./form.js";
import {Element} from "./element.js";

const SERVICE_COLLECTION_GET_URL = "/admin/services/get-service-collections";
const SERVICE_COLLECTION_WRAPPER = "#service-collection-container";

function getUniqueValues(arr, field) {
    const uniqueValues = new Set();
    arr.forEach(obj => {
      uniqueValues.add(obj[field]);
    });
    return Array.from(uniqueValues);
}

function doesAddServiceCollHaveEmptyField() {
    let doesTabularHaveEmpty = $("#add-services-list li input").filter(function() {
        return $(this).val() === '';
    })

    let doesStandaloneHaveEmpty = $("#add-standalone-services-list li input").filter(function() {
        return $(this).val() === '';
    })

    console.log(doesTabularHaveEmpty.length, doesStandaloneHaveEmpty.length)
    return doesTabularHaveEmpty.length > 0 || doesStandaloneHaveEmpty.length > 0
}

function doesEditServiceCollHaveEmptyField() {
    let doesTabularHaveEmpty = $("#edit-services-list li input").filter(function() {
        return $(this).val() === '';
    })

    let doesStandaloneHaveEmpty = $("#edit-standalone-services-list li input").filter(function() {
        return $(this).val() === '';
    })

    console.log(doesTabularHaveEmpty.length, doesStandaloneHaveEmpty.length)
    return doesTabularHaveEmpty.length > 0 || doesStandaloneHaveEmpty.length > 0
}

function onBtnDeleteClick (e) {
    e.preventDefault()
    let serviceTitle = $(this).parent().siblings().children().first().text();

    $('.service-title-info').text(serviceTitle)
}

$(document).ready(function(){
    showServiceCollections(SERVICE_COLLECTION_GET_URL, SERVICE_COLLECTION_WRAPPER);

    $("#add-service-collection-btn").on("click", function(e){
        let add_form = $('#form-add-service-collection')
        let service_concern = $('#input-service-concern').val()
        let service_title = $('#input-service-title').val()
        let services_list = $("#add-services-list")
        let standalone_services_list = $("#add-standalone-services-list")
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
        } else if (doesAddServiceCollHaveEmptyField()) {
            e.preventDefault();
            showError("Please fill in all service fields", "#add-service-collection-error-msg");
        } else {
            e.preventDefault();
            // make service objects
            $("#add-services-list li").each(function(index) {
                service_obj = {
                    serviceTitle: service_title,
                    serviceOption1: $(this).find('.input-service-option-1').val(),
                    serviceOption2: $(this).find('.input-service-option-2').val(),
                    price: $(this).find('.input-price').val(),
                }
                services_arr.push(service_obj)
            });

            // make standalone service objects
            $("#add-standalone-services-list li").each(function(index) {
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

            $.post("/admin/services/add-service-collection", service_coll, function(response)
            {
                if (response.hasError) {
                    showError(response.error, "#add-service-collection-error-msg");
                } else {
                    add_form[0].reset();
                    showSuccess("Added Service Collection successfully!", "#add-service-collection-error-msg");
                    $("#service-collection-container").empty();
                    showServiceCollections(SERVICE_COLLECTION_GET_URL, SERVICE_COLLECTION_WRAPPER);
                }
            })
        }
    })

    $("#edit-service-collection-btn").on("click", function(e){
        let service_collection_id = $("#edit-input-service-collections-id").val()
        let service_concern = $('#edit-input-service-concern').val()
        let service_title = $('#edit-input-service-title').val()
        let services_list = $("#edit-services-list")
        let service_obj = {}
        let services_arr = []
        let service_coll = {}
        let standalone_service_obj = {}
        let standalone_services_arr = []

        if (!service_concern) {
            e.preventDefault();
            showError("Please input a Service Concern", "#edit-service-collection-error-msg");
        } else if (!service_title) {
            e.preventDefault();
            showError("Please input a Service Title", "#edit-service-collection-error-msg");
        } else if (services_list.children().length == 0) {
            e.preventDefault();
            showError("Please add at least 1 service in the collection", "#edit-service-collection-error-msg");
        } else if (doesEditServiceCollHaveEmptyField()) {
            e.preventDefault();
            showError("Please fill in all service fields", "#edit-service-collection-error-msg");
        } else {
            e.preventDefault();
            // make service objects
            $("#edit-services-list li").each(function(index) {
                service_obj = {
                    serviceTitle: service_title,
                    serviceOption1: $(this).find('.input-service-option-1').val(),
                    serviceOption2: $(this).find('.input-service-option-2').val(),
                    price: $(this).find('.input-price').val(),
                }
                services_arr.push(service_obj)
            });

            // make standalone service objects
            $("#edit-standalone-services-list li").each(function(index) {
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
                id: service_collection_id,
                serviceConcern: service_concern,
                serviceTitle: service_title,
                services: services_arr,
                optionChoices1: optionChoices1,
                optionChoices2: optionChoices2,
                specialServices: standalone_services_arr
            }

            $.post("/admin/services/edit-service-collection", service_coll, function(response)
            {
                if (response.hasError) {
                    showError(response.error, "#edit-service-collection-error-msg");
                } else {
                    showSuccess("Added Service Collection successfully!", "#edit-service-collection-error-msg");
                    $("#service-collection-container").empty();
                    showServiceCollections(SERVICE_COLLECTION_GET_URL, SERVICE_COLLECTION_WRAPPER);
                }
            })
        }
    })

    $("#add-add-service").on("click", function(e){
        e.preventDefault()
        let $clone = $(`<li class="input-services">
                            <input class="form-control input-service-option-1" name="input-service-option-1" type="text" placeholder="Service Option 1">
                            <input class="form-control input-service-option-2" name="input-service-option-2" type="text" placeholder="Service Option 2">
                            <input class="form-control input-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $("#add-services-list").append($clone)
    })

    $("#add-add-standalone-service").on("click", function(e){
        e.preventDefault()
        let $clone = $(`<li class="input-standalone-services">
                            <input class="form-control input-standalone-service-option" name="input-service-option-1" type="text" placeholder="Service Option">
                            <input class="form-control input-standalone-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-standalone-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $("#add-standalone-services-list").append($clone)
    })

    $("#edit-add-service").on("click", function(e){
        e.preventDefault()
        let $clone = $(`<li class="input-services">
                            <input class="form-control input-service-option-1" name="input-service-option-1" type="text" placeholder="Service Option 1">
                            <input class="form-control input-service-option-2" name="input-service-option-2" type="text" placeholder="Service Option 2">
                            <input class="form-control input-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $("#edit-services-list").append($clone)
    })

    $("#edit-add-standalone-service").on("click", function(e){
        e.preventDefault()
        let $clone = $(`<li class="input-standalone-services">
                            <input class="form-control input-standalone-service-option" name="input-service-option-1" type="text" placeholder="Service Option">
                            <input class="form-control input-standalone-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-standalone-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $("#edit-standalone-services-list").append($clone)
    })

    $(document).on("click", ".delete-service", function(e){
        e.preventDefault()
        let toDelete = $(this).closest('.input-services')
        toDelete.remove()
    })

    $(document).on("click", ".delete-standalone-service", function(e){
        e.preventDefault()
        let toDelete = $(this).closest('.input-standalone-services')
        toDelete.remove()
    })

    $('#delete-service-collection-btn').on('click', function(e) {
        e.preventDefault()
        let serviceTitle = {serviceTitle: $(".service-title-info").first().text()};

        $.ajax({
            url:"/admin/services/delete-service-collection", 
            type: "POST",
            data: serviceTitle,
            success: function(response) {
                if (response.hasError) {
                    e.preventDefault();
                    showError(response.error, "#delete-service-collection-error-msg");
                } else {
                    e.preventDefault();
                    showSuccess("Deleted " + serviceTitle.serviceTitle + " successfully!", "#delete-service-collection-error-msg");
                    $("#service-collection-container").empty();
                    showServiceCollections(SERVICE_COLLECTION_GET_URL, SERVICE_COLLECTION_WRAPPER);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error deleting service collection:", errorThrown);
            }
        })
    });

    document.querySelectorAll("#add-service-collection-modal, #edit-service-collection-modal, #delete-service-collection-modal").forEach(modal => {
        modal.addEventListener("hidden.bs.modal", function () {
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
            document.querySelector(".services-list").innerHTML = "";
            document.querySelector("#add-services-list").innerHTML = `<li class="input-services">
                                                                        <input class="form-control input-service-option-1" name="input-service-option-1" type="text" placeholder="Service Option 1">
                                                                        <input class="form-control input-service-option-2" name="input-service-option-2" type="text" placeholder="Service Option 2">
                                                                        <input class="form-control input-price" name="input-price" type="number" placeholder="Price">
                                                                        <button type="button" class="delete-service"><i class="fa fa-trash-can"></i></button>
                                                                    </li>`
            document.querySelector(".standalone-services-list").innerHTML = "";
            document.querySelector("#add-standalone-services-list").innerHTML = `<li class="input-standalone-services">
                                                                                    <input class="form-control input-standalone-service-option" name="input-service-option-1" type="text" placeholder="Service Option">
                                                                                    <input class="form-control input-standalone-price" name="input-price" type="number" placeholder="Price">
                                                                                    <button type="button" class="delete-standalone-service"><i class="fa fa-trash-can"></i></button>
                                                                                </li>`
            document.querySelector("#service-collection-container").innerHTML = "";
            showServiceCollections(SERVICE_COLLECTION_GET_URL, SERVICE_COLLECTION_WRAPPER);
        });
    });
});

function showServiceCollections(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        data.forEach(sc => {
            let service_collection_preview_container = new Element(".service-collection-preview-container", {
                attr: {
                    "data-service-collection-id": sc._id
                }
            }).getElement();

            let service_collection_info_container = new Element(".service-collection-info-container").getElement();

            let service_title = new Element(".service-title", {
                text: sc.serviceTitle
            }).getElement();

            let service_option_tags_container = new Element(".service-option-tags-container").getElement();
            let option1_tags_container = new Element(".option1-tags-container").getElement();
            let option2_tags_container = new Element(".option2-tags-container").getElement();

            sc.optionChoices1Tags.forEach(tag => {
                let option1_tag = new Element(".option1-tag", {
                    text: tag
                }).getElement();
                option1_tags_container.append(option1_tag)
            });

            sc.optionChoices2Tags.forEach(tag => {
                let option2_tag = new Element(".option2-tag", {
                    text: tag
                }).getElement();
                option2_tags_container.append(option2_tag)
            });

            service_option_tags_container.append(option1_tags_container, option2_tags_container);

            service_collection_info_container.append(service_title, service_option_tags_container);

            let service_collection_controls_container = new Element(".service-collection-controls-container").getElement();

            let edit_btn = new Element("button.edit-btn", {
                text: "Edit",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#edit-service-collection-modal"
                }
            }).getElement();

            let edit_icon = new Element("i.fa.fa-edit").getElement();
            edit_btn.prepend(edit_icon);
            edit_btn.addEventListener("click", onBtnEditClick);

            let delete_btn = new Element("button.delete-btn", {
                text: "Delete",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#delete-service-collection-modal"
                }
            }).getElement();
            let delete_icon = new Element("i.fa.fa-trash-can").getElement();
            delete_btn.prepend(delete_icon);
            delete_btn.addEventListener("click", onBtnDeleteClick);

            service_collection_controls_container.append(edit_btn, delete_btn);

            service_collection_preview_container.append(service_collection_info_container, service_collection_controls_container);

            document.querySelector(container).append(service_collection_preview_container);
        });
    });
}

function onBtnEditClick (e) {
    let service_collection_id = e.currentTarget.closest(".service-collection-preview-container").getAttribute("data-service-collection-id");
    let modal_edit = document.getElementById("edit-service-collection-modal");
    let modal_edit_id = modal_edit.querySelector("#edit-input-service-collections-id");

    modal_edit_id.value = service_collection_id
    $.get("/admin/services/find-service-collection", {id:service_collection_id}, (data, status, xhr) => {

        document.querySelector('#edit-input-service-concern').value = data.serviceConcern
        document.querySelector('#edit-input-service-title').value = data.serviceTitle

        let services_list = document.querySelector("#edit-services-list")
        let standalone_services_list = document.querySelector("#edit-standalone-services-list")

        services_list.innerHTML = ''
        standalone_services_list.innerHTML = ''
        if (Array.isArray(data.services) && data.services.length !== 0 ) {
            data.services.forEach(service => {
                let input_services = new Element ("li.input-services").getElement()
                let input_service_option_1 = new Element ("input.form-control.input-service-option-1", {
                    attr: {
                        type: "text",
                        placeholder: "Service Option 1"
                    }
                }).getElement()
    
                input_service_option_1.value = service.serviceOption1
    
                let input_service_option_2 = new Element ("input.form-control.input-service-option-2", {
                    attr: {
                        type: "text",
                        placeholder: "Service Option 2"
                    }
                }).getElement()
    
                input_service_option_2.value = service.serviceOption2
    
                let input_price = new Element ("input.form-control.input-price", {
                    attr:{
                        type: "number",
                        placeholder: "Price"
                    }
                }).getElement()
    
                input_price.value = service.price
    
                let delete_service_button = new Element ("button.delete-service").getElement()
                let delete_service_icon = new Element ("i.fa.fa-trash-can").getElement()
                delete_service_button.append(delete_service_icon)
    
                input_services.append(input_service_option_1, input_service_option_2, input_price, delete_service_button)
                services_list.append(input_services)
            })
        }
        
        if (Array.isArray(data.specialServices) && data.specialServices.length !== 0) {
            data.specialServices.forEach(service => {
                let input_standalone_services = new Element ("li.input-standalone-services").getElement()
                let input_standalone_service_option = new Element ("input.form-control.input-standalone-service-option", {
                    attr: {
                        type: "text",
                        placeholder: "Service Option"
                    }
                }).getElement()

                input_standalone_service_option.value = service.serviceOption

                let input_standalone_price = new Element ("input.form-control.input-standalone-price", {
                    attr: {
                        type: "number",
                        placeholder: "Price"
                    }
                }).getElement()

                input_standalone_price.value = service.price

                let delete_service_button = new Element ("button.delete-standalone-service").getElement()
                let delete_service_icon = new Element ("i.fa.fa-trash-can").getElement()
                delete_service_button.append(delete_service_icon)

                input_standalone_services.append(input_standalone_service_option, input_standalone_price, delete_service_button)
                standalone_services_list.append(input_standalone_services)
            })
        }
    })
}