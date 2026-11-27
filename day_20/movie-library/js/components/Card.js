import { Button } from "./Button.js";

export function Card(movie, onViewDetails, onEdit, onDelete, showActions = false) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = `Year: ${movie.year}`;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${movie.genre}`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${movie.rating}`;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "card-actions";

    const detailsButton = Button({
        text: "View Details",
        onClick: onViewDetails
    });

    buttonGroup.appendChild(detailsButton);

    if (showActions) {
        const editButton = Button({
            text: "Edit",
            onClick: onEdit
        });
        const deleteButton = Button({
            text: "Delete",
            className: "button delete-button",
            onClick: onDelete
        });
        buttonGroup.append(editButton, deleteButton);
    }
    card.append(title, year, genre, rating, buttonGroup);
    return card;
}
