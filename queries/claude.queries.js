require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const { parseScenarioResponse, parseSummaryResponse } = require('../Utils/claudeUtils');
const CLAUDE_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
const anthropic = new Anthropic({ 
    apiKey: CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
 });

// Fetch Scenario Function
const fetchScenario = async ({shipType}) => {
    try {
        // Predefined scenario templates
        const scenarioTemplates = {
            health: "an unexpected medical challenge or lifestyle change.",
            relationships: "a complex interpersonal challenge.",
            money: "an unexpected economic hurdle.",
            looks: "a scenario challenging self-perception.",
            home: "an unexpected housing scenario."
        };

        if (!scenarioTemplates[shipType]) {
            throw new Error(`Invalid ship type: ${shipType}`);
        }

        const prompt = `
            BATTLESHIP LIFE SIMULATOR SCENARIO:

            You are targeting a Life Ship of type: ${shipType}.
            Each ship represents a crucial aspect of life that can be "hit" with unexpected challenges.
            This is a ${shipType.toUpperCase()} class vessel, representing ${scenarioTemplates[shipType]}.

            Create a life-changing event that would "hit" this aspect of life:
            1. A BRIEF hit type (2-3 words describing the type of life challenge).
            2. A DETAILED scenario (3-4 sentences about how this life challenge unfolds).
            3. Potential CONSEQUENCES (how this "hit" affects the player's life journey).

            Remember: This is a critical hit on the ${shipType} ship - make it impactful but survivable.

            Format your response exactly as:

            Hit Type: [concise description]
            Scenario: [narrative description]
            Consequences: [impact on the character]
        `;

        const response = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        });

        return parseScenarioResponse(response.content[0].text);
    } catch (error) {
        console.error("Error generating scenario:", error);
        throw new Error("Failed to generate scenario");
    }
};

// Fetch Summary Function
const fetchSummary = async (finalStats) => {
    
    const { health, money, relationships, career, home } = finalStats;

    try {
        const prompt = `
            Create a BRIEF summary (maximum 3-4 sentences) of the player's life journey based on these final stats on a scale of 1-10 in a first person perspective:
            - Health: ${health}
            - Money: ${money}
            - Relationships: ${relationships}
            - Career: ${career}
            - Home: ${home}

            Focus only on the most significant achievements or challenges. Keep it concise but detailed and engaging. giving specific information about the player's journey no actual number necessary. (e.g, "He had 3000 dollars in his bank account, but he lost it all in a stock market crash.")
        `;

        const response = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        });

        return parseSummaryResponse(response.content[0].text);

    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary");
    }
};

module.exports = { fetchScenario, fetchSummary };
