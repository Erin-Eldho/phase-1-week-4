jest.mock("../../../../phase-1-week-3/day_14/task_5/weatherApi",
    () => ({
        searchCities: jest.fn(),
        getWeather: jest.fn()
    })
);

const weatherApiPath = "../../../../phase-1-week-3/day_14/task_5/weatherApi";
const weatherAppPath = "../../../../phase-1-week-3/day_14/task_5/weather";

let WeatherAPI;
let weatherApp;

const city = {
    name: "Coimbatore",
    latitude: 11.0168,
    longitude: 76.9558
};

const currentWeather = {
    temperature_2m: 30,
    wind_speed_10m: 12,
    weather_code: 0
};

beforeEach(() => {
    document.body.innerHTML = `
        <form id="search-form">
            <input type="text" id="city-input">
            <button type="submit">Search</button>
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
    jest.resetModules();
    WeatherAPI = require(weatherApiPath);
    WeatherAPI.searchCities.mockReset();
    WeatherAPI.getWeather.mockReset();
    weatherApp = require(weatherAppPath);
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    sessionStorage.clear();
});

describe("Weather API Module Mocking", () => {
    test("should call the geocoding API with the correct URL", async () => {
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

        await weatherApp.searchCities("Coimbatore");
        expect(WeatherAPI.searchCities).toHaveBeenCalledWith("https://geocoding-api.open-meteo.com/v1/search?name=Coimbatore&count=5&language=en&format=json");
        expect(WeatherAPI.searchCities).toHaveBeenCalledTimes(1);
    });

    test("should call the weather API with the correct URL", async () => {
        WeatherAPI.getWeather.mockResolvedValue({current: currentWeather});
        await weatherApp.fetchWeather(city);

        const expectedURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=11.0168" +
            "&longitude=76.9558" +
            "&current=temperature_2m%2Cwind_speed_10m%2Cweather_code" +
            "&timezone=auto";

        expect(WeatherAPI.getWeather).toHaveBeenCalledWith(expectedURL);
        expect(WeatherAPI.getWeather).toHaveBeenCalledTimes(1);
    });
});

describe("searchCities()", () => {
    test("should display an error when results are missing", async () => {
        WeatherAPI.searchCities.mockResolvedValue({});
        await weatherApp.searchCities("Unknown");
        expect(document.getElementById("error-message").textContent).toBe("No matching cities found.");
        expect(document.getElementById("weather-info").hidden).toBe(true);
    });

    test("should display an error when no matching cities are found", async () => {
        WeatherAPI.searchCities.mockResolvedValue({
            results: []
        });
        await weatherApp.searchCities("Unknown");
        expect(document.getElementById("error-message").textContent).toBe("No matching cities found.");
    });

    test("should display the API error when city search fails", async () => {
        WeatherAPI.searchCities.mockRejectedValue(new Error("Unable to search for cities."));
        await weatherApp.searchCities("Coimbatore");
        expect(document.getElementById("error-message").textContent).toBe("Unable to search for cities.");
    });

    test("should display city names when optional location details are missing", async () => {
        WeatherAPI.searchCities.mockResolvedValue({
            results: [
                {
                    name: "Coimbatore",
                    latitude: 11.0168,
                    longitude: 76.9558
                }
            ]
        });

        await weatherApp.searchCities("Coimbatore");
        const citySelect = document.getElementById("city-select");
        expect(citySelect.hidden).toBe(false);
        expect(citySelect.options[1].textContent).toBe("Coimbatore");
    });
});

describe("fetchWeather()", () => {
    test("should display cached weather without making another API request", async () => {
        const cacheKey = `weather_${city.latitude}_${city.longitude}`;
        sessionStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: currentWeather
        }));

        await weatherApp.fetchWeather(city);
        expect(WeatherAPI.getWeather).not.toHaveBeenCalled();
        expect(document.getElementById("temperature").textContent).toBe("30 °C");
        expect(document.getElementById("weather-info").hidden).toBe(false);
    });

    test("should fetch new weather when cached data has expired", async () => {
        const cacheKey = `weather_${city.latitude}_${city.longitude}`;
        sessionStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now() - (11 * 60 * 1000),
            data: {
                temperature_2m: 20,
                wind_speed_10m: 5,
                weather_code: 1
            }
        }));

        WeatherAPI.getWeather.mockResolvedValue({
            current: currentWeather
        });

        await weatherApp.fetchWeather(city);
        expect(WeatherAPI.getWeather).toHaveBeenCalledTimes(1);
        expect(document.getElementById("temperature").textContent).toBe("30 °C");
        const updatedCache = JSON.parse(sessionStorage.getItem(cacheKey));
        expect(updatedCache.data).toEqual(currentWeather);
    });

    test("should display an error when weather data has no current property", async () => {
        WeatherAPI.getWeather.mockResolvedValue({
            hourly: {}
        });
        await weatherApp.fetchWeather(city);
        expect(document.getElementById("error-message").textContent).toBe("Weather data is unavailable.");
        expect(document.getElementById("weather-info").hidden).toBe(true);
    });

    test("should display an error when weather API request fails", async () => {
        WeatherAPI.getWeather.mockRejectedValue(new Error("Unable to fetch weather data."));
        await weatherApp.fetchWeather(city);
        expect(document.getElementById("error-message").textContent).toBe("Unable to fetch weather data.");
        expect(document.getElementById("loading").hidden).toBe(true);
    });

    test("should display unknown weather condition for an unrecognized weather code", async () => {
        WeatherAPI.getWeather.mockResolvedValue({
            current: {
                ...currentWeather,
                weather_code: 999
            }
        });
        await weatherApp.fetchWeather(city);
        expect(document.getElementById("weather-description").textContent).toBe("Unknown weather condition");
    });
});

describe("Form submission", () => {
    test("should not search when the city input is empty", () => {
        const form = document.getElementById("search-form");
        const cityInput = document.getElementById("city-input");
        cityInput.value = "   ";
        const event = new Event("submit", {
            bubbles: true,
            cancelable: true
        });
        form.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(WeatherAPI.searchCities).not.toHaveBeenCalled();
    });

    test("should search when a city is entered", () => {
        const form = document.getElementById("search-form");
        const cityInput = document.getElementById("city-input");
        cityInput.value = "Coimbatore";

        WeatherAPI.searchCities.mockResolvedValue({
            results: []
        });

        const event = new Event("submit", {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(WeatherAPI.searchCities).toHaveBeenCalledWith("https://geocoding-api.open-meteo.com/v1/search?name=Coimbatore&count=5&language=en&format=json");
    });

});

describe("City selection", () => {
    test("should not fetch weather when no city is selected", () => {
        const citySelect = document.getElementById("city-select");
        citySelect.value = "";
        citySelect.dispatchEvent(new Event("change", { bubbles: true }));
        expect(WeatherAPI.getWeather).not.toHaveBeenCalled();
    });

    test("should fetch weather when a city is selected", () => {
        const citySelect = document.getElementById("city-select");
        const option = document.createElement("option");

        option.value = JSON.stringify(city);
        option.textContent = "Coimbatore";

        citySelect.appendChild(option);
        citySelect.value = option.value;

        WeatherAPI.getWeather.mockResolvedValue({
            current: currentWeather
        });

        citySelect.dispatchEvent(new Event("change", { bubbles: true }));
        expect(WeatherAPI.getWeather).toHaveBeenCalledTimes(1);
    });
});

describe("initializeWeather()", () => {
    test("should not fetch weather when the default city has no results", async () => {
        WeatherAPI.searchCities.mockResolvedValue({
            results: []
        });
        await weatherApp.initializeWeather();
        expect(WeatherAPI.searchCities).toHaveBeenCalledTimes(1);
        expect(WeatherAPI.getWeather).not.toHaveBeenCalled();
    });

    test("should select the default city and fetch its weather", async () => {
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

        WeatherAPI.getWeather.mockResolvedValue({
            current: currentWeather
        });
        
        await weatherApp.initializeWeather();
        expect(document.getElementById("city-select").selectedIndex).toBe(1);
        expect(WeatherAPI.getWeather).toHaveBeenCalledTimes(1);
    });
});
