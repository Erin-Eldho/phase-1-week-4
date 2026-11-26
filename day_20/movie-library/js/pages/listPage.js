import { Card } from "../components/Card.js";
import { Button } from "../components/Button.js";

export function renderListPage(state, params, navigate, dispatch) {
    const page = document.createElement("section");
    page.className = "page list-page";

    const heading = document.createElement("h1");
    heading.textContent = "All Movies";

    const formHeading = document.createElement("h2");
    formHeading.textContent = "Add a Movie";

    const form = document.createElement("form");
    form.className = "movie-form";

    const fields = [
        { name: "title", label: "Title", type: "text" },
        { name: "year", label: "Year", type: "number" },
        { name: "genre", label: "Genre", type: "text" },
        { name: "rating", label: "Rating", type: "number" },
        { name: "description", label: "Description", type: "text" }
    ];

    fields.forEach((field) => {
        const label = document.createElement("label");
        label.textContent = field.label;

        const input = document.createElement("input");
        input.name = field.name;
        input.type = field.type;
        input.required = true;

        if (field.name === "rating") {
            input.min = "0";
            input.max = "10";
            input.step = "0.1";
        }

        if (field.name === "year") {
            input.min = "1888";
        }

        label.appendChild(input);
        form.appendChild(label);
    });

    const submitButton = Button({text: "Add Movie", type: "submit"});
    form.appendChild(submitButton);

    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.setAttribute("role", "alert");

    if (state.error) {
        errorMessage.textContent = state.error;
    }

    const loadingMessage = document.createElement("p");
    loadingMessage.className = "loading-message";
    loadingMessage.textContent = state.loading ? "Please wait..." : "";

    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-grid";

    state.movies.forEach((movie) => {
        const card = Card(
            movie,
            () => navigate(`/detail/${movie.id}`),
            () => navigate(`/detail/${movie.id}`),
            () => {
                const confirmed = window.confirm(`Are you sure you want to delete ${movie.title}?`);
                if (confirmed) {
                    performOperation(async () => {
                        dispatch({
                            type: "DELETE_MOVIE",
                            payload: movie.id
                        });
                    });
                }
            },
            true
        );
        movieContainer.appendChild(card);
    });

    async function performOperation(operation) {
        dispatch({
            type: "SET_LOADING",
            payload: true
        });

        dispatch({
            type: "SET_ERROR",
            payload: null
        });

        try {
            await Promise.resolve().then(operation);
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: error.message || "Operation failed."
            });
        } finally {
            dispatch({
                type: "SET_LOADING",
                payload: false
            });
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const newMovie = {
            id: crypto.randomUUID(),
            title: formData.get("title").trim(),
            year: Number(formData.get("year")),
            genre: formData.get("genre").trim(),
            rating: Number(formData.get("rating")),
            description: formData.get("description").trim()
        };

        if (
            !newMovie.title ||
            !newMovie.genre ||
            !newMovie.description ||
            !Number.isFinite(newMovie.year) ||
            !Number.isFinite(newMovie.rating) ||
            newMovie.rating < 0 ||
            newMovie.rating > 10
        ) {
            dispatch({
                type: "SET_ERROR",
                payload: "Please enter valid movie information."
            });

            return;
        }

        performOperation(async () => {
            dispatch({
                type: "ADD_MOVIE",
                payload: newMovie
            });
            form.reset();
        });
    });

    page.append(heading, formHeading, form, loadingMessage, errorMessage, movieContainer);
    return page;
}
