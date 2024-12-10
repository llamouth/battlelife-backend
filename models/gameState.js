function createEmptyGrid() {
  return Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
}

function createGameState(playerName) {
  return {
    playerName,
    playerBoard: createEmptyGrid(),
    computerBoard: createEmptyGrid(),
    playerShips: [],
    computerShips: [],
    playerStats: {
      morale: 100,
      health: 100,
      money: 100,
      relationships: 100,
      career: 100,
      home: 100,
    },
    computerStats: {
      morale: 100,
      health: 100,
      money: 100,
      relationships: 100,
      career: 100,
      home: 100,
    },
  };
}

module.exports = {
  createGameState,
  createEmptyGrid,
};
