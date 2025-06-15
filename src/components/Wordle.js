import React, { useState, useEffect } from 'react';
import '../styles/Wordle.css';
import { WORD_CATEGORIES } from './wordleCategories';
import { getRandomWord } from '../services/dictionaryService';

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
  const [evaluations, setEvaluations] = useState(Array(6).fill(null));
  const [revealedLetters, setRevealedLetters] = useState(Array(6).fill(Array(5).fill(false)));
  const [isLoading, setIsLoading] = useState(false);

  const selectCategory = async (category) => {
    setCurrentCategory(category);
    setShowCategorySelect(false);
    setIsLoading(true);

    // Initialize progress for this category if not exists
    if (!categoryProgress[category]) {
      setCategoryProgress(prev => ({
        ...prev,
        [category]: {
          completed: [],
          total: 100 // Set a default total for progress tracking
        }
      }));
    }

    try {
      const excludedWords = categoryProgress[category]?.completed || [];
      const newWord = await getRandomWord(category, excludedWords);
      setTargetWord(newWord);
    } catch (error) {
      console.error('Error selecting word:', error);
      showMessage('Error loading word. Please try again.');
      setShowCategorySelect(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomCategory = () => {
    const categories = Object.keys(WORD_CATEGORIES);
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };

  // Replace existing WORD_LIST with category-based selection
  // const selectCategory = (category) => {
  //   setCurrentCategory(category);
  //   setShowCategorySelect(false);
  //   // Initialize progress for this category if not exists
  //   if (!categoryProgress[category]) {
  //     setCategoryProgress(prev => ({
  //       ...prev,
  //       [category]: {
  //         completed: [],
  //         total: WORD_CATEGORIES[category].words.length
  //       }
  //     }));
  //   }
  //   // Select random unfinished word from category
  //   const availableWords = WORD_CATEGORIES[category].words.filter(
  //     word => !categoryProgress[category]?.completed.includes(word)
  //   );
  //   const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  //   setTargetWord(randomWord);
  // };

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

  const evaluateGuess = (guess, target) => {
    const evaluation = Array(5).fill('incorrect');
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark correct positions
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        evaluation[i] = 'correct';
        targetLetters[i] = null;
        guessLetters[i] = null;
      }
    }
    
    // Second pass: mark wrong positions
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === null) continue;
      
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      if (targetIndex !== -1) {
        evaluation[i] = 'wrong-position';
        targetLetters[targetIndex] = null;
      }
    }
    
    return evaluation;
  };

  // Modify submitGuess to track category progress
  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    // Evaluate the current guess
    const evaluation = evaluateGuess(currentGuess, targetWord);
    const newEvaluations = [...evaluations];
    newEvaluations[currentRow] = evaluation;
    setEvaluations(newEvaluations);

    // Update letter states
    const newLetterStates = { ...letterStates };
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      const status = evaluation[i];
      if (status === 'correct') {
        newLetterStates[letter] = 'correct';
      } else if (status === 'wrong-position' && newLetterStates[letter] !== 'correct') {
        newLetterStates[letter] = 'wrong-position';
      } else if (!newLetterStates[letter]) {
        newLetterStates[letter] = 'incorrect';
      }
    }
    setLetterStates(newLetterStates);    
    const isCorrect = currentGuess === targetWord;
    
    if (isCorrect) {
      setGameOver(true);
      // Update category progress
      setCategoryProgress(prev => ({
        ...prev,
        [currentCategory]: {
          ...prev[currentCategory],
          completed: [...prev[currentCategory].completed, targetWord]
        }
      }));

      // Show success message after a brief delay to allow animation to complete
      setTimeout(() => {
        showMessage('Correct! Starting new category...');
      }, 1500);
      
      // Select new random category after animation and message
      setTimeout(() => {
        const newCategory = getRandomCategory();
        selectCategory(newCategory);
        setCurrentRow(0);
        setGuesses(Array(6).fill(''));
        setCurrentGuess('');
        setLetterStates({});
        setGameOver(false);
        setEvaluations(Array(6).fill(null));
      }, 3000);
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
        setEvaluations(Array(6).fill(null));
      }, 3000);
    } else {
      setCurrentRow(prev => prev + 1);
      setCurrentGuess('');
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };  const getTileClass = (letter, index, rowIndex) => {
    if (rowIndex > currentRow) return '';
    
    const classes = [];
    
    // Add evaluation classes for submitted rows
    if (rowIndex < currentRow) {
      const evaluation = evaluations[rowIndex];
      if (evaluation) {
        classes.push(evaluation[index]);
      }
    }
    
    // Add flip animation class for the last submitted row
    if (rowIndex === currentRow - 1 || (rowIndex === currentRow && gameOver)) {
      classes.push('flip');
    }
    
    // Handle correct guess case
    if (rowIndex === currentRow && evaluations[rowIndex]) {
      classes.push(evaluations[rowIndex][index]);
    }
    
    return classes.join(' ');
  };

  const getFlipDelay = (index) => ({
    '--flip-delay': `${index * 200}ms`
  });

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
              disabled={isLoading}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-progress">
                {categoryProgress[key]?.completed.length || 0} words completed
              </span>
            </button>
          ))}
        </div>
        {isLoading && <div className="loading">Loading words...</div>}
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
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className={`wordle-tile ${getTileClass(guess[index], index, rowIndex)}`}
                  style={getFlipDelay(index)}
                >
                  {rowIndex === currentRow && index < currentGuess.length
                    ? currentGuess[index]
                    : guess[index] || ''}
                </div>
              ))}
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