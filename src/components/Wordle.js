import React, { useState, useEffect } from 'react';
import './Wordle.css';
import { WORD_CATEGORIES } from './wordleCategories';

const Wordle = ({ onBackToMenu }) => {
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [letterStates, setLetterStates] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryProgress, setCategoryProgress] = useState({});
  const [showCategorySelect, setShowCategorySelect] = useState(true);

  const getRandomCategory = () => {
    const categories = Object.keys(WORD_CATEGORIES);
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };

  // Replace existing WORD_LIST with category-based selection
  const selectCategory = (category) => {
    setCurrentCategory(category);
    setShowCategorySelect(false);
    // Initialize progress for this category if not exists
    if (!categoryProgress[category]) {
      setCategoryProgress(prev => ({
        ...prev,
        [category]: {
          completed: [],
          total: WORD_CATEGORIES[category].words.length
        }
      }));
    }
    // Select random unfinished word from category
    const availableWords = WORD_CATEGORIES[category].words.filter(
      word => !categoryProgress[category]?.completed.includes(word)
    );
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setTargetWord(randomWord);
  };

  useEffect(() => {
    // Pick a random word when game starts
    if (currentCategory) {
      const availableWords = WORD_CATEGORIES[currentCategory].words.filter(
        word => !categoryProgress[currentCategory]?.completed.includes(word)
      );
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setTargetWord(randomWord);
    }
  }, [currentCategory, categoryProgress]);

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        showMessage('Word must be 5 letters');
        return;
      }
      // Remove the word list validation
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      // Only allow letters
      if (/^[A-Z]$/.test(key)) {
        setCurrentGuess(prev => prev + key);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver]);

  // Modify submitGuess to track category progress
  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    // Update letter states
    const newLetterStates = { ...letterStates };
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      if (letter === targetWord[i]) {
        newLetterStates[letter] = 'correct';
      } else if (targetWord.includes(letter)) {
        if (newLetterStates[letter] !== 'correct') {
          newLetterStates[letter] = 'wrong-position';
        }
      } else {
        if (!newLetterStates[letter]) {
          newLetterStates[letter] = 'incorrect';
        }
      }
    }
    setLetterStates(newLetterStates);

    if (currentGuess === targetWord) {
      // Update category progress
      setCategoryProgress(prev => ({
        ...prev,
        [currentCategory]: {
          ...prev[currentCategory],
          completed: [...prev[currentCategory].completed, targetWord]
        }
      }));

      showMessage('Correct! Starting new category...');
      
      // Select new random category after brief delay
      setTimeout(() => {
        const newCategory = getRandomCategory();
        selectCategory(newCategory);
        setCurrentRow(0);
        setGuesses(Array(6).fill(''));
        setCurrentGuess('');
        setLetterStates({});
        setGameOver(false);
      }, 2000);
    } else if (currentRow === 5) {
      setGameOver(true);
      showMessage(`Game Over! The word was ${targetWord}`);
      
      // Select new random category after game over
      setTimeout(() => {
        const newCategory = getRandomCategory();
        selectCategory(newCategory);
        setCurrentRow(0);
        setGuesses(Array(6).fill(''));
        setCurrentGuess('');
        setLetterStates({});
        setGameOver(false);
      }, 3000);
    } else {
      setCurrentRow(prev => prev + 1);
      setCurrentGuess('');
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const getTileClass = (letter, index, rowIndex) => {
    if (rowIndex > currentRow) return '';
    if (rowIndex === currentRow) return '';
    if (letter === targetWord[index]) return 'correct';
    if (targetWord.includes(letter)) return 'wrong-position';
    return 'incorrect';
  };

  // Add category selection screen
  if (showCategorySelect) {
    return (
      <div className="wordle">
        <div className="game-header">
          <h1>Wordle Categories</h1>
          <button onClick={onBackToMenu} className="menu-button">
            Back to Menu
          </button>
        </div>
        <div className="category-grid">
          {Object.entries(WORD_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              className="category-button"
              onClick={() => selectCategory(key)}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-progress">
                {categoryProgress[key]?.completed.length || 0}/{category.words.length}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Add category info to game header
  return (
    <div className="wordle">
      <div className="game-header">
        <div className="header-content">
          <h1>Wordle: {WORD_CATEGORIES[currentCategory].name}</h1>
          <div className="category-info">
            {WORD_CATEGORIES[currentCategory].emoji}
            Progress: {categoryProgress[currentCategory]?.completed.length}/{WORD_CATEGORIES[currentCategory].total}
          </div>
        </div>
        <div className="header-buttons">
          <button onClick={() => setShowCategorySelect(true)} className="category-switch">
            Change Category
          </button>
          <button onClick={onBackToMenu} className="menu-button">
            Back to Menu
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="game-container">
        <div className="wordle-grid">
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="wordle-row">
              {Array(5).fill('').map((_, index) => {
                const letter = rowIndex === currentRow 
                  ? currentGuess[index] || ''
                  : guess[index] || '';
                return (
                  <div 
                    key={index} 
                    className={`wordle-tile ${getTileClass(letter, index, rowIndex)}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="keyboard">
          {[
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
          ].map((row, i) => (
            <div key={i} className="keyboard-row">
              {i === 2 && <button className="key" onClick={() => handleKeyPress('ENTER')}>ENTER</button>}
              {row.split('').map(key => (
                <button
                  key={key}
                  className={`key ${letterStates[key] || ''}`}
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </button>
              ))}
              {i === 2 && <button className="key" onClick={() => handleKeyPress('BACKSPACE')}>←</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wordle;