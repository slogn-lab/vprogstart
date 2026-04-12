import React from 'react';
import { getWeatherIconUrl } from '../services/weatherService';

const WeatherIcon = ({ iconCode, description, size = 80 }) => {
  return (
    <img
      src={getWeatherIconUrl(iconCode)}
      alt={description}
      style={{ width: size, height: size }}
      className="weather-icon"
    />
  );
};

export default WeatherIcon;