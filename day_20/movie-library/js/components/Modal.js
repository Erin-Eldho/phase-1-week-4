import { Button } from "./Button.js";

export function Modal({title, message, isOpen = false, onClose}) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.hidden = !isOpen;

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
    return modal;
}
