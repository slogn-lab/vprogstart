// src/components/tests/CitySelector.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySelector from '../CitySelector';

describe('CitySelector', () => {
  const mockOnCitySelect = jest.fn();

  beforeEach(() => {
    mockOnCitySelect.mockClear();
  });

  it('должен рендерить инпут и кнопку', () => {
    render(<CitySelector onCitySelect={mockOnCitySelect} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Введите название города');
    const button = screen.getByText('Поиск');
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('должен вызывать onCitySelect при отправке формы с непустым значением', async () => {
    render(<CitySelector onCitySelect={mockOnCitySelect} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Введите название города');
    const button = screen.getByText('Поиск');
    
    await userEvent.type(input, 'Москва');
    fireEvent.click(button);
    
    expect(mockOnCitySelect).toHaveBeenCalledWith('Москва');
    expect(input).toHaveValue('');
  });

  it('не должен вызывать onCitySelect при отправке пустой формы', async () => {
    render(<CitySelector onCitySelect={mockOnCitySelect} isLoading={false} />);
    
    const button = screen.getByText('Поиск');
    fireEvent.click(button);
    
    expect(mockOnCitySelect).not.toHaveBeenCalled();
  });

  it('должен отключать инпут и кнопку при загрузке', () => {
    render(<CitySelector onCitySelect={mockOnCitySelect} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Введите название города');
    const button = screen.getByText('Загрузка...');
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('должен обрабатывать нажатие Enter', async () => {
    render(<CitySelector onCitySelect={mockOnCitySelect} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Введите название города');
    await userEvent.type(input, 'Санкт-Петербург{enter}');
    
    expect(mockOnCitySelect).toHaveBeenCalledWith('Санкт-Петербург');
  });
});