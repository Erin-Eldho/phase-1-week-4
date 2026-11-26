import { getMovieById } from "../movieData.js";
import { Button } from "../components/Button.js";
import { Modal } from "../components/Modal.js";

export function renderDetailPage(state, params) {
    const page = document.createElement("section");
    page.className = "page detail-page";
    const movie = getMovieById(params.id);
    const heading = document.createElement("h1");

    if (!movie) {
        heading.textContent = "Movie Not Found";
        page.appendChild(heading);
        return page;
    }
    heading.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = `Year: ${movie.year}`;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${movie.genre}`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${movie.rating}`;

    const description = document.createElement("p");
    description.textContent = movie.description;

    let modal;
    modal = Modal({
        title: "Movie Information",
        message: `You are viewing ${movie.title}.`,
        isOpen: false,
        onClose: () => {
            modal.hidden = true;
        }
    });

    const infoButton = Button({
        text: "More Information",
        onClick: () => {
            modal.hidden = false;
        }
    });

    page.append(heading, year, genre, rating, description, infoButton, modal);
    return page;
}
