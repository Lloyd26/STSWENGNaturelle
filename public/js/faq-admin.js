import {showError, showSuccess} from "./form.js";
import {Element} from "./element.js";

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

$(document).ready(function(){
    showAllFAQS()

    $("#add-faq-btn").on("click", function(e){
        let add_form = $('#form-add-faq')
        let question = $('#input-question').val()
        let answer = $('#input-answer').val()

        if (!question) {
            e.preventDefault();
            showError("Please input a Question", "#add-faq-error-msg");
        } else if (!answer) {
            e.preventDefault();
            showError("Please input a Answer", "#add-faq-error-msg");
        } else {
            e.preventDefault();

            let faq = {
                question: question,
                answer: answer
            }

            $.post("/admin/faq/add-faq", faq, function(response)
            {
                if (response.hasError) {
                    showError(response.error, "#add-faq-error-msg");
                } else {
                    add_form[0].reset();
                    showSuccess("Added FAQ successfully!", "#add-faq-error-msg");
                    $("faq-collection-container").empty();
                    showAllFAQS();
                }
            })
        }
    })

    $("#edit-faq-btn").on("click", function(e){
        let question = $('#edit-input-question').val()
        let answer = $('#edit-input-answer').val()
        let id = $("#edit-input-faq-id").val()

        if (!question) {
            e.preventDefault();
            showError("Please input a Question", "#edit-faq-error-msg");
        } else if (!answer) {
            e.preventDefault();
            showError("Please input a Answer", "#edit-faq-error-msg");
        } else {
            e.preventDefault();

            let faq = {
                id: id,
                question: question,
                answer: answer
            }

            $.post("/admin/faq/edit-faq", faq, function(response)
            {
                if (response.hasError) {
                    showError(response.error, "#edit-faq-error-msg");
                } else {
                    showSuccess("Edited FAQ successfully!", "#edit-faq-error-msg");
                    $("faq-collection-container").empty();
                    showAllFAQS();
                }
            })
        }
    })

    $('#delete-faq-btn').on('click', function(e) {
        e.preventDefault()
        let id = {id: $("#delete-input-faq-id").val()};

        $.post("/admin/faq/delete-faq", id, function(response) {
            if (response.hasError) {
                e.preventDefault();
                showError(response.error, "#delete-faq-error-msg");
            } else {
                e.preventDefault();
                showSuccess("Deleted the FAQ successfully!", "#delete-faq-error-msg");
                $("faq-collection-container").empty();
                showAllFAQS();
            }
        })
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

            document.querySelector("#faq-collection-container").innerHTML = "";
            showAllFAQS()
        });
    });
})

function showAllFAQS (){
    $("#faq-collection-container").empty();
    let faq_collection_container = document.getElementById("faq-collection-container");
    $.get("/admin/faq/get-faqs", {}, (data, status, xhr) => {
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

            let edit_btn = new Element("button.edit-btn", {
                text: "Edit",
                attr: {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#edit-faq-modal"
                }
            }).getElement();

            let edit_icon = new Element("i.fa.fa-edit").getElement();
            edit_btn.prepend(edit_icon);
            edit_btn.addEventListener("click", onBtnEditClick);

            let delete_btn = new Element("button.delete-btn", {
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
    })
}