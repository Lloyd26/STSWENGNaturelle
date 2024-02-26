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
                        text: "Your reservation has been cancelled."
                    }).getElement()
                } else if (nt.type == "Reservation Pending") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Reservation Pending"
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
    let notif_id = e.currentTarget.closest(".notif-details-container").getAttribute("data-notif-id");
    $.get("/find-notification", {id:notif_id}, (data, status, xhr) => {
        document.querySelector('#modal-notif-title').innerText = data.title
        document.querySelector('#modal-notif-body').innerText = data.body
        document.querySelector('#modal-notif-timestamp').innerText = dayjs(data.timestamp).format('MMMM DD, YYYY, hh:mm A')
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