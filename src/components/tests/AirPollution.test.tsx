// src/components/tests/AirPollution.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AirPollution from '../AirPollution';

const mockAirPollutionData = {
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

describe('AirPollution', () => {
  it('должен рендерить информацию о качестве воздуха', () => {
    render(<AirPollution data={mockAirPollutionData} />);
    
    expect(screen.getByText('Качество воздуха')).toBeInTheDocument();
    expect(screen.getByText('AQI: 2')).toBeInTheDocument();
    expect(screen.getByText('Удовлетворительно')).toBeInTheDocument();
  });

  it('должен отображать компоненты загрязнения', () => {
    render(<AirPollution data={mockAirPollutionData} />);
    
    expect(screen.getByText(/PM2.5:/)).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    expect(screen.getByText(/PM10:/)).toBeInTheDocument();
    expect(screen.getByText(/6.2/)).toBeInTheDocument();
  });

  it('должен показывать правильный цвет для AQI', () => {
    render(<AirPollution data={mockAirPollutionData} />);
    
    const aqiIndicator = screen.getByText('AQI: 2').parentElement;
    expect(aqiIndicator).toHaveStyle('background-color: #ffeb3b');
  });

  it('должен обрабатывать отсутствие данных', () => {
    render(<AirPollution data={null} />);
    
    expect(screen.getByText('Нет данных о качестве воздуха')).toBeInTheDocument();
  });

  it('должен обрабатывать пустой список', () => {
    const emptyData = { list: [] };
    render(<AirPollution data={emptyData} />);
    
    expect(screen.getByText('Нет данных о качестве воздуха')).toBeInTheDocument();
  });
});