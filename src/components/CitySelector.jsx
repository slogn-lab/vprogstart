import React, { useState } from 'react';

const CitySelector = ({ onCitySelect, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onCitySelect(city);
      setCity('');
    }
  };

  return (
    <form className="city-selector" onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Введите название города"
        disabled={isLoading}
        className="city-input"
      />
      <button type="submit" disabled={isLoading} className="search-button">
        {isLoading ? 'Загрузка...' : 'Поиск'}
      </button>
    </form>
  );
};

export default CitySelector;