const express = require('express');
const app = express()
const cors = require('cors');
const claudeController = require('./controllers/claude.controller')

app.use(express.json())
app.use(cors())

app.use('/claude', claudeController)

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to BattleLife'})
})

app.get('*', (req, res) => {
    res.status(404).json({ error: 'NOT FOUND'})
})

module.exports = app