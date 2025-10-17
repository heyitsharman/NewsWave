import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Weather.css'
import { WEATHER_CONFIG, buildWeatherUrl } from '../config/weatherConfig'

const Weather = () => {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true)
      const url = buildWeatherUrl(cityName)
      const response = await axios.get(url)
      setData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setLoading(false)
      // If default location fails, try a backup
      if (cityName === WEATHER_CONFIG.DEFAULT_LOCATION) {
        console.log('Trying backup location...')
        setTimeout(() => fetchWeatherData('London'), 1000)
      }
    }
  }

  // Load default weather on component mount
  useEffect(() => {
    fetchWeatherData(WEATHER_CONFIG.DEFAULT_LOCATION)
  }, [])

  const search = async () => {
    if (location.trim()) {
      await fetchWeatherData(location)
      setLocation('')
    }
  }

  const handelInputChange = (e) =>{
    setLocation(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search()
    }
  }
  const getWeatherIcon= (weatherType) =>{
    switch(weatherType){
      case 'Clear' :
        return <i className="fa-solid fa-sun"></i>
      case 'Clouds':
        return <i className="fa-solid fa-cloud"></i>
      case 'Thunder':
        return <i className="fa-solid fa-cloud-bolt"></i>
      case 'Rain':
        return <i className="fa-solid fa-cloud-rain"></i>
      case 'Snow':
        return <i className="fa-solid fa-snowflake"></i>
      case 'Smoke':
          return <i class="fa-duotone fa-solid fa-smoke"></i>
      default:
        return <i className="fa-solid fa-sun"></i>
    }
  }
  return (
    <div className='weather'>
      <div className="search">
        <div className="search-top">
          <i className="fa-solid fa-location-dot"></i>
          <div className="location">
            {loading ? 'Loading...' : (data.name || WEATHER_CONFIG.DEFAULT_LOCATION)}
          </div>
        </div>
        <div className="search-location">
          <input 
            type="text" 
            placeholder='Enter new location' 
            value={location} 
            onChange={handelInputChange}
            onKeyPress={handleKeyPress}
            list="popular-cities"
          />
          <datalist id="popular-cities">
            {WEATHER_CONFIG.POPULAR_CITIES.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
          <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
        </div>
      </div>
      <div className="weather-data">
        {loading ? (
          <div className="loading-text">Loading weather...</div>
        ) : data.weather ? (
          <>
            {data.weather[0] && getWeatherIcon(data.weather[0].main)}
            <div className="weather-type">{data.weather[0].main}</div>
            <div className="temp">{Math.round(data.main.temp)} °C</div>
            <div className="feels-like">Feels like {Math.round(data.main.feels_like)} °C</div>
            <div className="humidity">Humidity: {data.main.humidity}%</div>
          </>
        ) : (
          <div className="no-data">No weather data available</div>
        )}
      </div>
    </div>
  )
}

export default Weather
