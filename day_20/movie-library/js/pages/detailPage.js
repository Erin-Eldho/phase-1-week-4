import { Button } from "../components/Button.js";
import { Modal } from "../components/Modal.js";

export function renderDetailPage(state, params, navigate, dispatch) {
    const page = document.createElement("section");
    page.className = "page detail-page";

    const movie = state.movies.find(
        (item) => item.id === params.id
    );

    if (!movie) {
        const heading = document.createElement("h1");
        heading.textContent = "Movie Not Found";
        const backButton = Button({
            text: "Back to Movies",
            onClick: () => navigate("/list")
        });
        page.append(heading, backButton);
        return page;
    }

    const heading = document.createElement("h1");
    heading.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = `Year: ${movie.year}`;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${movie.genre}`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${movie.rating}`;

    const description = document.createElement("p");
    description.textContent = movie.description;

    const editHeading = document.createElement("h2");
    editHeading.textContent = "Edit Movie";

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
        input.value = movie[field.name];
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

    const saveButton = Button({
        text: "Save Changes",
        type: "submit"
    });

    form.appendChild(saveButton);
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.setAttribute("role", "alert");

    if (state.error) {
        errorMessage.textContent = state.error;
    }

    const loadingMessage = document.createElement("p");
    loadingMessage.className = "loading-message";
    loadingMessage.textContent = state.loading ? "Please wait..." : "";

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
        const updatedMovie = {
            id: movie.id,
            title: formData.get("title").trim(),
            year: Number(formData.get("year")),
            genre: formData.get("genre").trim(),
            rating: Number(formData.get("rating")),
            description: formData.get("description").trim()
        };

        if (
            !updatedMovie.title ||
            !updatedMovie.genre ||
            !updatedMovie.description ||
            !Number.isFinite(updatedMovie.year) ||
            !Number.isFinite(updatedMovie.rating) ||
            updatedMovie.rating < 0 ||
            updatedMovie.rating > 10
        ) {
            dispatch({
                type: "SET_ERROR",
                payload: "Please enter valid movie information."
            });
            return;
        }

        performOperation(async () => {
            dispatch({
                type: "UPDATE_MOVIE",
                payload: updatedMovie
            });
        });
    });

    const deleteButton = Button({
        text: "Delete Movie",
        className: "button delete-button",
        onClick: () => {
            const confirmed = window.confirm(`Are you sure you want to delete ${movie.title}?`);

            if (confirmed) {
                performOperation(async () => {
                    dispatch({
                        type: "DELETE_MOVIE",
                        payload: movie.id
                    });

                    navigate("/list");
                });
            }
        }
    });

    const backButton = Button({
        text: "Back to Movies",
        onClick: () => navigate("/list")
    });

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
            modal.focus();
        }
    });

    const detailActions = document.createElement("div");
    detailActions.className = "detail-actions";
    detailActions.append(deleteButton, backButton);

    page.append(
        heading,
        year,
        genre,
        rating,
        description,
        infoButton,
        modal,
        editHeading,
        form,
        loadingMessage,
        errorMessage,
        detailActions
    );

    return page;
}
