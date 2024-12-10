const express = require("express");
const gameController = require("../controllers/gameController");
const router = express.Router();

router.post("/start", gameController.startGame);
router.post("/attack", gameController.playerAttack);
router.post("/computer-turn", gameController.computerAttack);
router.get("/:gameId/stats", gameController.getStats);

module.exports = router;
