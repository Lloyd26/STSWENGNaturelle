import {Element} from "./element.js";

$(document).ready(function(){

    $("#service-dropdown-bt").on("click", function(e) {
        
        let services_dropdown = document.querySelector("#services-dropdown-menu");
        services_dropdown.innerHTML = ""
        $.get("/services/getServiceConcerns", {}, (data, status, xhr) => {
            
            data.forEach(sc => {
                console.log(sc)
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
    
})