export function Button({text, className = "button", type = "button", onClick}) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.type = type;

    if (onClick) {
        button.addEventListener("click", onClick);
    }
    return button;
}
