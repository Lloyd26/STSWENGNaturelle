import {showError, showSuccess} from "./form.js";
import {Element} from "./element.js";
import {checkCache} from "./dataCache.js";

let faq_cache = [];

function onBtnDeleteClick (e) {
    e.preventDefault()
    let faq_id = e.currentTarget.closest(".faq-container").getAttribute("data-faq-id");
    let modal_delete_id = document.querySelector("#delete-input-faq-id");
    modal_delete_id.value = faq_id

    let question = e.currentTarget.closest(".faq-container").querySelector(".faq-question").textContent;
    let answer = e.currentTarget.closest(".faq-container").querySelector(".faq-answer").textContent;

    $('#delete-question').text(question)
    $('#delete-answer').text(answer)
}

$(document).ready(function() {
    showAllFAQS()

    $("#add-faq-btn").on("click", function(e){
        let add_form = $('#form-add-faq')
        let question = $('#input-question').val()
        let answer = $('#input-answer').val()

        if (!question) {
            e.preventDefault();
            showError("Please input a Question", "#add-faq-error-msg");
            return;
        } else if (!answer) {
            e.preventDefault();
            showError("Please input a Answer", "#add-faq-error-msg");
            return;
        }

        e.preventDefault();

        let btn_add = this.closest(".modal-content").querySelector(".btn-modal-success");
        btn_add.disabled = true;

        let btn_add_icon = btn_add.querySelector("i");
        btn_add_icon.className = "";
        btn_add_icon.classList.add("spinner-border", "me-2");

        let faq = {
            question: question,
            answer: answer
        }

        $.post("/admin/faq/add-faq", faq, (data, status, xhr) => {
            if (data.hasError) {
                showError(response.error, "#add-faq-error-msg");
            } else {
                btn_add_icon.className = "";
                btn_add_icon.classList.add("fa", "fa-plus");

                let employee_add_modal = this.closest("#add-faq-modal");
                bootstrap.Modal.getInstance(employee_add_modal).hide();
                btn_add.disabled = false;

                add_form[0].reset();
                snackbar({
                    type: "primary",
                    text: "Employee has been successfully added!"
                });
            }
        }).fail(function(res) {
            btn_add_icon.className = "";
            btn_add_icon.classList.add("fa", "fa-plus");

            let employee_add_modal = document.querySelector("#add-faq-modal");
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
                    text: "Error: Something went wrong while trying to edit the FAQ.",
                    duration: "long"
                });
            }
        });
    });

    $("#form-edit-faq").on("submit", function(e){
        let question = $('#edit-input-question').val()
        let answer = $('#edit-input-answer').val()
        let id = $("#edit-input-faq-id").val()

        if (!question) {
            e.preventDefault();
            showError("Please input a question", "#edit-faq-error-msg");
            return;
        } else if (!answer) {
            e.preventDefault();
            showError("Please input an answer", "#edit-faq-error-msg");
            return;
        }

        e.preventDefault();

        let btn_edit = this.closest(".modal-content").querySelector(".btn-modal-success");
        btn_edit.disabled = true;

        let btn_edit_icon = btn_edit.querySelector("i");
        btn_edit_icon.className = "";
        btn_edit_icon.classList.add("spinner-border", "me-2");

        let faq = {
            id: id,
            question: question,
            answer: answer
        }

        $.post("/admin/faq/edit-faq", faq, (data, status, xhr) => {
            if (data.hasError) {
                showError(response.error, "#edit-faq-error-msg");
            } else {
                btn_edit_icon.className = "";
                btn_edit_icon.classList.add("fa", "fa-edit");

                let faq_edit_modal = this.closest("#edit-faq-modal");
                bootstrap.Modal.getInstance(faq_edit_modal).hide();

                btn_edit.disabled = false;

                snackbar({
                    type: "primary",
                    text: "FAQ has been successfully edited!"
                });
            }
        }).fail(function(res) {
            btn_edit_icon.className = "";
            btn_edit_icon.classList.add("fa", "fa-edit");

            let faq_edit_modal = document.querySelector("#edit-faq-modal");
            bootstrap.Modal.getInstance(faq_edit_modal).hide();

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
                    text: "Error: Something went wrong while trying to edit the FAQ.",
                    duration: "long"
                });
            }
        });
    });

    $('#delete-faq-modal .btn-delete').on('click', function(e) {
        e.preventDefault()
        let id = {id: $("#delete-input-faq-id").val()};

        let btn_delete = this.closest(".modal-content").querySelector(".btn-delete");
        btn_delete.disabled = true;

        let btn_delete_icon = btn_delete.querySelector("i");
        btn_delete_icon.className = "";
        btn_delete_icon.classList.add("spinner-border", "me-2");

        $.post("/admin/faq/delete-faq", id, (data, status, xhr) => {
            if (data.hasError) {
                showError(response.error, "#delete-faq-error-msg");
            } else {
                btn_delete_icon.className = "";
                btn_delete_icon.classList.add("fa", "fa-trash");

                let faq_delete_modal = this.closest("#delete-faq-modal");
                bootstrap.Modal.getInstance(faq_delete_modal).hide();
                btn_delete.disabled = false;
                snackbar({
                    type: "primary",
                    text: "FAQ has been successfully deleted!"
                });
            }
        }).fail(function(res) {
            btn_delete_icon.className = "";
            btn_delete_icon.classList.add("fa", "fa-trash");

            let faq_delete_modal = document.querySelector("#delete-faq-modal");
            bootstrap.Modal.getInstance(faq_delete_modal).hide();
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
                    text: "Error: Something went wrong while trying to delete the FAQ.",
                    duration: "long"
                });
            }
        });
    });

    document.querySelectorAll("#add-faq-modal, #edit-faq-modal, #delete-faq-modal").forEach(modal => {
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

            showAllFAQS()
        });
    });
})

function showAllFAQS (){
    $.get("/admin/faq/get-faqs", {}, (data, status, xhr) => {
        if (checkCache(data, faq_cache)) return;

        $("#faq-collection-container").empty();
        let faq_collection_container = document.getElementById("faq-collection-container");

        data.forEach(faq => {
            let faq_container = new Element (".faq-container", {
                attr: {
                    "data-faq-id": faq._id
                }
            }).getElement()
            let faq_information_container = new Element(".faq-information-container").getElement()
            let faq_controls_container = new Element(".faq-controls-container").getElement()

            let faq_question = new Element(".faq-question", {
                text: "Q: "+ faq.question
            }).getElement()

            let faq_answer = new Element(".faq-answer", {
                text: "A: " + faq.answer
            }).getElement()

            let edit_btn = new Element("button.btn.admin-list-btn-edit", {
                text: "Edit",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#edit-faq-modal"
                }
            }).getElement();

            let edit_icon = new Element("i.fa.fa-edit").getElement();
            edit_btn.prepend(edit_icon);
            edit_btn.addEventListener("click", onBtnEditClick);

            let delete_btn = new Element("button.btn.admin-list-btn-delete", {
                text: "Delete",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#delete-faq-modal"
                }
            }).getElement();
            let delete_icon = new Element("i.fa.fa-trash-can").getElement();
            delete_btn.prepend(delete_icon);
            delete_btn.addEventListener("click", onBtnDeleteClick);

            faq_controls_container.append(edit_btn, delete_btn)
            faq_information_container.append(faq_question, faq_answer)
            faq_container.append(faq_information_container, faq_controls_container)
            faq_collection_container.append(faq_container)
        })
    })
}

function onBtnEditClick (e) {
    let faq_id = e.currentTarget.closest(".faq-container").getAttribute("data-faq-id");
    let modal_edit = document.getElementById("edit-faq-modal");
    let modal_edit_id = modal_edit.querySelector("#edit-input-faq-id");

    modal_edit_id.value = faq_id

    $.get("/admin/faq/find-faq", {id:faq_id}, (data, status, xhr) => {
        document.querySelector('#edit-input-question').value = data.question
        document.querySelector('#edit-input-answer').value = data.answer
    }).fail(function(res) {
        bootstrap.Modal.getInstance(modal_edit).hide();

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
                text: "Error: Something went wrong while trying to fetch the FAQ.",
                duration: "long"
            });
        }
    });
}