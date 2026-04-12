// src/tests/App.simple.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Мокаем все компоненты, чтобы изолировать тестирование
jest.mock('../components/CitySelector', () => {
  return function MockCitySelector({ onCitySelect, isLoading }: any) {
    return (
      <div data-testid="city-selector">
        <input 
          data-testid="city-input"
          onChange={(e) => onCitySelect(e.target.value)}
          disabled={isLoading}
        />
        <button data-testid="search-button" onClick={() => onCitySelect('Москва')}>
          Поиск
        </button>
      </div>
    );
  };
});

jest.mock('../components/WeatherCard', () => {
  return function MockWeatherCard({ weather, isCurrent }: any) {
    if (!weather) return null;
    return (
      <div data-testid="weather-card">
        {isCurrent ? 'Текущая погода' : 'Прогноз'} - 
        Температура: {Math.round(weather.main?.temp)}°C
      </div>
    );
  };
});

jest.mock('../components/ForecastList', () => {
  return function MockForecastList({ forecasts }: any) {
    return (
      <div data-testid="forecast-list">
        Прогнозов: {forecasts?.list?.length || 0}
      </div>
    );
  };
});

jest.mock('../components/AirPollution', () => {
  return function MockAirPollution({ data }: any) {
    return (
      <div data-testid="air-pollution">
        Качество воздуха: AQI {data?.list?.[0]?.main?.aqi || 'N/A'}
      </div>
    );
  };
});

// Мокаем API сервисы
const mockGetCityCoordinates = jest.fn();
const mockGetCurrentWeather = jest.fn();
const mockGetForecast = jest.fn();
const mockGetAirPollution = jest.fn();

jest.mock('../services/weatherService', () => ({
  getCityCoordinates: (...args: any[]) => mockGetCityCoordinates(...args),
  getCurrentWeather: (...args: any[]) => mockGetCurrentWeather(...args),
  getForecast: (...args: any[]) => mockGetForecast(...args),
  getAirPollution: (...args: any[]) => mockGetAirPollution(...args),
  getWeatherIconUrl: jest.fn(() => 'test-icon-url')
}));

describe('App Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Настраиваем успешные ответы по умолчанию
    mockGetCityCoordinates.mockResolvedValue({ lat: 55.7558, lon: 37.6173, name: 'Москва' });
    mockGetCurrentWeather.mockResolvedValue({
      name: 'Москва',
      main: { temp: 22.5, feels_like: 21.8, humidity: 55, pressure: 1015 },
      weather: [{ id: 800, description: 'ясно', icon: '01d' }],
      wind: { speed: 3.5 }
    });
    mockGetForecast.mockResolvedValue({
      list: [
        { dt: Date.now() / 1000, main: { temp: 22.5 }, weather: [{ description: 'ясно' }] }
      ]
    });
    mockGetAirPollution.mockResolvedValue({
      list: [{ main: { aqi: 2 }, components: { pm2_5: 4.5 } }]
    });
  });

  it('должен рендерить приложение без ошибок', async () => {
    render(<App />);
    
    // Проверяем, что заголовок отображается
    expect(screen.getByText('Прогноз погоды')).toBeInTheDocument();
    
    // Ждем загрузки данных
    await waitFor(() => {
      expect(mockGetCityCoordinates).toHaveBeenCalled();
      expect(mockGetCurrentWeather).toHaveBeenCalled();
      expect(mockGetForecast).toHaveBeenCalled();
      expect(mockGetAirPollution).toHaveBeenCalled();
    });
    
    // Проверяем, что компоненты отрендерились
    await waitFor(() => {
      expect(screen.getByTestId('city-selector')).toBeInTheDocument();
      expect(screen.getByTestId('weather-card')).toBeInTheDocument();
      expect(screen.getByTestId('forecast-list')).toBeInTheDocument();
      expect(screen.getByTestId('air-pollution')).toBeInTheDocument();
    });
  });

  it('должен отображать ошибку при проблемах с загрузкой', async () => {
    mockGetCityCoordinates.mockRejectedValueOnce(new Error('Ошибка загрузки города'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ошибка/)).toBeInTheDocument();
    });
  });
});