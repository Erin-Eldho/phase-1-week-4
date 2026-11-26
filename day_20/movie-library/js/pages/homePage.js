import { movies } from "../movieData.js";
import { Card } from "../components/Card.js";

export function renderHomePage(state, params, navigate) {
    const page = document.createElement("section");
    page.className = "page home-page";

    const heading = document.createElement("h1");
    heading.textContent = "Welcome to Movie Library";

    const description = document.createElement("p");
    description.textContent = "Discover and explore your favourite movies.";

    const featuredHeading = document.createElement("h2");
    featuredHeading.textContent = "Featured Movies";

    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-grid";

    movies.slice(0, 3).forEach((movie) => {
        const card = Card(movie, () => {
            navigate(`/detail/${movie.id}`);
        });
        movieContainer.appendChild(card);
    });

    page.append(heading, description, featuredHeading, movieContainer);
    return page;
}
