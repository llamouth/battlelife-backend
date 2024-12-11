const axios = require('axios');
const Anthropic = require('@anthropic/anthropic');

const anthropic = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true,
})

require('dotenv').config();
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

const fetchScenario = async (action) => {
    const { shipType } = action;

    try {
        const scenarioTemplates = {
            health: "Describe an unexpected medical challenge or lifestyle change.",
            relationships: "Describe a complex interpersonal challenge.",
            money: "Describe an unexpected economic hurdle.",
            looks: "Describe a scenario challenging self-perception.",
            home: "Describe an unexpected housing scenario."
            };
    
            if (!scenarioTemplates[shipType]) {
            throw new Error(`Invalid ship type: ${shipType}`);
            }
    
            const prompt = `
        BATTLESHIP LIFE SIMULATOR SCENARIO:
    
        You are targeting a Life Ship of type: ${shipType}
        Each ship represents a crucial aspect of life that can be "hit" with unexpected challenges.
        This is a ${shipType.toUpperCase()} class vessel, representing ${scenarioTemplates[shipType]}
    
        Create a life-changing event that would "hit" this aspect of life:
        1. A BRIEF hit type (2-3 words describing the type of life challenge)
        2. A DETAILED scenario (3-4 sentences about how this life challenge unfolds)
        3. Potential CONSEQUENCES (how this "hit" affects the player's life journey)
        4. THREE different choices the player can make to respond to this situation
    
        Remember: This is a critical hit on the ${shipType} ship - make it impactful but survivable.
        Each choice should have different potential outcomes and risks.
    
        Format your response exactly as:
        Hit Type: [concise description]
        Scenario: [narrative description]
        Consequences: [impact on the character]`;
    
        const msg = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [{role: 'user', content: prompt}],
        })

        const response = JSON.parse(msg.content[0].text)
        return response; // Returns the generated scenario
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
  