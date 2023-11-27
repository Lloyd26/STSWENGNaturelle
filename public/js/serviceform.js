import {showError, showSuccess} from "./form.js";
import {addToCart} from "./cart.js";
import {Element} from "./element.js";

const EMPLOYEES_URL = "/api/employees";
const EMPLOYEES_CONTAINER = "#input-staff";

let cached_employees = [];

$(document).ready(function(){
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
            let staff = staff_select.options[staff_select.selectedIndex].text;
            addToCart(service, staff, details_val);

            snackbar({
                type: "primary",
                text: "Service added to cart successfully."
            });

            refreshEmployeesMenu(EMPLOYEES_URL, EMPLOYEES_CONTAINER);
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    refreshEmployeesMenu(EMPLOYEES_URL, EMPLOYEES_CONTAINER);
});

function checkCache(data, cached_data) {
    if (cached_data.length === 0) {
        data.forEach(d => cached_data.push(d._id));
        return true;
    }

    let temp_data = [];
    data.forEach(d => temp_data.push(d._id));

    for (let i in cached_data) {
        if (cached_data[i] !== temp_data[i]) {
            return true;
        }
    }

    return false;
}

function refreshEmployeesMenu(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        if (status === "success" && xhr.status === 200) {
            if (!checkCache(data, cached_employees)) {
                return;
            }

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