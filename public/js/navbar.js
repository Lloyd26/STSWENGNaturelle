import {Element} from "./element.js";


$(document).ready(function(){

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
        let notification_dropdown = document.querySelector("#notification-dropdown-menu")
        notification_dropdown.innerHTML = ""

        $.get("/get-notifications", {}, (data, status, xhr) => {
            data.forEach(nt => {
                let notif_details_container = new Element ("li.dropdown-item").getElement()
                let notif_text_container = new Element (".notif-text-container").getElement()
                let notif_id = new Element ("input.form-control.notif-id", {
                    attr: {
                        type: "hidden"
                    },
                    value: nt._id
                }).getElement()

                let notif_preview_body
                if (nt.type == "Registration"){
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Welcome to Salon Naturelle!"
                    }).getElement()
                } else if (nt.type == "Cancelled Appointment") {
                    notif_preview_body = new Element ("div.notif-preview-body", {
                        text: "Your reservation has been cancelled."
                    }).getElement()
                }

                let time_lapsed = dayjs(nt.timestamp).fromNow()
                
                let notif_timestamp = new Element ("div.notif-timestamp", {
                    text: time_lapsed
                }).getElement()
                let read_indicator = new Element ("i.fa.fa-circle", {
                }).getElement()

                notif_text_container.append(notif_preview_body, notif_timestamp)
                notif_details_container.append(notif_id,  read_indicator, notif_text_container)
                notification_dropdown.append(notif_details_container)
            })
        })
    })
})