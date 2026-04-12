import axios from 'axios';
import { mockWeatherData, mockForecastData, mockAirPollutionData } from './mockData';

const API_KEY = 'a02444d241908438b6e4e04b928e3203';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Флаг для использования мок-данных (true - использовать моки, false - реальные запросы)
const USE_MOCK = true;

export const getCityCoordinates = async (cityName) => {
  if (USE_MOCK) {
    return mockWeatherData.city.coord;
  }
  
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: cityName,
        limit: 1,
        appid: API_KEY
      }
    });
    
    if (response.data.length === 0) {
      throw new Error('Город не найден');
    }
    
    return {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      name: response.data[0].name
    };
  } catch (error) {
    console.error('Ошибка получения координат:', error);
    throw error;
  }
};

export const getCurrentWeather = async (lat, lon) => {
  if (USE_MOCK) {
    return mockWeatherData;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'ru'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    throw error;
  }
};

export const getForecast = async (lat, lon) => {
  if (USE_MOCK) {
    return mockForecastData;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'ru',
        cnt: 40
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения прогноза:', error);
    throw error;
  }
};

export const getAirPollution = async (lat, lon) => {
  if (USE_MOCK) {
    return mockAirPollutionData;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения данных о загрязнении:', error);
    throw error;
  }
};

export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};