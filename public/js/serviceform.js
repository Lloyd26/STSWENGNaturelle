import {showError, showSuccess} from "./form.js";
import {addToCart} from "./cart.js";
import {Element} from "./element.js";

const EMPLOYEES_URL = "/api/employees";
const EMPLOYEES_CONTAINER = "#input-staff";

const SERVICES_URL = "/api/services";
const SERVICES_CONTAINER = "#input-service";

let cached_employees = [];

$(document).ready(function(){
    refreshEmployeesMenu(EMPLOYEES_URL, EMPLOYEES_CONTAINER);
    refreshServicesMenu(SERVICES_URL, SERVICES_CONTAINER);

    $("#form-service").on("submit", function(e) {
        let service_val = $('#input-service').val()
        let staff_val = $('#input-staff').val()
        let details_val = $('#input-details').val()

        if ($('#input-service').prop('disabled')) {
            e.preventDefault();
            showError("Select a valid reservation date first.", "#add-error-msg");
        } else if (!service_val) {
            e.preventDefault();
            showError("Please select an service to put in the cart.", "#add-error-msg");
        } else if (!staff_val) {
            e.preventDefault();
            showError("Please select a valid Preferred Staff option.", "#add-error-msg");
        } else {
            e.preventDefault();
            // showSuccess("Added to cart successfully!", "#add-error-msg");

            let service_select = document.getElementById("input-service");
            let staff_select = document.getElementById("input-staff");

            let service = service_select.options[service_select.selectedIndex].text;
            let serviceGroupName = service_select.options[service_select.selectedIndex].closest("optgroup").label;

            let staff = staff_select.options[staff_select.selectedIndex].text;
            addToCart(serviceGroupName, service, staff, details_val);

            snackbar({
                type: "primary",
                text: "Service added to cart successfully."
            });
        }
    });
});

function refreshServicesMenu(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        if (status === "success" && xhr.status === 200) {
            let input_service = document.querySelector(container);
            input_service.innerHTML = "";

            let choose_service = new Element("option", {
                text: "Choose a Service",
                attr: {
                    "selected": "",
                    "disabled": "",
                    "hidden": ""
                }
            }).getElement();
            input_service.appendChild(choose_service);

            let tempSpecialServicesId = [];

            data.specialServices.forEach(specialService => {
                tempSpecialServicesId.push(specialService);
            })

            let lastServiceGroup = "";
            let service_optgroup;
            data.services.forEach(service => {
                if (lastServiceGroup !== service.serviceTitle) {
                    if (lastServiceGroup !== "") input_service.appendChild(service_optgroup);
                    lastServiceGroup = service.serviceTitle;
                    service_optgroup = new Element("optgroup", {
                        attr: {
                            "label": service.serviceTitle
                        }
                    }).getElement();
                }

                for (let i in tempSpecialServicesId) {
                    if (lastServiceGroup === tempSpecialServicesId[i].serviceTitle) {
                        let special_service_option = new Element("option", {
                            text: tempSpecialServicesId[i].serviceOption,
                            attr: {
                                "value": tempSpecialServicesId[i]._id,
                                "data-service-price": tempSpecialServicesId[i].price,
                                "data-service-type": "1"
                            }
                        }).getElement();
                        service_optgroup.appendChild(special_service_option);
                        tempSpecialServicesId.splice(Number(i), 1);
                    }
                }

                let service_option = new Element("option", {
                    text: service.serviceOption1 + ": " + service.serviceOption2,
                    attr: {
                        "value": service._id,
                        "data-service-price": service.price,
                        "data-service-type": "0"
                    }
                }).getElement();
                service_optgroup.appendChild(service_option);
            })
        }
    })
}

function refreshEmployeesMenu(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        if (status === "success" && xhr.status === 200) {
            let input_staff = document.querySelector(container);
            input_staff.innerHTML = "";

            let choose_staff = new Element("option", {
                text: "Choose a Staff",
                attr: {
                    "selected": "",
                    "disabled": "",
                    "hidden": ""
                }
            }).getElement();
            input_staff.appendChild(choose_staff);

            let no_preference = new Element("option", {
                text: "No preference",
                attr: {
                    "value": "0"
                }
            }).getElement();
            input_staff.appendChild(no_preference);

            data.forEach(employee => {
                let employee_option = new Element("option", {
                    text: employee.firstName + " " + employee.lastName,
                    attr: {
                        "value": employee._id
                    }
                }).getElement();
                input_staff.appendChild(employee_option);
            });
        }
    });
}