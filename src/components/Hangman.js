import React, { useState } from 'react';
import '../styles/hangman.css';
import { CATEGORIES } from './categories';

const Hangman = ({ onBackToMenu }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(6);
  const [showClue, setShowClue] = useState(false);

  const selectCategory = (category) => {
    const categoryWords = Object.keys(CATEGORIES[category].words);
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    setSelectedCategory(category);
    setWord(randomWord);
    setGuessedLetters([]);
    setRemainingGuesses(6);
    setShowClue(false);
  };

  const startNewGame = () => {
    setSelectedCategory(null);
    setWord('');
    setGuessedLetters([]);
    setRemainingGuesses(6);
    setShowClue(false);
  };

  const drawHangman = (mistakes) => (
    <svg height="250" width="200">
      {/* Stand */}
      <line x1="60" y1="20" x2="140" y2="20" stroke="black" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="black" />
      <line x1="60" y1="20" x2="60" y2="230" stroke="black" />
      <line x1="20" y1="230" x2="100" y2="230" stroke="black" />

      {/* Head */}
      {mistakes > 0 && (
        <circle cx="140" cy="70" r="20" stroke="black" fill="none" />
      )}
      
      {/* Body */}
      {mistakes > 1 && (
        <line x1="140" y1="90" x2="140" y2="150" stroke="black" />
      )}
      
      {/* Left Arm */}
      {mistakes > 2 && (
        <line x1="140" y1="120" x2="120" y2="100" stroke="black" />
      )}
      
      {/* Right Arm */}
      {mistakes > 3 && (
        <line x1="140" y1="120" x2="160" y2="100" stroke="black" />
      )}
      
      {/* Left Leg */}
      {mistakes > 4 && (
        <line x1="140" y1="150" x2="120" y2="180" stroke="black" />
      )}
      
      {/* Right Leg */}
      {mistakes > 5 && (
        <line x1="140" y1="150" x2="160" y2="180" stroke="black" />
      )}
    </svg>
  );

  const guessLetter = (letter) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!word.includes(letter)) {
        setRemainingGuesses(remainingGuesses - 1);
      }
    }
  };

  const maskedWord = word
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const gameOver = remainingGuesses === 0;
  const hasWon = !maskedWord.includes('_');
  const mistakes = 6 - remainingGuesses;

  // If no category is selected, show category selection screen
  if (!selectedCategory) {
    return (
      <div className="hangman">
        <h1>Hangman Game</h1>
        <div className="category-selection">
          <div className="category-dropdown">
            <select 
              onChange={(e) => selectCategory(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select a category...</option>
              {Object.keys(CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {CATEGORIES[category].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hangman">
      <div className="game-header">
        <h1>Hangman Game</h1>
        <div className="header-buttons">
          <button onClick={startNewGame} className="new-game-button">
            Change Category
          </button>
          <button onClick={onBackToMenu} className="menu-button">
            Back to Menu
          </button>
        </div>
      </div>
      <div className="game-container">
        {drawHangman(mistakes)}
        <div className="stats">
          <p>Remaining Guesses: {remainingGuesses}</p>
          {!gameOver && !hasWon && (
            <button 
              className="clue-button" 
              onClick={() => setShowClue(true)}
              disabled={showClue}
            >
              Get Clue
            </button>
          )}
          {showClue && (
            <p className="clue-text">
              Clue: {CATEGORIES[selectedCategory].words[word]}
            </p>
          )}
        </div>
      </div>
      <div className="word">{maskedWord}</div>
      
      {!gameOver && !hasWon && (
        <div className="letters">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => guessLetter(letter)}
              disabled={guessedLetters.includes(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      {(gameOver || hasWon) && (
        <div className="game-end">
          <h2>{hasWon ? 'Congratulations! You won!' : 'Game Over!'}</h2>
          <p>The word was: {word}</p>
        </div>
      )}
    </div>
  );
};

export default Hangman;