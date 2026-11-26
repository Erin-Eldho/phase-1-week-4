import { movies } from "../movieData.js";
import { Card } from "../components/Card.js";

export function renderListPage(state, params, navigate) {
    const page = document.createElement("section");
    page.className = "page list-page";

    const heading = document.createElement("h1");
    heading.textContent = "All Movies";

    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-grid";

    movies.forEach((movie) => {
        const card = Card(movie, () => {
            navigate(`/detail/${movie.id}`);
        });
        movieContainer.appendChild(card);
    });

    page.append(heading, movieContainer);
    return page;
}
