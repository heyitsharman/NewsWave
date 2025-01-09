import React, {useState} from 'react'
import axios from 'axios'
import './Weather.css'
const Weather = () => {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const search = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=f947d4d60ac16e7d324807ced19ee375`

    const response = await axios.get(url)
   
    setData(response.data)
    setLocation('')
    console.log(data)
  }

  const handelInputChange = (e) =>{
    setLocation(e.target.value)
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
          <div className="location">{data.name}</div>
        </div>
        <div className="search-location">
          <input type="text" placeholder='enter location' value={location} onChange={(handelInputChange)}/>
          <i className="fa-solid fa-magnifying-glass" onClick={(search)}></i>
        </div>
      </div>
      <div className="weather-data">
        {data.weather && data.weather[0] && getWeatherIcon(data.weather[0].main)}
      <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
      <div className="temp">{data.main ? `${data.main.temp} °C` : null}</div>
      </div>
    </div>
  )
}

export default Weather
