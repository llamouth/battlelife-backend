const parseScenarioResponse = (response) => {
    const hitType = response.match(/Hit Type: (.+)/)?.[1]?.trim();
    const scenario = response.match(/Scenario: (.+)/)?.[1]?.trim();

    return { hitType, scenario};
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