require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const { parseScenarioResponse, parseSummaryResponse } = require('../Utils/claudeUtils');
const CLAUDE_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
const anthropic = new Anthropic({ 
    apiKey: CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
});

// Fetch Scenario Function
const fetchUserHitScenario = async ({shipType, hometown, age, gender, occupation}) => {
    try {
        
        // Predefined scenario templates
        const scenarioTemplates = {
            health: "a physical or mental health challenge that tests resilience.",
            relationships: "a pivotal moment in personal or family relationships.",
            money: "a significant financial decision or crisis.",
            career: "a critical career crossroads or workplace challenge.",
            home: "a major housing or living situation change.",
            education: "an important educational or learning opportunity.",
            personal: "a transformative personal growth experience.",
            social: "a challenging social or community situation."
        };

        if (!scenarioTemplates[shipType]) {
            throw new Error(`Invalid ship type: ${shipType}`);
        }

        const prompt = `
            BATTLESHIP LIFE SIMULATOR SCENARIO:

            You are targeting a Life Ship of type: ${shipType}.
            Each ship represents a crucial aspect of life that can be "hit" with unexpected challenges.
            This is a ${shipType.toUpperCase()} class vessel, representing ${scenarioTemplates[shipType]}.

            The target is a ${age}-year-old ${gender} from ${hometown}, working as a ${occupation}.
            Consider their occupation, age, gender and hometown when crafting the event. Be sure to use pronouns appropriately based on the provided gender.

            Create a life-changing event that would "hit" this aspect of life:
            1. A BRIEF hit type (2-3 words describing the type of life challenge).
            2. A DETAILED scenario (2 sentences about how this life challenge unfolds).

            Make the event impactful and personal, reflecting how someone of their age, background, and occupation might experience this challenge. Remember: This is a critical hit on the ${shipType} ship - make it dramatic, yet survivable.

            Format your response exactly as:

            Hit Type: [concise description]
            Scenario: [narrative description]
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
    
    const { playerName, playerStats: { health, money, relationships, career, home, hometown, age, gender, occupation } } = finalStats;

    try {
        const prompt = `
            Create a BRIEF summary (maximum 3-4 sentences) of the player's life journey based on these final stats on a scale of 1-100%, written in a first-person perspective:
            - Health: ${health}
            - Money: ${money}
            - Relationships: ${relationships}
            - Career: ${career}
            - Home: ${home}

            The player is a ${age}-year-old ${gender} from ${hometown}, working as a ${occupation}. Consider their occupation and age to make the summary feel personal and immersive. Use the stats to highlight the most significant achievements, struggles, or turning points in their life journey. Avoid using explicit numerical values (e.g., "My health wasn't at its peak, but I found solace in a new fitness routine" instead of "Health: 7").

            Focus only on the most meaningful moments and ensure the tone reflects the character's experiences. BE SPECIFIC NOT GENERIC PUT THE PLAYER NAME IN THE SUMMARY`;

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

const fetchCpuHitScenario = async ({shipType, hometown, age, gender, occupation}) => {
    try {
        // Predefined positive scenario templates
        const scenarioTemplates = {
            health: "a positive health breakthrough or wellness achievement.",
            relationships: "a joyful connection or strengthening of bonds.",
            money: "an unexpected financial gain or smart investment success.",
            career: "an exciting professional opportunity or achievement.",
            home: "a positive change in living situation or home improvement.",
            education: "a breakthrough in learning or educational success.",
            personal: "an empowering personal development milestone.",
            social: "a meaningful community connection or social triumph."
        };

        if (!scenarioTemplates[shipType]) {
            throw new Error(`Invalid ship type: ${shipType}`);
        }

        const prompt = `
            BATTLESHIP LIFE SIMULATOR POSITIVE SCENARIO:

            You are blessing a Life Ship of type: ${shipType}.
            Each ship represents a crucial aspect of life that can be "blessed" with unexpected positive developments.
            This is a ${shipType.toUpperCase()} class vessel, representing ${scenarioTemplates[shipType]}.

            The recipient is a ${age}-year-old ${gender} from ${hometown}, working as a ${occupation}.
            Consider their occupation, age, gender and hometown when crafting the event. Be sure to use pronouns appropriately based on the provided gender.

            Create an uplifting life event that would positively impact this aspect of life:
            1. A BRIEF blessing type (2-3 words describing the type of positive life development).
            2. A DETAILED scenario (2 sentences about how this positive life development unfolds).

            Make the event impactful and personal, reflecting how someone of their age, background, and occupation might experience this positive change. Remember: This is a blessing on the ${shipType} ship - make it uplifting and transformative!

            Format your response exactly as:

            Blessing Type: [concise description]
            Scenario: [narrative description]
        `;

        const response = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        });

        return parseScenarioResponse(response.content[0].text);
    } catch (error) {
        console.error("Error generating CPU scenario:", error);
        throw new Error("Failed to generate CPU scenario");
    }
};

module.exports = { fetchUserHitScenario, fetchCpuHitScenario, fetchSummary };