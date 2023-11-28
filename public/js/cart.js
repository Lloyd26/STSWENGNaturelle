import {Element} from "./element.js";
import {formatPrice} from "./nFormatter.js";

export function setCartDateTime(date, time) {
    document.getElementById("date-detail").innerText = date;
    document.getElementById("time-detail").innerText = time;
}

export function addToCart(serviceGroup, service, staff, details, price) {
    let cart_item = new Element(".cart-item", {
        attr: {
            "data-service-price": price
        }
    }).getElement();

    let cart_header = new Element(".cart-header").getElement();

    let cart_servicegroup_name = new Element(".cart-servicegroup-name", {
        text: serviceGroup
    }).getElement();

    let cart_delete_button = new Element("button.btn.btn-cart-delete").getElement();
    let cart_delete_icon = new Element("i.fa.fa-xmark").getElement();
    cart_delete_button.appendChild(cart_delete_icon);
    cart_delete_button.addEventListener("click", removeFromCart);

    cart_header.append(cart_servicegroup_name, cart_delete_button);

    let cart_service_details = new Element(".cart-service-details").getElement();

    let cart_service = new Element(".cart-service").getElement();

    let cart_service_name = new Element(".cart-service-name", {
        text: service
    }).getElement();

    let cart_service_price = new Element("span.cart-service-price", {
        text: "(₱" + formatPrice(price) + ")"
    }).getElement();
    cart_service_name.appendChild(cart_service_price);

    cart_service.append(cart_service_name);

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

    /*let edit_btn_container = new Element(".edit-btn-container").getElement();

    let edit_btn_add = new Element("button.btn.edit.add-btn", {
        text: "+"
    }).getElement();

    let edit_btn_remove = new Element("button.btn.edit.remove-btn", {
        text: "-"
    }).getElement();

    edit_btn_container.append(edit_btn_add, edit_btn_remove);*/

    cart_item.append(cart_header, cart_service_details);

    document.getElementById("services-container").appendChild(cart_item);

    updatePrice("add", price);
}

function removeFromCart(e) {
    let cart_item = e.currentTarget.closest(".cart-item");
    updatePrice("subtract", cart_item.getAttribute("data-service-price"));
    cart_item.remove();
}

function updatePrice(mode, price) {
    let price_element = document.getElementById("total-price-value");
    let price_value = price_element.getAttribute("data-price-value");

    let newPrice = 0;

    switch (mode) {
        case "add":
            newPrice = Number(price_value) + Number(price);
            break;
        case "subtract":
            newPrice = Number(price_value) - Number(price);
            break;
        case "set":
            newPrice = price;
    }

    price_element.textContent = formatPrice(newPrice);
    price_element.setAttribute("data-price-value", String(newPrice));
}

function clearCart() {
    document.querySelector("#services-container").innerHTML = "";
    updatePrice("set", 0);
    snackbar({
        type: "primary",
        text: "Your cart has been reset."
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#btn-reset").addEventListener("click", clearCart);
});