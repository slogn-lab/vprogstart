// src/services/tests/weatherService.test.ts
import axios from 'axios';
import {
  getCityCoordinates,
  getCurrentWeather,
  getForecast,
  getAirPollution,
  getWeatherIconUrl
} from '../weatherService';
import { mockWeatherData, mockForecastData, mockAirPollutionData } from '../mockData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Важно: нужно замокать модуль, чтобы USE_MOCK не влиял
jest.mock('../weatherService', () => {
  const original = jest.requireActual('../weatherService');
  return {
    ...original,
    getCityCoordinates: jest.fn(),
    getCurrentWeather: jest.fn(),
    getForecast: jest.fn(),
    getAirPollution: jest.fn(),
    getWeatherIconUrl: original.getWeatherIconUrl,
  };
});

import * as weatherService from '../weatherService';

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherIconUrl', () => {
    it('должен возвращать правильный URL для иконки', () => {
      const iconCode = '01d';
      const url = getWeatherIconUrl(iconCode);
      expect(url).toBe(`https://openweathermap.org/img/wn/${iconCode}@2x.png`);
    });
  });

  describe('getCityCoordinates', () => {
    it('должен возвращать координаты для города', async () => {
      const mockResponse = {
        data: [{ lat: 55.7558, lon: 37.6173, name: 'Moscow' }]
      };
      (weatherService.getCityCoordinates as jest.Mock).mockResolvedValue({
        lat: 55.7558,
        lon: 37.6173,
        name: 'Moscow'
      });

      const result = await weatherService.getCityCoordinates('Moscow');
      expect(result).toEqual({ lat: 55.7558, lon: 37.6173, name: 'Moscow' });
    });

    it('должен выбрасывать ошибку если город не найден', async () => {
      (weatherService.getCityCoordinates as jest.Mock).mockRejectedValue(
        new Error('Город не найден')
      );

      await expect(weatherService.getCityCoordinates('UnknownCity')).rejects.toThrow('Город не найден');
    });
  });
});