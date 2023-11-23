export class Element {

    el;

    constructor(element, properties) {
        this.tagName = "div";
        this.id = "";
        this.classList = [];

        // "element"
        if (element.indexOf("#") === -1 && element.indexOf(".") === -1) {
            this.tagName = element;
        }

        // "element#id"
        if (element.indexOf("#") > -1 && element.indexOf(".") === -1) {
            this.tagName = element.indexOf("#") === 0 ? "div" : element.split("#")[0];
            this.id = element.split("#")[1];
        }

        // "element#id.class1.class2"
        else if (element.indexOf(".") > -1) {
            let left = element.split(".")[0];
            if (left.indexOf("#") > -1) {
                this.tagName = left.indexOf("#") === 0 ? "div" : left.split("#")[0];
                this.id = left.split("#")[1];
            } else {
                this.tagName = element.indexOf(".") === 0 ? "div" : element.split(".")[0];
            }

            for (let i = 1; i < element.split(".").length; i++) {
                this.classList.push(element.split(".")[i]);
            }
        }

        this.properties = properties;

        this.el = document.createElement(this.tagName);

        if (this.id !== "") this.el.setAttribute("id", this.id);
        if (this.classList.length !== 0) {
            this.classList.forEach(className => {
                this.el.classList.add(className);
            });
        }

        if (properties) {
            if (properties.id) this.el.setAttribute("id", properties.id);
            if (properties.classList) {
                if (properties.classList instanceof Array) {
                    properties.classList.forEach(className => {
                        this.el.classList.add(className);
                    });
                } else if (typeof properties.classList === "string") {
                    this.el.classList.add(properties.classList);
                }
            }
            if (properties.text) this.el.innerText = properties.text;
            if (properties.attr) {
                for (let k in properties.attr) {
                    this.el.setAttribute(k, properties.attr[k]);
                }
            }
        }
    }

    getElement() {
        return this.el;
    }

    appendTo(element) {
        document.querySelectorAll(element).forEach(e => {
            e.appendChild(this.el);
        })
    }
}