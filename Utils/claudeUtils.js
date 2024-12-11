const parseScenarioResponse = (response) => {
    const hitType = response.match(/Hit Type: (.+)/)?.[1]?.trim();
    const scenario = response.match(/Scenario: (.+)/)?.[1]?.trim();
    const consequences = response.match(/Consequences: (.+)/)?.[1]?.trim();
    
    // Parse choices and their impacts
    const choicesRegex = /([ABC]\) .+?)\s*\|\s*Impacts:\s*Health:\s*(-?\d+),\s*Money:\s*(-?\d+),\s*Relationships:\s*(-?\d+),\s*Looks:\s*(-?\d+),\s*Home:\s*(-?\d+)/g;
    const choices = {};
    
    let match;
    while ((match = choicesRegex.exec(response)) !== null) {
        const [_, choiceText, health, money, relationships, looks, home] = match;
        const choice = choiceText[0]; // A, B, or C
        choices[choice] = {
            text: choiceText.slice(3).trim(),
            impacts: {
                health: parseInt(health),
                money: parseInt(money),
                relationships: parseInt(relationships),
                looks: parseInt(looks),
                home: parseInt(home)
            }
        };
    }

    return { hitType, scenario, consequences, choices };
};

const parseSummaryResponse = (response) => {
    try {
        // Check if response is a string or JSON object
        const summaryText = typeof response === 'string' 
            ? response 
            : response.summary || '';

        // Replace all \n with spaces and remove multiple spaces
        return summaryText
            .replace(/\\n/g, ' ')  // Replace \n with space
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim()
    } catch (error) {
        console.error("Error cleaning summary response:", error);
        return '';
    }
}

module.exports = {
    parseScenarioResponse,
    parseSummaryResponse
}