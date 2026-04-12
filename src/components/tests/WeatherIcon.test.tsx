// src/components/tests/WeatherIcon.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherIcon from '../WeatherIcon';

describe('WeatherIcon', () => {
  it('должен рендерить изображение с правильным URL', () => {
    const iconCode = '01d';
    render(<WeatherIcon iconCode={iconCode} description="ясно" />);
    
    const img = screen.getByAltText('ясно');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
  });

  it('должен применять кастомный размер', () => {
    const size = 120;
    render(<WeatherIcon iconCode="01d" description="ясно" size={size} />);
    
    const img = screen.getByAltText('ясно');
    expect(img).toHaveStyle(`width: ${size}px`);
    expect(img).toHaveStyle(`height: ${size}px`);
  });

  it('должен использовать размер по умолчанию 80', () => {
    render(<WeatherIcon iconCode="01d" description="ясно" />);
    
    const img = screen.getByAltText('ясно');
    expect(img).toHaveStyle('width: 80px');
    expect(img).toHaveStyle('height: 80px');
  });
});