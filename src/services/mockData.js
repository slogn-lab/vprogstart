// src/services/mockData.js
export const mockWeatherData = {
  name: 'Москва',
  coord: { lat: 55.7558, lon: 37.6173 },
  weather: [{
    id: 800,
    main: 'Clear',
    description: 'ясно',
    icon: '01d'
  }],
  main: {
    temp: 22.5,
    feels_like: 21.8,
    humidity: 55,
    pressure: 1015
  },
  wind: {
    speed: 3.5,
    deg: 180
  }
};

export const mockForecastData = {
  list: [
    {
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 22.5, feels_like: 21.8, humidity: 55, pressure: 1015 },
      weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
      wind: { speed: 3.5 },
      dt_txt: new Date().toISOString()
    },
    {
      dt: Math.floor(Date.now() / 1000) + 3 * 3600,
      main: { temp: 21.0, feels_like: 20.5, humidity: 58, pressure: 1013 },
      weather: [{ id: 801, main: 'Clouds', description: 'облачно', icon: '02d' }],
      wind: { speed: 4.0 },
      dt_txt: new Date(Date.now() + 3 * 3600 * 1000).toISOString()
    },
    {
      dt: Math.floor(Date.now() / 1000) + 6 * 3600,
      main: { temp: 19.5, feels_like: 19.0, humidity: 65, pressure: 1012 },
      weather: [{ id: 500, main: 'Rain', description: 'дождь', icon: '10d' }],
      wind: { speed: 5.2 },
      dt_txt: new Date(Date.now() + 6 * 3600 * 1000).toISOString()
    }
  ]
};

export const mockAirPollutionData = {
  list: [{
    main: { aqi: 2 },
    components: {
      co: 201.94,
      no: 0.01,
      no2: 0.8,
      o3: 68.7,
      so2: 0.36,
      pm2_5: 4.5,
      pm10: 6.2,
      nh3: 0.14
    }
  }]
};