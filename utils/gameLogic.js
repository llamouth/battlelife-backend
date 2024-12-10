const placeShipRandomly = (grid, ship) => {
    let placed = false;
    const directions = ['horizontal', 'vertical'];
  
    while (!placed) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * 10);
      const startCol = Math.floor(Math.random() * 10);
      let canPlace = true;
  
      // Check placement validity
      for (let i = 0; i < ship.size; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;
  
        if (
          row >= 10 ||
          col >= 10 ||
          grid[row][col] !== null
        ) {
          canPlace = false;
          break;
        }
      }
  
      if (canPlace) {
        // Place the ship
        for (let i = 0; i < ship.size; i++) {
          const row = direction === 'horizontal' ? startRow : startRow + i;
          const col = direction === 'horizontal' ? startCol + i : startCol;
          grid[row][col] = ship.name;
          ship.positions.push({ row, col });
        }
        placed = true;
      }
    }
  };
  
  const validateAttack = (grid, row, col) => {
    if (row < 0 || col < 0 || row >= 10 || col >= 10) {
      return { valid: false, message: 'Invalid coordinates.' };
    }
  
    const cell = grid[row][col];
    if (cell === null) {
      return { valid: true, hit: false };
    } else if (cell === 'hit' || cell === 'miss') {
      return { valid: false, message: 'Cell already targeted.' };
    }
  
    return { valid: true, hit: true, ship: cell };
  };

  const checkWinCondition = (ships) => {
    return ships.every((ship) => ship.isSunk());
  };

  module.exports = { placeShipRandomly, validateAttack, checkWinCondition };
  