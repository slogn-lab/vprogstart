import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import CitySelector from './components/CitySelector';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import AirPollution from './components/AirPollution';
import { getCityCoordinates, getCurrentWeather, getForecast, getAirPollution } from './services/weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airPollution, setAirPollution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState('Москва');
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeatherData = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await getCityCoordinates(cityName);
      setCurrentCity(coords.name || cityName);
      
      const [weatherData, forecastData, airPollutionData] = await Promise.all([
        getCurrentWeather(coords.lat, coords.lon),
        getForecast(coords.lat, coords.lon),
        getAirPollution(coords.lat, coords.lon)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setAirPollution(airPollutionData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCitySelect = (cityName) => {
    fetchWeatherData(cityName);
  };

  // Обновление каждые 3 часа
  useEffect(() => {
    if (currentCity) {
      fetchWeatherData(currentCity);
      
      const interval = setInterval(() => {
        fetchWeatherData(currentCity);
      }, 3 * 60 * 60 * 1000); // 3 часа
      
      return () => clearInterval(interval);
    }
  }, [currentCity, fetchWeatherData]);

  // Определение фона на основе погоды
  const getBackgroundClass = () => {
    if (!weather || !weather.weather) return 'default';
    
    const weatherId = weather.weather[0].id;
    const isDay = weather.weather[0].icon.includes('d');
    
    if (weatherId === 800) return isDay ? 'clear-day' : 'clear-night';
    if (weatherId >= 801 && weatherId <= 804) return 'clouds';
    if ((weatherId >= 500 && weatherId <= 531) || (weatherId >= 300 && weatherId <= 321)) return 'rain';
    if (weatherId >= 600 && weatherId <= 622) return 'snow';
    if (weatherId >= 200 && weatherId <= 232) return 'thunderstorm';
    if (weatherId >= 700 && weatherId <= 781) return 'mist';
    return 'default';
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className="container">
        <header className="header">
          <h1>Прогноз погоды</h1>
          <CitySelector onCitySelect={handleCitySelect} isLoading={loading} />
          {lastUpdate && (
            <div className="last-update">
              Последнее обновление: {lastUpdate.toLocaleTimeString('ru-RU')}
            </div>
          )}
        </header>

        {error && <div className="error">{error}</div>}

        {loading && <div className="loading">Загрузка...</div>}

        {!loading && weather && (
          <div className="weather-content">
            <div className="current-weather">
              <h2>{currentCity}</h2>
              <WeatherCard weather={weather} isCurrent={true} />
            </div>
            
            {forecast && forecast.list && (
              <ForecastList forecasts={forecast.list} />
            )}
            
            {airPollution && (
              <AirPollution data={airPollution} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;