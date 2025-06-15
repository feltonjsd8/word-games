import React, { useState, useEffect } from 'react';
import '../styles/hangman.css';
import { getRandomWord, getWordDefinition } from '../services/dictionaryService';

const Hangman = ({ onBackToMenu }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(6);
  const [showDefinition, setShowDefinition] = useState(false);
  const [definition, setDefinition] = useState('');

  const startNewGame = async () => {
    const newWord = await getRandomWord();
    setWord(newWord);
    setGuessedLetters([]);
    setRemainingGuesses(6);
    setShowDefinition(false);
    setDefinition('');
  };

  useEffect(() => {
    startNewGame();
  }, []);

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

  const getHint = async () => {
    const wordDef = await getWordDefinition(word);
    setDefinition(wordDef.definitions[0]?.definition || 'No definition available');
    setShowDefinition(true);
  };

  const maskedWord = word
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const gameOver = remainingGuesses === 0;
  const hasWon = !maskedWord.includes('_');
  const mistakes = 6 - remainingGuesses;

  return (
    <div className="hangman">
      <div className="game-header">
        <h1>Hangman Game</h1>
        <div className="header-buttons">
          <button onClick={startNewGame} className="new-game-button">
            New Game
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
              onClick={getHint}
              disabled={showDefinition}
            >
              Get Hint
            </button>
          )}
          {showDefinition && definition && (
            <p className="clue-text">
              Hint: {definition}
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