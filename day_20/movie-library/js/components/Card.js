import { Button } from "./Button.js";

export function Card(movie, onViewDetails) {
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

    const detailsButton = Button({
        text: "View Details",
        onClick: onViewDetails
    });
    card.append(title, year, genre, rating, detailsButton);
    return card;
}
