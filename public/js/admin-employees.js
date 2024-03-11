import {isContactNumValid, isEmailValid, showError, validateForm} from "./form.js";
import {Element} from "./element.js";
import {checkCache} from "./dataCache.js";

const EMPLOYEE_GET_URL = "/admin/employees/get";
const EMPLOYEES_WRAPPER = "#admin-employees-wrapper";

let employee_cache = [];

function onBtnEditClick(e) {
    let employee_id = e.currentTarget.closest(".admin-employees-container").getAttribute("data-employee-id");
    let employee_fname = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-fname").textContent;
    let employee_lname = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-lname").textContent;
    let employee_email = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-email").textContent;
    let employee_contact = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-contact").textContent;

    let modal_edit = document.getElementById("modal-employee-edit");
    let modal_edit_id = modal_edit.querySelector("#input-edit-employee-id");
    let modal_edit_fname = modal_edit.querySelector("#input-edit-employee-fname");
    let modal_edit_lname = modal_edit.querySelector("#input-edit-employee-lname");
    let modal_edit_email = modal_edit.querySelector("#input-edit-employee-email");
    let modal_edit_contact = modal_edit.querySelector("#input-edit-employee-contact");

    modal_edit_id.value = employee_id;
    modal_edit_fname.value = employee_fname;
    modal_edit_lname.value = employee_lname;
    modal_edit_email.value = employee_email;
    modal_edit_contact.value = employee_contact;
}

function onBtnDeleteClick(e) {
    let employee_id = e.currentTarget.closest(".admin-employees-container").getAttribute("data-employee-id");
    let employee_fname = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-fname").textContent;
    let employee_lname = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-lname").textContent;
    let employee_email = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-email").textContent;
    let employee_contact = e.currentTarget.closest(".admin-employees-container").querySelector(".employee-contact").textContent;

    let modal_delete = document.getElementById("modal-employee-delete");
    let modal_delete_id = modal_delete.querySelector("#input-delete-employee-id");
    let modal_delete_fname = modal_delete.querySelector("#input-delete-employee-fname");
    let modal_delete_lname = modal_delete.querySelector("#input-delete-employee-lname");
    let modal_delete_email = modal_delete.querySelector("#input-delete-employee-email");
    let modal_delete_contact = modal_delete.querySelector("#input-delete-employee-contact");

    modal_delete_id.value = employee_id;
    modal_delete_fname.value = employee_fname;
    modal_delete_lname.value = employee_lname;
    modal_delete_email.value = employee_email;
    modal_delete_contact.value = employee_contact;
}

function onBtnPasswordClick(e) {
    let employee_id = e.currentTarget.closest(".admin-employees-container").getAttribute("data-employee-id");

    $.get("/employee/request-temp-password", {id:employee_id}, (data, status, xhr) => {
        let modal_temp_pass = document.getElementById("modal-employee-req-pass");
        let modal_input_temp_pass = modal_temp_pass.querySelector("#input-temporary-password");

        modal_input_temp_pass.value = data.password
    })
}

document.addEventListener("DOMContentLoaded", function() {
    showEmployees(EMPLOYEE_GET_URL, EMPLOYEES_WRAPPER);

    document.getElementById("input-employee-search").addEventListener("keyup", function() {
        let filter = this.value.toUpperCase();

        let admin_employees_containers = document.getElementsByClassName("admin-employees-container");
        Array.from(admin_employees_containers).forEach(a_e_c => {
            if (a_e_c.querySelector(".employee-name").textContent.toUpperCase().indexOf(filter) > -1) {
                a_e_c.style.display = "";
            } else {
                a_e_c.style.display = "none";
            }
        });
    });

    document.querySelectorAll(".btn-employee-edit").forEach(btn_edit => {
        btn_edit.addEventListener("click", onBtnEditClick);
    });

    document.querySelectorAll(".btn-employee-delete").forEach(btn_delete => {
        btn_delete.addEventListener("click", onBtnDeleteClick);
    });

    document.querySelector("#form-employee-add").addEventListener("submit", function(e) {
        let input_fname = document.getElementById("input-add-employee-fname");
        let input_lname = document.getElementById("input-add-employee-lname");
        let input_email = document.getElementById("input-add-employee-email");
        let input_contact = document.getElementById("input-add-employee-contact");

        let error_container = "#form-employee-add-error";

        if (!validateForm(input_fname, input_lname, input_email, input_contact)) {
            e.preventDefault();
            showError("Please fill in all fields.", error_container);
            return;
        } else if (!isEmailValid(input_email.value)) {
            e.preventDefault();
            showError("Please enter a valid email address!", error_container);
            input_email.classList.add("is-invalid");
            input_email.focus();
            return;
        } else if (!isContactNumValid(input_contact.value)) {
            e.preventDefault();
            showError("Please follow the contact number format: 09XXXXXXXXX", error_container);
            input_contact.classList.add("is-invalid");
            input_contact.focus();
            return;
        }

        e.preventDefault();

        let btn_add = this.closest(".modal-content").querySelector(".btn-modal-success");
        btn_add.disabled = true;

        let btn_add_icon = btn_add.querySelector("i");
        btn_add_icon.className = "";
        btn_add_icon.classList.add("spinner-border", "me-2");

        $.post("/admin/employees/add", {
            employee_fname: input_fname.value,
            employee_lname: input_lname.value,
            employee_email: input_email.value,
            employee_contact: input_contact.value
        }, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                btn_add_icon.className = "";
                btn_add_icon.classList.add("fa", "fa-plus");

                let employee_add_modal = this.closest("#modal-employee-add");
                bootstrap.Modal.getInstance(employee_add_modal).hide();
                btn_add.disabled = false;
                snackbar({
                    type: "primary",
                    text: "Employee has been successfully added!"
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while adding an employee.",
                    duration: "long"
                });
            }
        }).fail(function(res) {
            btn_add_icon.className = "";
            btn_add_icon.classList.add("fa", "fa-plus");

            let employee_add_modal = document.querySelector("#modal-employee-add");
            bootstrap.Modal.getInstance(employee_add_modal).hide();
            btn_add.disabled = false;

            if (res.status === 403) {
                snackbar({
                    type: "error",
                    text: "Error: You are not logged in as an admin.",
                    duration: "long",
                    action: {
                        text: "LOGIN",
                        link: "/admin?next=" + window.location.pathname
                    }
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while adding an employee.",
                    duration: "long"
                });
            }
        });
    });

    document.querySelector("#form-employee-edit").addEventListener("submit", function(e) {
        let input_employee_id = document.getElementById("input-edit-employee-id");
        let input_fname = document.getElementById("input-edit-employee-fname");
        let input_lname = document.getElementById("input-edit-employee-lname");
        let input_email = document.getElementById("input-edit-employee-email");
        let input_contact = document.getElementById("input-edit-employee-contact");

        let error_container = "#form-employee-edit-error";

        if (!validateForm(input_fname, input_lname, input_email, input_contact)) {
            e.preventDefault();
            showError("Please fill in all fields.", error_container);
            return;
        } else if (!isEmailValid(input_email.value)) {
            e.preventDefault();
            showError("Please enter a valid email address!", error_container);
            input_email.classList.add("is-invalid");
            input_email.focus();
            return;
        } else if (!isContactNumValid(input_contact.value)) {
            e.preventDefault();
            showError("Please follow the contact number format: 09XXXXXXXXX", error_container);
            input_contact.classList.add("is-invalid");
            input_contact.focus();
            return;
        }

        e.preventDefault();

        let btn_edit = this.closest(".modal-content").querySelector(".btn-modal-success");
        btn_edit.disabled = true;

        let btn_edit_icon = btn_edit.querySelector("i");
        btn_edit_icon.className = "";
        btn_edit_icon.classList.add("spinner-border", "me-2");

        $.post("/admin/employees/edit", {
            employee_id: input_employee_id.value,
            employee_fname: input_fname.value,
            employee_lname: input_lname.value,
            employee_email: input_email.value,
            employee_contact: input_contact.value
        }, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                btn_edit_icon.className = "";
                btn_edit_icon.classList.add("fa", "fa-edit");

                let employee_edit_modal = this.closest("#modal-employee-edit");
                bootstrap.Modal.getInstance(employee_edit_modal).hide();

                btn_edit.disabled = false;
                snackbar({
                    type: "primary",
                    text: "Employee has been successfully edited!"
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while editing the employee.",
                    duration: "long"
                });
            }
        }).fail(function(res) {
            btn_edit_icon.className = "";
            btn_edit_icon.classList.add("fa", "fa-edit");

            let employee_edit_modal = document.querySelector("#modal-employee-edit");
            bootstrap.Modal.getInstance(employee_edit_modal).hide();

            btn_edit.disabled = false;

            if (res.status === 403) {
                snackbar({
                    type: "error",
                    text: "Error: You are not logged in as an admin.",
                    duration: "long",
                    action: {
                        text: "LOGIN",
                        link: "/admin?next=" + window.location.pathname
                    }
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while editing the employee.",
                    duration: "long"
                });
            }
        });
    });

    document.querySelector("#modal-employee-delete .btn-delete").addEventListener("click", function(e) {
        let input_employee_id = document.getElementById("input-delete-employee-id");
        let input_fname = document.getElementById("input-delete-employee-fname");
        let input_lname = document.getElementById("input-delete-employee-lname");
        let input_email = document.getElementById("input-delete-employee-email");
        let input_contact = document.getElementById("input-delete-employee-contact");

        e.preventDefault();

        let btn_delete = this.closest(".modal-content").querySelector(".btn-delete");
        btn_delete.disabled = true;

        let btn_delete_icon = btn_delete.querySelector("i");
        btn_delete_icon.className = "";
        btn_delete_icon.classList.add("spinner-border", "me-2");

        $.post("/admin/employees/delete", {
            employee_id: input_employee_id.value,
            employee_fname: input_fname.value,
            employee_lname: input_lname.value,
            employee_email: input_email.value,
            employee_contact: input_contact.value
        }, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                btn_delete_icon.className = "";
                btn_delete_icon.classList.add("fa", "fa-trash");

                let employee_delete_modal = this.closest("#modal-employee-delete");
                bootstrap.Modal.getInstance(employee_delete_modal).hide();
                btn_delete.disabled = false;
                snackbar({
                    type: "primary",
                    text: "Employee has been successfully deleted!"
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while deleting the employee.",
                    duration: "long"
                });
            }
        }).fail(function(res) {
            btn_delete_icon.className = "";
            btn_delete_icon.classList.add("fa", "fa-trash");

            let employee_delete_modal = document.querySelector("#modal-employee-delete");
            bootstrap.Modal.getInstance(employee_delete_modal).hide();
            btn_delete.disabled = false;

            if (res.status === 403) {
                snackbar({
                    type: "error",
                    text: "Error: You are not logged in as an admin.",
                    duration: "long",
                    action: {
                        text: "LOGIN",
                        link: "/admin?next=" + window.location.pathname
                    }
                });
            } else {
                snackbar({
                    type: "error",
                    text: "Error: Something went wrong while deleting the employee.",
                    duration: "long"
                });
            }
        });
    })

    document.querySelectorAll("#modal-employee-add, #modal-employee-edit, #modal-employee-delete").forEach(modal => {
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

            showEmployees(EMPLOYEE_GET_URL, EMPLOYEES_WRAPPER);
        });
    });
});

function showEmployees(url, container) {
    $.get(url, {}, (data, status, xhr) => {
        if (checkCache(data, employee_cache)) return;
        document.querySelector(container).innerHTML = "";

        data.forEach(employee => {
            let admin_employees_container = new Element(".admin-employees-container", {
                attr: {
                    "data-employee-id": employee._id
                }
            }).getElement();

            let admin_employees_details = new Element(".admin-employees-details").getElement();

            let employee_name = new Element("h4.employee-name").getElement();
            let employee_fname = new Element("span.employee-fname", {
                text: employee.firstName
            }).getElement();
            let employee_lname = new Element("span.employee-lname", {
                text: employee.lastName
            }).getElement();
            employee_name.append(employee_fname, employee_lname);

            let employee_email_container = new Element("p.employee-email").getElement();
            let email_icon = new Element("i.fa.fa-envelope").getElement();
            let employee_email = new Element("span", {
                text: employee.email
            }).getElement();
            employee_email_container.append(email_icon, employee_email);

            let employee_contact_container = new Element("p.employee-contact").getElement();
            let contact_icon = new Element("i.fa.fa-phone").getElement();
            let employee_contact = new Element("span", {
                text: employee.contactNumber
            }).getElement();
            employee_contact_container.append(contact_icon, employee_contact);


            admin_employees_details.append(employee_name, employee_email_container, employee_contact_container);
        
            
            let admin_employees_actions = new Element(".admin-employees-actions").getElement();

            if (!employee.changedPassword){
                let btn_employee_password = new Element("button.btn.admin-list-btn-password", {
                    text: "Check Password",
                    attr: {
                        "data-bs-toggle": "modal",
                        "data-bs-target": "#modal-employee-req-pass"
                    }
                }).getElement();
                let eye_icon = new Element("i.fa.fa-eye").getElement();
                btn_employee_password.prepend(eye_icon);
                btn_employee_password.addEventListener("click", onBtnPasswordClick);
                admin_employees_actions.append(btn_employee_password);
            }

            let btn_employee_edit = new Element("button.btn.admin-list-btn-edit", {
                text: "Edit",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#modal-employee-edit"
                }
            }).getElement();
            let edit_icon = new Element("i.fa.fa-edit").getElement();
            btn_employee_edit.prepend(edit_icon);
            btn_employee_edit.addEventListener("click", onBtnEditClick);

            let btn_employee_delete = new Element("button.btn.admin-list-btn-delete", {
                text: "Delete",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#modal-employee-delete"
                }
            }).getElement();
            let delete_icon = new Element("i.fa.fa-trash").getElement();
            btn_employee_delete.prepend(delete_icon);
            btn_employee_delete.addEventListener("click", onBtnDeleteClick);

            

            admin_employees_actions.append(btn_employee_edit, btn_employee_delete);

            admin_employees_container.append(admin_employees_details, admin_employees_actions);

            document.querySelector(container).append(admin_employees_container);
        });
    });
}