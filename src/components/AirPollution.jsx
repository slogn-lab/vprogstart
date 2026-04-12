import React from 'react';

const getAQIDescription = (aqi) => {
  const descriptions = {
    1: { text: 'Отличное', color: '#00e676', level: 'Хорошо' },
    2: { text: 'Хорошее', color: '#ffeb3b', level: 'Удовлетворительно' },
    3: { text: 'Умеренное', color: '#ff9800', level: 'Умеренно' },
    4: { text: 'Плохое', color: '#ff5722', level: 'Плохо' },
    5: { text: 'Очень плохое', color: '#f44336', level: 'Опасно' }
  };
  return descriptions[aqi] || descriptions[1];
};

const AirPollution = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) {
    return <div className="air-pollution">Нет данных о качестве воздуха</div>;
  }

  const pollution = data.list[0];
  const aqiInfo = getAQIDescription(pollution.main.aqi);
  const components = pollution.components;

  return (
    <div className="air-pollution">
      <h3>Качество воздуха</h3>
      <div className="aqi-container">
        <div 
          className="aqi-indicator"
          style={{ backgroundColor: aqiInfo.color }}
        >
          <span className="aqi-value">AQI: {pollution.main.aqi}</span>
          <span className="aqi-level">{aqiInfo.level}</span>
        </div>
        <div className="pollutants">
          <div className="pollutant">
            <span>PM2.5:</span>
            <span>{components.pm2_5} µg/m³</span>
          </div>
          <div className="pollutant">
            <span>PM10:</span>
            <span>{components.pm10} µg/m³</span>
          </div>
          <div className="pollutant">
            <span>NO₂:</span>
            <span>{components.no2} µg/m³</span>
          </div>
          <div className="pollutant">
            <span>O₃:</span>
            <span>{components.o3} µg/m³</span>
          </div>
          <div className="pollutant">
            <span>CO:</span>
            <span>{components.co} µg/m³</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirPollution;