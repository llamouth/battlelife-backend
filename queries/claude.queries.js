const axios = require('axios');
require('dotenv').config();
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

const fetchScenario = async (action) => {
    const { hitType, shipType } = action;

    try {
        const prompt = `A hit occurred on the ${shipType} ship. Determine what kind of hit it was and generate a realistic scenario that aligns with this situation. Provide a brief hit type (e.g., "unexpected expense") and a scenario.`;
    
        const response = await axios.post(
            'https://api.claude.ai/generate',
            { prompt },
            {
            headers: {
                Authorization: `${CLAUDE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            }
        );
    
        return response.data.result; // Returns the generated scenario
    } catch (error) {
        console.log(error);
        console.error('Error fetching scenario from Claude API:', error.message);
        throw new Error('Failed to fetch scenario');
    }
};

const fetchSummary = async (user) => {
    const { health, money, relationships, career, home } = req.body;

    if (!user) {
    return res.status(400).json({ error: 'Final stats are required' });
    }

    try {
    const prompt = `
        Based on the following final stats, write a story summarizing the player's journey during the game:
        - Health: ${health}
        - Money: ${money}
        - Relationships: ${relationships}
        - Career: ${career}
        - Home: ${home}
        
        Include details about how they overcame challenges and what their final outcome looks like.
    `;

    const response = await axios.post(
        'https://api.claude.ai/generate',
        { prompt },
        {
        headers: {
            Authorization: `Bearer ${CLAUDE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        }
    );

    const story = response.data.result;
    return story
    } catch (error) {
      console.error('Error generating summary with Claude API:', error.message);
      res.status(500).json({ error: 'Failed to generate summary' });
    }
};
  
  module.exports = {
    fetchScenario,
    fetchSummary
  };
  