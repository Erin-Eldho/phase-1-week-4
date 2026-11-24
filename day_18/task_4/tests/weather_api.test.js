// MOCK WEATHER API MODULE
jest.mock(
    "../../../../phase-1-week-3/day_14/task_5/weatherApi",
    () => ({
        searchCities: jest.fn(),
        getWeather: jest.fn()
    })
);

// SETUP AND TEARDOWN
let WeatherAPI;
let weatherApp;

beforeEach(() => {
    // Reset DOM before every test
    document.body.innerHTML = `
        <form id="search-form">
            <input id="city-input">
        </form>

        <select id="city-select">
            <option value="">Select a city</option>
        </select>

        <div id="loading"></div>
        <div id="weather-info" hidden></div>
        <p id="error-message"></p>

        <h2 id="city-name"></h2>
        <p id="weather-description"></p>
        <span id="temperature"></span>
        <span id="wind-speed"></span>
    `;

    sessionStorage.clear();

    // Reload modules for each test
    jest.resetModules();

    // Import the mocked weather API module
    WeatherAPI = require(
        "../../../../phase-1-week-3/day_14/task_5/weatherApi"
    );

    // Reset mock functions
    WeatherAPI.searchCities.mockReset();
    WeatherAPI.getWeather.mockReset();

    // Import the actual Week 3 weather application
    weatherApp = require(
        "../../../../phase-1-week-3/day_14/task_5/weather"
    );
});


afterEach(() => {
    // Restore spies
    jest.restoreAllMocks();

    // Clear mock call history
    jest.clearAllMocks();

    // Clear storage
    sessionStorage.clear();
});


// WEATHER API MODULE MOCKING
describe("Weather API Module Mocking", () => {
    test("should call the geocoding API with the correct URL", async () => {
        
        // Mock geocoding API response
        WeatherAPI.searchCities.mockResolvedValue({
            results: [
                {
                    name: "Coimbatore",
                    latitude: 11.0168,
                    longitude: 76.9558,
                    admin1: "Tamil Nadu",
                    country: "India"
                }
            ]
        });

        // Search for a city
        await weatherApp.searchCities("Coimbatore");

        // Verify the correct URL
        expect(WeatherAPI.searchCities).toHaveBeenCalledWith(
            "https://geocoding-api.open-meteo.com/v1/search?name=Coimbatore&count=5&language=en&format=json"
        );

        // Verify the API module was called once
        expect(WeatherAPI.searchCities).toHaveBeenCalledTimes(1);
    });

    test("should call the weather API with the correct URL", async () => {

        // Mock weather API response
        WeatherAPI.getWeather.mockResolvedValue({
            current: {
                temperature_2m: 30,
                wind_speed_10m: 12,
                weather_code: 0
            }
        });

        // Fetch weather for Coimbatore
        await weatherApp.fetchWeather({
            name: "Coimbatore",
            latitude: 11.0168,
            longitude: 76.9558
        });

        // Expected Open-Meteo weather URL
        const expectedURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=11.0168" +
            "&longitude=76.9558" +
            "&current=temperature_2m%2Cwind_speed_10m%2Cweather_code" +
            "&timezone=auto";

        // Verify the correct URL was passed
        expect(WeatherAPI.getWeather).toHaveBeenCalledWith(expectedURL);

        // Verify the API module was called once
        expect(WeatherAPI.getWeather).toHaveBeenCalledTimes(1);
    });
});
