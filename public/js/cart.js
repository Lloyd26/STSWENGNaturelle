import {Element} from "./element.js";

export function setCartDateTime(date, time) {
    document.getElementById("date-detail").innerText = date;
    document.getElementById("time-detail").innerText = time;
}

export function addToCart(serviceGroup, service, staff, details) {
    let cart_item = new Element(".cart-item").getElement();

    let cart_service_details = new Element(".cart-service-details").getElement();

    let cart_service = new Element(".cart-service").getElement();

    let cart_servicegroup_name = new Element(".cart-servicegroup-name", {
        text: serviceGroup
    }).getElement();

    let cart_service_name = new Element(".cart-service-name", {
        text: service
    }).getElement();

    cart_service.append(cart_servicegroup_name, cart_service_name);

    let preferred_staff_container = new Element("div").getElement();

    let preferred_staff = new Element("span", {
        text: "Preferred Staff:"
    }).getElement()

    let cart_staff_name = new Element("span.cart-staff-name", {
        text: staff
    }).getElement();

    preferred_staff_container.append(preferred_staff, cart_staff_name);

    let cart_other_details = new Element(".cart-other-details", {
        text: details
    }).getElement();

    cart_service_details.append(cart_service, preferred_staff_container, cart_other_details);

    let cart_price_label = new Element(".cart-price-label").getElement();

    let cart_price_currency = new Element("span.cart-price-currency", {
        text: "₱"
    }).getElement();

    let cart_price_value = new Element("span.cart-price-value", {
        text: "500.00"
    }).getElement();

    let edit_btn_container = new Element(".edit-btn-container").getElement();

    let edit_btn_add = new Element("button.btn.edit.add-btn", {
        text: "+"
    }).getElement();

    let edit_btn_remove = new Element("button.btn.edit.remove-btn", {
        text: "-"
    }).getElement();

    edit_btn_container.append(edit_btn_add, edit_btn_remove);

    cart_item.append(cart_service_details, cart_price_label, edit_btn_container);

    document.getElementById("services-container").appendChild(cart_item);
}