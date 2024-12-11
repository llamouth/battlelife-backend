const express = require('express');
const claude = express.Router();
const { fetchScenario, fetchSummary } = require('../queries/claude.queries')

// Function to generate a scenario
claude.post('/generate-scenario', async (req, res) => {

  if (!req.body) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const scenario = await fetchScenario(req.body);
    res.status(200).json({ scenario });
  } catch (error) {
    console.error('Error fetching scenario from Claude API:', error.message);
    res.status(500).json({ error: 'Failed to generate scenario' });
  }
});

claude.post('/generate-summary', async (req, res) => {
  const { health, money, relationships, career, home } = req.body;

  if (!health ||!money ||!relationships ||!career ||!home) {
    return res.status(400).json({ error: 'All final stats are required' });
  }

  try {
    const summary = await fetchSummary(req.body);
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating summary with Claude API:', error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = claude;