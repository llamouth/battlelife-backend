const { initializeBoard, randomShipPlacement, validateAttack, applyHitEffect } = require("../utils/gameLogic");

// In-memory game state
const games = {};

// Helper function to generate a new game ID
const generateGameId = () => `game-${Date.now()}`;

// Controller Functions
module.exports = {
  // Start a new game
  startGame: (req, res) => {
    const { playerName, playerShips } = req.body;

    if (!playerName || !playerShips || playerShips.length !== 5) {
      return res.status(400).json({ message: "Invalid game setup. Provide a name and all 5 ships." });
    }

    const gameId = generateGameId();
    const playerBoard = initializeBoard(playerShips); // Player's custom board
    const computerShips = randomShipPlacement(); // Computer places ships randomly
    const computerBoard = initializeBoard(computerShips);

    // Store game state
    games[gameId] = {
      playerName,
      playerBoard,
      playerStats: { morale: 100, health: 100, perks: [] },
      computerBoard,
      computerStats: { morale: 100, health: 100, perks: [] },
      history: [], // Tracks events during gameplay
      currentPlayer: "player",
    };

    return res.status(200).json({ gameId, playerBoard, computerBoardPreview: computerBoard.map(row => row.map(() => null)) });
  },

  // Player attacks the computer
  playerAttack: (req, res) => {
    const { gameId, x, y } = req.body;
    const game = games[gameId];

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    if (game.currentPlayer !== "player") {
      return res.status(400).json({ message: "It's not the player's turn." });
    }

    const { result, shipName } = validateAttack(game.computerBoard, x, y);

    if (result === "miss") {
      game.currentPlayer = "computer";
      game.history.push(`Player missed at (${x}, ${y}).`);
      return res.status(200).json({ message: "Miss!", moraleChange: 0 });
    }

    // Apply perks and morale changes for successful hits
    const effect = applyHitEffect(shipName, true);
    game.playerStats.perks.push(effect.perk);
    game.computerStats.morale -= effect.moralePenalty;
    game.history.push(`Player hit the computer's ${shipName} at (${x}, ${y}). ${effect.message}`);

    // Check if the ship is sunk
    if (effect.isSunk) {
      game.history.push(`Player sank the computer's ${shipName}!`);
    }

    // Check win condition
    const allShipsSunk = game.computerBoard.every((row) => row.every((cell) => cell === null || cell === "hit"));
    if (allShipsSunk) {
      return res.status(200).json({ message: "You won the game!", victory: true });
    }

    return res.status(200).json({
      message: effect.message,
      moraleChange: effect.moralePenalty,
      isSunk: effect.isSunk,
    });
  },

  // Computer attacks the player
  computerAttack: (req, res) => {
    const { gameId } = req.body;
    const game = games[gameId];

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    if (game.currentPlayer !== "computer") {
      return res.status(400).json({ message: "It's not the computer's turn." });
    }

    // Randomly select a target on the player's board
    const [x, y] = randomTarget(game.playerBoard);

    const { result, shipName } = validateAttack(game.playerBoard, x, y);

    if (result === "miss") {
      game.currentPlayer = "player";
      game.history.push(`Computer missed at (${x}, ${y}).`);
      return res.status(200).json({ message: "Computer missed!", moraleChange: 0 });
    }

    // Apply damage and morale changes for successful hits
    const effect = applyHitEffect(shipName, false);
    game.playerStats.morale -= effect.moralePenalty;
    game.history.push(`Computer hit your ${shipName} at (${x}, ${y}). ${effect.message}`);

    // Check if the ship is sunk
    if (effect.isSunk) {
      game.history.push(`Computer sank your ${shipName}!`);
    }

    // Check loss condition
    const allShipsSunk = game.playerBoard.every((row) => row.every((cell) => cell === null || cell === "hit"));
    if (allShipsSunk) {
      return res.status(200).json({ message: "You lost the game!", defeat: true });
    }

    return res.status(200).json({
      message: effect.message,
      moraleChange: effect.moralePenalty,
      isSunk: effect.isSunk,
    });
  },

  // Get game stats and history
  getStats: (req, res) => {
    const { gameId } = req.params;
    const game = games[gameId];

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    return res.status(200).json({
      playerStats: game.playerStats,
      computerStats: game.computerStats,
      history: game.history,
    });
  },
};
