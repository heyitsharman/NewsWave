// Weather Widget Configuration
export const WEATHER_CONFIG = {
    // Default location that loads when the app starts
    // You can change this to any city you prefer
    DEFAULT_LOCATION: 'New York',
    
    // OpenWeather API configuration
    API_KEY: 'f947d4d60ac16e7d324807ced19ee375',
    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    // Weather settings
    UNITS: 'Metric', // Metric for Celsius, Imperial for Fahrenheit
    
    // Popular cities you might want to use as default
    POPULAR_CITIES: [
        'New York',
        'London',
        'Tokyo',
        'Paris',
        'Los Angeles',
        'Chicago',
        'Miami',
        'Sydney',
        'Mumbai',
        'Delhi'
    ]
};

// Helper function to build weather API URL
export const buildWeatherUrl = (cityName) => {
    return `${WEATHER_CONFIG.BASE_URL}?q=${encodeURIComponent(cityName)}&units=${WEATHER_CONFIG.UNITS}&appid=${WEATHER_CONFIG.API_KEY}`;
};