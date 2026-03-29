import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // Получаем список книг из API
      const response = await fetch('https://fakeapi.extendsclass.com/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const booksData = await response.json();
      
      // Для каждой книги получаем изображение из Google Books API
      const booksWithImages = await Promise.all(
        booksData.map(async (book) => {
          const imageBlob = await fetchBookImage(book.isbn);
          return {
            ...book,
            imageBlob: imageBlob
          };
        })
      );
      
      setBooks(booksWithImages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchBookImage = async (isbn) => {
    try {
      // Поиск книги по ISBN
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const data = await response.json();
      
      // Проверяем, есть ли результаты и изображение
      if (data.items && data.items[0] && data.items[0].volumeInfo.imageLinks) {
        const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
        
        // Получаем изображение как BLOB
        const imageResponse = await fetch(imageUrl);
        const blob = await imageResponse.blob();
        return blob;
      }
      
      // Возвращаем null, если изображение не найдено
      return null;
    } catch (error) {
      console.error(`Error fetching image for ISBN ${isbn}:`, error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="app-title">Book Library</h1>
      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            authors={book.authors}
            imageBlob={book.imageBlob}
          />
        ))}
      </div>
    </div>
  );
};

export default App;