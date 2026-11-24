const WeatherAPI = require("../../../../phase-1-week-3/day_14/task_5/weatherApi");
let originalFetch;

beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
});

afterEach(() => {
    if (originalFetch) {
        global.fetch = originalFetch;
    } else {
        delete global.fetch;
    }
});

describe("WeatherAPI.searchCities()", () => {
    test("should return city data when the request succeeds", async () => {
        const mockData = {
            results: [
                { name: "Coimbatore", latitude: 11.0168 }
            ]
        };
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData)
        });
        const result = await WeatherAPI.searchCities("https://example.com/search");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith("https://example.com/search");
    });

    test("should throw an error when the city search request fails", async () => {
        global.fetch.mockResolvedValue({ok: false});
        await expect(WeatherAPI.searchCities("https://example.com/search")).rejects.toThrow("Unable to search for cities.");
    });
});

describe("WeatherAPI.getWeather()", () => {
    test("should return weather data when the request succeeds", async () => {
        const mockData = {
            current: {
                temperature_2m: 30,
                wind_speed_10m: 12
            }
        };
        global.fetch.mockResolvedValue({ok: true, json: jest.fn().mockResolvedValue(mockData)});
        const result = await WeatherAPI.getWeather("https://example.com/weather");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith("https://example.com/weather");
    });

    test("should throw an error when the weather request fails", async () => {
        global.fetch.mockResolvedValue({ok: false});
        await expect(WeatherAPI.getWeather("https://example.com/weather")).rejects.toThrow("Unable to fetch weather data.");
    });
});
