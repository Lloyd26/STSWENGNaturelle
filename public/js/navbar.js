import {Element} from "./element.js";


$(document).ready(function(){
    checkUnreadNotifs();

    $("#service-dropdown-bt").on("click", function(e) {
        
        let services_dropdown = document.querySelector("#services-dropdown-menu");
        services_dropdown.innerHTML = ""
        $.get("/services/getServiceConcerns", {}, (data, status, xhr) => {
            
            data.forEach(sc => {
                let service_link = new Element ("a.dropdown-item", {
                    text: sc,
                    attr: {
                        href: "/services/pages/" + sc
                    }
                }).getElement()

                let list_wrapper = new Element ("li").getElement()

                list_wrapper.append(service_link)
                services_dropdown.append(list_wrapper)
            })
        })
    })
    
    $("#nav-notifications").on("click", function(e){
        checkUnreadNotifs();
        let notification_dropdown = document.querySelector("#notification-dropdown-menu")
        notification_dropdown.innerHTML = ""

        $.get("/get-notifications", {}, (data, status, xhr) => {
            data.forEach(nt => {
                let notif_details_container = new Element ("li.dropdown-item.notif-details-container", {
                    attr: {
                        "data-bs-toggle": "modal",
                        "data-bs-target": "#notif-details-modal",
                        "data-notif-id": nt._id
                    }
                }).getElement()
                let notif_text_container = new Element (".notif-text-container").getElement()

                let notif_preview_body
                if (nt.type == "Registration"){
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Welcome to Salon Naturelle!"
                    }).getElement()
                } else if (nt.type == "Cancelled Appointment") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Reservation Cancelled"
                    }).getElement()
                } else if (nt.type == "Reservation Pending") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Reservation Pending"
                    }).getElement()
                } else if (nt.type == "Admin Set Pending") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Reservation Set to Pending"
                    }).getElement()
                } else if (nt.type == "Admin Set Approved") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Reservation Approved"
                    }).getElement()
                } else if (nt.type == "Admin Set Cancelled") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Reservation Cancelled"
                    }).getElement()
                } else if (nt.type == "Employee Set Approved") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Service Request Set to Pending"
                    }).getElement()
                } else if (nt.type == "Employee Set Pending") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Service Request Approved"
                    }).getElement()
                } else if (nt.type == "Employee Set Cancelled") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Service Request Cancelled"
                    }).getElement()
                } else if (nt.type == "Customer Set Cancelled") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "You Cancelled a Reservation"
                    }).getElement()
                }

                let time_lapsed = dayjs(nt.timestamp).fromNow()
                
                let notif_timestamp = new Element ("div.notif-timestamp", {
                    text: time_lapsed
                }).getElement()

                let read_indicator
                if(nt.isRead){
                    read_indicator = new Element ("i.fa.fa-circle.read", {
                    }).getElement()
                } else {
                    read_indicator = new Element ("i.fa.fa-circle", {
                    }).getElement()
                }
                
                
                notif_details_container.addEventListener("click", onNotifClick)
                notif_text_container.append(notif_preview_body, notif_timestamp)
                notif_details_container.append(read_indicator, notif_text_container)
                notification_dropdown.append(notif_details_container)
            })
        })
    })
})

function onNotifClick (e) {
    document.querySelector('#modal-reservation-details-container-notif').innerHTML = ""
    let notif_id = e.currentTarget.closest(".notif-details-container").getAttribute("data-notif-id");
    $.get("/find-notification", {id:notif_id}, (data, status, xhr) => {

        if (data.notif_details.type == "Admin Set Pending" || data.notif_details.type == "Admin Set Approved" ||
            data.notif_details.type == "Admin Set Cancelled" || data.notif_details.type == "Reservation Pending" ||
            data.notif_details.type == "Employee Set Cancelled" || data.notif_details.type == "Employee Set Pending" ||
            data.notif_details.type == "Employee Set Approved" || data.notif_details.type == "Customer Set Cancelled"){
            document.querySelector('#modal-notif-title').innerText = data.notif_details.title
            document.querySelector('#modal-notif-body').innerText = data.notif_details.body
            document.querySelector('#modal-notif-timestamp').innerText = dayjs(data.notif_details.timestamp).format('MMMM DD, YYYY, hh:mm A')
            document.querySelector('#modal-reservation-details-container-notif').style.display = "block"
            let reservation_details_container = document.querySelector('#modal-reservation-details-container-notif');
            
            let reason_label = new Element("#modal-status-reason-label", {
                text: ""
            }).getElement();

            let reason

            if (data.notif_details.type != "Reservation Pending" && data.notif_details.type != "Customer Set Cancelled"){
                reason_label = new Element("#modal-status-reason-label", {
                    text: "Reason for Status Change:"
                }).getElement();
                reason = new Element("#modal-status-reason", {
                    text: data.notif_details.reason
                }).getElement();
                reason_label.append(reason)
            }

            let services_label = new Element(".services-label-notif", {
                text: "Services"
            }).getElement();

            let services_container = new Element(".services-container-notif").getElement();
            let time_formatted = dayjs(data.reservation_details.timestamp).format('MMM DD, YYYY hh:mm A')
            let timestamp = new Element(".timestamp-notif", {
                text: time_formatted
            }).getElement();

            data.reservation_details.services.forEach(srv => {
                let reservation_details = new Element(".reservation-details-notif").getElement();

                let label_service_title = new Element("div.desc-notif",{
                    text: "Service Title: "
                }).getElement()
                let label_preferred_employee = new Element("div.desc-notif",{
                    text: "Preferred Employee: "
                }).getElement()
                let label_details = new Element("div.desc-notif",{
                    text: "Details: "
                }).getElement()
                let label_service_status = new Element("div.desc-notif",{
                    text: "Status: "
                }).getElement()

                let service_title = new Element(".service-title.detail-notif", {
                    text: srv.serviceTitle
                }).getElement();
                let preferred_employee = new Element(".preferred-employee.detail-notif", {
                    text: srv.preferredEmployee
                }).getElement();
                let details = new Element(".details.detail-notif", {
                    text: srv.details
                }).getElement();
                let service_status = new Element(".service_status.detail-notif", {
                    text: srv.status
                }).getElement();

                label_service_title.append(service_title)
                label_preferred_employee.append(preferred_employee)
                label_service_status.append(service_status)

                if (srv.details != "") {
                    label_details.append(details)
                    reservation_details.append(label_service_title, label_preferred_employee, label_details, label_service_status)
                } else {
                    reservation_details.append(label_service_title, label_preferred_employee, label_service_status)
                }
                services_container.append(reservation_details)
            });

            reservation_details_container.append(reason_label, timestamp, services_label, services_container)
        }
        else {
            document.querySelector('#modal-notif-title').innerText = data.notif_details.title
            document.querySelector('#modal-notif-body').innerText = data.notif_details.body
            document.querySelector('#modal-notif-timestamp').innerText = dayjs(data.notif_details.timestamp).format('MMMM DD, YYYY, hh:mm A')
            document.querySelector('#modal-reservation-details-container-notif').style.display = "none"
        }
    })
}

function checkUnreadNotifs (){

    $.get("/get-notifications", {}, (data, status, xhr) => {
        let count = 0
        data.forEach(nt => {
            if (!nt.isRead) {
              count++;
            }
        });

        console.log(count)

        let read_indicator = document.getElementById('read-indicator-on-btn')

        if (count > 0) {
            read_indicator.classList.remove('read')
        } else {
            read_indicator.classList.add('read')
        }
    })
}