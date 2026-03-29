import React, { useState, useEffect } from 'react';
import './BookCard.css';

const BookCard = ({ title, authors, imageBlob }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (imageBlob) {
      // Создаем URL из BLOB для отображения изображения
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      
      // Очищаем URL при размонтировании компонента
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }
  }, [imageBlob]);

  return (
    <div className="book-card">
      <div className="book-cover">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Cover of ${title}`}
            className="book-image"
          />
        ) : (
          <div className="placeholder-image">
            <span>No Cover</span>
          </div>
        )}
      </div>
      <h2 className="book-title">{title}</h2>
      <p className="book-authors">
        {authors && authors.length > 0 
          ? authors.join(', ') 
          : 'Unknown Author'}
      </p>
    </div>
  );
};

export default BookCard;