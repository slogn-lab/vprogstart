import React from 'react';
import WeatherIcon from './WeatherIcon';

const WeatherCard = ({ weather, isCurrent = false }) => {
  if (!weather) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className={`weather-card ${isCurrent ? 'current' : ''}`}>
      {isCurrent ? (
        <>
          <div className="current-temp">{Math.round(weather.main.temp)}°C</div>
          <WeatherIcon iconCode={weather.weather[0].icon} description={weather.weather[0].description} size={100} />
          <div className="weather-desc">{weather.weather[0].description}</div>
          <div className="weather-details">
            <div>Ощущается: {Math.round(weather.main.feels_like)}°C</div>
            <div>Влажность: {weather.main.humidity}%</div>
            <div>Давление: {weather.main.pressure} гПа</div>
            <div>Ветер: {weather.wind.speed} м/с</div>
          </div>
        </>
      ) : (
        <>
          <div className="forecast-time">{formatDate(weather.dt)}</div>
          <WeatherIcon iconCode={weather.weather[0].icon} description={weather.weather[0].description} size={60} />
          <div className="forecast-temp">{Math.round(weather.main.temp)}°C</div>
          <div className="forecast-desc">{weather.weather[0].description}</div>
        </>
      )}
    </div>
  );
};

export default WeatherCard;