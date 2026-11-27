import { jest } from "@jest/globals";
import { renderListPage } from "../js/pages/listPage.js";

describe("Movies List Page", () => {
    let state;
    let navigate;
    let dispatch;

    beforeEach(() => {
        state = {
            movies: [
                {
                    id: 1,
                    title: "Inception",
                    year: 2010,
                    genre: "Sci-Fi",
                    rating: 8.8,
                    description: "A thief enters people's dreams."
                },
                {
                    id: 2,
                    title: "Interstellar",
                    year: 2014,
                    genre: "Sci-Fi",
                    rating: 8.7,
                    description: "A journey through space."
                }
            ],
            settings: {
                darkMode: false
            },
            loading: false,
            error: null
        };
        navigate = jest.fn();
        dispatch = jest.fn();
    });

    test("renders the movie list and add movie form", () => {
        const page = renderListPage(state, {}, navigate, dispatch);
        expect(page).toBeInstanceOf(HTMLElement);
        expect(page.textContent).toContain("Inception");
        expect(page.textContent).toContain("Interstellar");
        expect(page.querySelector("form")).not.toBeNull();
    });

    test("renders the add movie form fields", () => {
        const page = renderListPage(state, {}, navigate, dispatch);
        expect(page.querySelector('[name="title"]')).not.toBeNull();
        expect(page.querySelector('[name="year"]')).not.toBeNull();
        expect(page.querySelector('[name="genre"]')).not.toBeNull();
        expect(page.querySelector('[name="rating"]')).not.toBeNull();
        expect(page.querySelector('[name="description"]')).not.toBeNull();
    });

    test("displays an existing error message", () => {
        state.error = "Unable to add movie.";
        const page = renderListPage(state, {}, navigate, dispatch);
        expect(page.querySelector(".error-message").textContent).toBe("Unable to add movie.");
    });

    test("displays loading status when loading is true", () => {
        state.loading = true;
        const page = renderListPage(state, {}, navigate, dispatch);
        expect(page.querySelector(".loading-message").textContent).toBe("Please wait...");
    });

    test("navigates to a movie detail page", () => {
        const page = renderListPage(state, {}, navigate, dispatch);
        const viewButtons = [...page.querySelectorAll("button")];
        const viewButton = viewButtons.find((button) => button.textContent.includes("View Details"));
        viewButton.click();
        expect(navigate).toHaveBeenCalledWith("/detail/1");
    });
});
