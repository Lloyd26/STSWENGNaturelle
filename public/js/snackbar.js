function snackbar(sb) {
    if (document.getElementById('snackbar-container') == null) {
        let sb_container = document.createElement("div");
        sb_container.setAttribute("id", "snackbar-container");
        document.querySelector("body").appendChild(sb_container);
    }

    let snackbar_el = document.createElement("div");
    snackbar_el.classList.add("snackbar");

    switch (sb.type) {
        case 'error':
            snackbar_el.classList.add("sb-error");
            break;
        case 'primary':
            snackbar_el.classList.add("sb-primary");
            break;
        default:
            snackbar_el.classList.add("sb-primary");
            break;
    }

    let snackbar_text = document.createElement("div");
    snackbar_text.classList.add("snackbar-text");
    snackbar_text.innerText = sb.text;

    snackbar_el.appendChild(snackbar_text);

    if (sb.action !== undefined) {
        let snackbar_action = document.createElement("div");
        snackbar_action.classList.add("snackbar-action");

        let snackbar_action_link = document.createElement("a");
        snackbar_action_link.setAttribute("href", sb.action.link);
        snackbar_action_link.innerText = sb.action.text;

        snackbar_action.appendChild(snackbar_action_link);

        snackbar_el.appendChild(snackbar_action);
    }

    document.getElementById('snackbar-container').appendChild(snackbar_el);

    if (sb.type !== "error") {
        setTimeout(() => {
            snackbar_el.classList.add("sb-out");
        }, 4000);

        setTimeout(() => {
            snackbar_el.remove();
        }, 4300);
    }
}