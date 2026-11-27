import { jest } from "@jest/globals";
import { renderHomePage } from "../js/pages/homePage.js";

describe("Home Page", () => {
    test("renders the home page as a DOM element", () => {
        const state = {
            movies: [
                {
                    id: 1,
                    title: "Inception",
                    year: 2010,
                    genre: "Sci-Fi",
                    rating: 8.8
                },
                {
                    id: 2,
                    title: "Interstellar",
                    year: 2014,
                    genre: "Sci-Fi",
                    rating: 8.7
                }
            ],
            settings: {
                darkMode: false
            }
        };

        const navigate = jest.fn();
        const page = renderHomePage(state, {}, navigate);
        expect(page).toBeInstanceOf(HTMLElement);
        expect(page.textContent).toContain("Welcome to Movie Library");
        expect(page.textContent).toContain("Inception");
        expect(page.textContent).toContain("Interstellar");
    });

    test("renders no more than three featured movies", () => {
        const state = {
            movies: Array.from({ length: 5 }, (_, index) => ({
                id: index + 1,
                title: `Movie ${index + 1}`,
                year: 2020,
                genre: "Drama",
                rating: 8
            }))
        };
        const page = renderHomePage(state, {}, jest.fn());
        expect(page.querySelectorAll(".movie-grid .movie-card")).toHaveLength(3);
    });
});
