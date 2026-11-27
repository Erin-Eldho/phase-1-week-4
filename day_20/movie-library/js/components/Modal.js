import { Button } from "./Button.js";

export function Modal({title, message, isOpen = false, onClose}) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.hidden = !isOpen;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.tabIndex = -1;

    const content = document.createElement("div");
    content.className = "modal-content";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const description = document.createElement("p");
    description.textContent = message;

    const closeButton = Button({
        text: "Close",
        onClick: onClose
    });

    content.append(heading, description, closeButton);
    modal.appendChild(content);
    
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            if (onClose) {
                onClose();
            } else {
                modal.hidden = true;
            }
        }
    });

    return modal;
}
