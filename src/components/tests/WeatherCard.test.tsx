// src/components/tests/WeatherCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherCard from '../WeatherCard';

const mockWeatherData = {
  dt: Date.now() / 1000,
  main: {
    temp: 22.5,
    feels_like: 21.8,
    humidity: 55,
    pressure: 1015
  },
  weather: [{
    id: 800,
    main: 'Clear',
    description: 'ясно',
    icon: '01d'
  }],
  wind: {
    speed: 3.5
  }
};

describe('WeatherCard', () => {
  it('должен рендерить текущую погоду с деталями', () => {
    render(<WeatherCard weather={mockWeatherData} isCurrent={true} />);
    
    // Используем regex для поиска текста с возможными пробелами
    expect(screen.getByText(/23°C/)).toBeInTheDocument();
    expect(screen.getByText('ясно')).toBeInTheDocument();
    expect(screen.getByText(/Ощущается:/)).toBeInTheDocument();
    expect(screen.getByText(/Влажность:/)).toBeInTheDocument();
    expect(screen.getByText(/Давление:/)).toBeInTheDocument();
    expect(screen.getByText(/Ветер:/)).toBeInTheDocument();
  });

  it('должен рендерить прогноз без деталей', () => {
    render(<WeatherCard weather={mockWeatherData} isCurrent={false} />);
    
    expect(screen.getByText(/23°C/)).toBeInTheDocument();
    expect(screen.getByText('ясно')).toBeInTheDocument();
    expect(screen.queryByText(/Ощущается:/)).not.toBeInTheDocument();
  });

  it('должен форматировать время для прогноза', () => {
    const fixedTime = new Date('2024-01-01T12:00:00').getTime() / 1000;
    const forecastData = {
      ...mockWeatherData,
      dt: fixedTime
    };
    
    render(<WeatherCard weather={forecastData} isCurrent={false} />);
    
    // Проверяем наличие даты в любом формате
    expect(screen.getByText(/01\.01/)).toBeInTheDocument();
  });

  it('не должен рендерить ничего если weather не передан', () => {
    const { container } = render(<WeatherCard weather={null} />);
    expect(container.firstChild).toBeNull();
  });
});