// src/components/tests/ForecastList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ForecastList from '../ForecastList';

const mockForecasts = {
  list: [
    {
      dt: Date.now() / 1000,
      main: { temp: 22.5, feels_like: 21.8, humidity: 55, pressure: 1015 },
      weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
      wind: { speed: 3.5 }
    },
    {
      dt: (Date.now() + 3 * 3600 * 1000) / 1000,
      main: { temp: 21.0, feels_like: 20.5, humidity: 58, pressure: 1013 },
      weather: [{ id: 801, main: 'Clouds', description: 'облачно', icon: '02d' }],
      wind: { speed: 4.0 }
    },
    {
      dt: (Date.now() + 6 * 3600 * 1000) / 1000,
      main: { temp: 19.5, feels_like: 19.0, humidity: 65, pressure: 1012 },
      weather: [{ id: 500, main: 'Rain', description: 'дождь', icon: '10d' }],
      wind: { speed: 5.2 }
    }
  ]
};

describe('ForecastList', () => {
  it('должен рендерить заголовок', () => {
    render(<ForecastList forecasts={mockForecasts.list} />);
    expect(screen.getByText('Прогноз на ближайшие часы')).toBeInTheDocument();
  });

  it('должен показывать следующие прогнозы', () => {
    render(<ForecastList forecasts={mockForecasts.list} />);
    
    // Просто проверяем, что есть элементы с температурой
    const tempElements = screen.getAllByText(/°C/);
    expect(tempElements.length).toBeGreaterThan(0);
    
    // Проверяем наличие описаний погоды
    expect(screen.getByText('облачно')).toBeInTheDocument();
    expect(screen.getByText('дождь')).toBeInTheDocument();
  });

  it('должен показывать сообщение при отсутствии данных', () => {
    render(<ForecastList forecasts={null} />);
    expect(screen.getByText('Нет данных прогноза')).toBeInTheDocument();
  });

  it('должен показывать сообщение при пустом массиве', () => {
    render(<ForecastList forecasts={[]} />);
    expect(screen.getByText('Нет данных прогноза')).toBeInTheDocument();
  });
});