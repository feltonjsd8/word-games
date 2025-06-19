import React from 'react';
import '../styles/Menu.css';

const Menu = ({ onSelectGame }) => {
  return (
    <div className="game-menu">
      <h1>Word Games</h1>
      <div className="menu-buttons">
        <button onClick={() => onSelectGame('hangman')}>
          Hangman
        </button>
        <button onClick={() => onSelectGame('wordle')}>
          Eleanordle
        </button>
      </div>
    </div>
  );
};

export default Menu;