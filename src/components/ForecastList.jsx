import React from 'react';
import WeatherCard from './WeatherCard';

const ForecastList = ({ forecasts }) => {
  if (!forecasts || forecasts.length === 0) {
    return <div className="forecast-list">Нет данных прогноза</div>;
  }

  // Показываем следующие 5 прогнозов (каждые 3 часа)
  const upcomingForecasts = forecasts.slice(1, 6);

  return (
    <div className="forecast-list">
      <h3>Прогноз на ближайшие часы</h3>
      <div className="forecast-container">
        {upcomingForecasts.map((forecast, index) => (
          <WeatherCard key={index} weather={forecast} />
        ))}
      </div>
    </div>
  );
};

export default ForecastList;