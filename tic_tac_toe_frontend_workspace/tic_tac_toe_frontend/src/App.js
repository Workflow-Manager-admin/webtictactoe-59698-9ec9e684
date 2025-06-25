import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Color theme variables. For easy customization, use the actual colors from the configuration:
 * primary: #1976d2, secondary: #424242, accent: #ffca28
 */

// PUBLIC_INTERFACE
function GameBoard({ squares, onSquareClick, isGameOver }) {
  return (
    <div className="ttt-board">
      {squares.map((value, i) => (
        <button
          key={i}
          type="button"
          className="ttt-square"
          onClick={() => onSquareClick(i)}
          disabled={Boolean(value) || isGameOver}
          aria-label={`Cell ${i + 1} (${Math.floor(i / 3)}, ${i % 3})`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function GameStatus({ winner, boardFull, currentPlayer }) {
  let text = "";
  if (winner) {
    text = `Winner: ${winner === "X" ? "Player 1 (X)" : "Player 2 (O)"}`;
  } else if (boardFull) {
    text = "It's a draw!";
  } else {
    text = `Current turn: ${currentPlayer === "X" ? "Player 1 (X)" : "Player 2 (O)"}`;
  }
  return <div className="ttt-status">{text}</div>;
}

// PUBLIC_INTERFACE
function RestartButton({ onRestart }) {
  return (
    <button className="ttt-restart-btn" type="button" onClick={onRestart}>
      Restart Game
    </button>
  );
}

/**
 * Returns "X", "O", or null if no winner
 */
// PUBLIC_INTERFACE
function calculateWinner(sq) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of wins) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Squares: board state (null | "X" | "O"), array of 9.
  const [squares, setSquares] = useState(Array(9).fill(null));
  // Next player: "X" or "O"
  const [xIsNext, setXIsNext] = useState(true);
  // Theme (light only, but allow toggle for demo/modern completeness)
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Determine winner and board-full
  const winner = calculateWinner(squares);
  const boardFull = squares.every(Boolean);
  const currentPlayer = xIsNext ? "X" : "O";
  const isGameOver = Boolean(winner) || boardFull;

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (squares[i] || isGameOver) return;
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="App">
      <header className="ttt-centered-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <GameStatus winner={winner} boardFull={boardFull && !winner} currentPlayer={currentPlayer} />
        <GameBoard squares={squares} onSquareClick={handleSquareClick} isGameOver={isGameOver} />
        <RestartButton onRestart={handleRestart} />
        <div className="ttt-footer">
          <span>
            <span className="ttt-footer-accent">Player 1</span>: X&nbsp;|&nbsp;
            <span className="ttt-footer-primary">Player 2</span>: O
          </span>
        </div>
      </header>
    </div>
  );
}

export default App;
