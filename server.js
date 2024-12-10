const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3333;

app.use(bodyParser.json());
app.use(cors());

// Routes
const gameRoutes = require('./routes/gameRoutes');
app.use('/api', gameRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
