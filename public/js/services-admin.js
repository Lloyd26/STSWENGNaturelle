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

function hasEmptyField() {
    let doesTabularHaveEmpty = $(".services-list li input").filter(function() {
        return $(this).val() === '';
    })

    let doesStandaloneHaveEmpty = $(".standalone-services-list li input").filter(function() {
        return $(this).val() === '';
    })

    return doesTabularHaveEmpty.length > 0 || doesStandaloneHaveEmpty.length > 0
}

function onBtnDeleteClick (e) {
    e.preventDefault()
    let serviceTitle = $(this).parent().siblings().children().first().text();

    console.log(serviceTitle)
    $('.service-title-info').text(serviceTitle)
}
  

$(document).ready(function(){
    showServiceCollections(SERVICE_COLLECTION_GET_URL, SERVICE_COLLECTION_WRAPPER);

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
            e.preventDefault();
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

    $(".add-service").on("click", function(e){
        e.preventDefault()
        let $clone = $(`<li class="input-services">
                            <input class="form-control input-service-option-1" name="input-service-option-1" type="text" placeholder="Service Option 1">
                            <input class="form-control input-service-option-2" name="input-service-option-2" type="text" placeholder="Service Option 2">
                            <input class="form-control input-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $(".services-list").append($clone)
    })

    $(".add-standalone-service").on("click", function(e){
        e.preventDefault()
        let $clone = $(`<li class="input-standalone-services">
                            <input class="form-control input-standalone-service-option" name="input-service-option-1" type="text" placeholder="Service Option">
                            <input class="form-control input-standalone-price" name="input-price" type="number" placeholder="Price">
                            <button type="button" class="delete-standalone-service"><i class="fa fa-trash-can"></i></button>
                        </li>`)
        $(".standalone-services-list").append($clone)
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