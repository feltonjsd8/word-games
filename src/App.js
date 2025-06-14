import React, { useState } from 'react';
import Menu from './components/Menu';
import Hangman from './components/Hangman';
import Wordle from './components/Wordle';
import './App.css';

const App = () => {
  const [currentGame, setCurrentGame] = useState(null);

  const handleGameSelect = (game) => {
    setCurrentGame(game);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  // Render appropriate component based on game selection
  const renderGame = () => {
    switch (currentGame) {
      case 'hangman':
        return <Hangman onBackToMenu={handleBackToMenu} />;
      case 'wordle':
        return <Wordle onBackToMenu={handleBackToMenu} />;
      default:
        return <Menu onSelectGame={handleGameSelect} />;
    }
  };

  return (
    <div className="app">
      {renderGame()}
    </div>
  );
};

export default App;