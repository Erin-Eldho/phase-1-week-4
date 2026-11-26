export const movies = [
    {
        id: "1",
        title: "Inception",
        year: 2010,
        genre: "Science Fiction",
        rating: 8.8,
        description: "A thief enters people's dreams to steal their secrets."
    },
    {
        id: "2",
        title: "Interstellar",
        year: 2014,
        genre: "Science Fiction",
        rating: 8.7,
        description: "A team travels through a wormhole to find a new home for humanity."
    },
    {
        id: "3",
        title: "The Dark Knight",
        year: 2008,
        genre: "Action",
        rating: 9.0,
        description: "Batman faces the Joker, a criminal mastermind in Gotham City."
    },
    {
        id: "4",
        title: "The Shawshank Redemption",
        year: 1994,
        genre: "Drama",
        rating: 9.3,
        description: "Two imprisoned men form a friendship over several years."
    },
    {
        id: "5",
        title: "The Matrix",
        year: 1999,
        genre: "Science Fiction",
        rating: 8.7,
        description: "A hacker discovers that reality is a simulated world."
    }
];

export function getMovieById(id) {
    return movies.find((movie) => movie.id === String(id));
}
