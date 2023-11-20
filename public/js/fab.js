document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button[data-toggle=fab]").forEach(btn_fab => {
        btn_fab.addEventListener("click", e => {
            let fab_active;

            let fab_container = document.getElementById("fab-container");
            if (fab_container.classList.contains("active")) {
                fab_container.classList.remove("active");
                fab_active = false;
            } else {
                fab_container.classList.add("active");
                fab_active = true;
            }

            let fab_blur_target = e.currentTarget.getAttribute("data-fab-blur-target");
            if (fab_blur_target != null) {
                let fab_items_container = document.getElementById("fab-items-container");
                document.querySelectorAll(fab_blur_target).forEach(fab_blur => {
                    if (fab_active) {
                        fab_items_container.style.display = "flex";

                        let fab_blur_element = document.createElement("div");
                        fab_blur_element.classList.add("fab-blur");
                        fab_blur.appendChild(fab_blur_element);
                    } else {
                        for (let i = 0; i < fab_blur.childNodes.length; i++) {
                            if (fab_blur.childNodes[i].classList && fab_blur.childNodes[i].classList.contains("fab-blur")) {
                                setTimeout(() => {
                                    fab_blur.childNodes[i].style.opacity = "0";
                                    fab_blur.childNodes[i].style.animation = "fade-out 0.3s ease-in-out";

                                    setTimeout(() => {
                                        fab_blur.childNodes[i].remove();
                                    }, 500);
                                }, 300);
                            }
                        }

                        setTimeout(() => {
                            fab_items_container.style.display = "none";
                        }, 500);
                    }
                });
            }

            if (fab_active) {
                let fab_item_groups = document.querySelectorAll("#fab-items-container > .fab-item-group");
                for (let i = 0; i < fab_item_groups.length; i++) {
                    fab_item_groups[fab_item_groups.length - i - 1].style.opacity = "0";
                    fab_item_groups[fab_item_groups.length - i - 1].style.animation = "slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) " + (0.1 * (i + 1)) + "s";
                }
            } else {
                    let fab_item_groups = document.querySelectorAll("#fab-items-container > .fab-item-group");
                    for (let i = 0; i < fab_item_groups.length; i++) {
                        fab_item_groups[i].style.opacity = "1";
                        fab_item_groups[i].style.animation = "slide-out 180ms cubic-bezier(0.4, 0, 0.2, 1) " + (0.05 * (i + 1)) + "s";
                    }
            }
        })
    });
});