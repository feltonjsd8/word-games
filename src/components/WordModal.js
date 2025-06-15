import React from 'react';
import '../styles/WordModal.css';

const WordModal = ({ isOpen, onClose, word, definition, isSuccess, onNextWord }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className={`modal-header ${isSuccess ? 'success' : 'failure'}`}>
                    <h2>{isSuccess ? 'Congratulations!' : 'Game Over'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="word-section">
                        <h3>The word was: <span className="highlighted-word">{word}</span></h3>
                        {definition?.phonetic && (
                            <p className="phonetic">{definition.phonetic}</p>
                        )}
                    </div>
                    <div className="definitions-section">
                        {definition?.definitions?.map((def, index) => (
                            <div key={index} className="definition-item">
                                {def.partOfSpeech && (
                                    <span className="part-of-speech">{def.partOfSpeech}</span>
                                )}
                                <p className="definition">{def.definition}</p>
                                {def.example && (
                                    <p className="example">Example: "{def.example}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    {isSuccess ? (
                        <button className="next-word-button" onClick={onNextWord}>
                            Next Word
                        </button>
                    ) : (
                        <button className="try-again-button" onClick={onNextWord}>
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WordModal;
