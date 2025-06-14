import React from 'react';
import './Menu.css';

const Menu = ({ onSelectGame }) => {
  return (
    <div className="game-menu">
      <h1>Word Games</h1>
      <div className="menu-buttons">
        <button onClick={() => onSelectGame('hangman')}>
          Hangman
        </button>
        <button onClick={() => onSelectGame('wordle')}>
          Wordle
        </button>
      </div>
    </div>
  );
};

export default Menu;