require('dotenv').config()
const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

let givenTitles = [
    "Missing Cat",
    "Downed Tree"
];

let newTitle = "Hazard Warning";

const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-10-26',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',
});

const textGenRequestParametersModel = {
    max_new_tokens: 150,
    temperature: 0.2,  // Lower temperature for more consistent output
    top_p: 0.1,       // More focused responses
};

const params = {
    input: `You are a title analyzer. Your task is to analyze the following titles and determine if the new title is about the same topic as any of the given titles. If the new title is about the same topic as one of the given titles, combine them into a single, clear title of 1 to 5 words. If a title is not combined respond with only "DIFFERENT_TOPICS".

Given Titles:
1. ${givenTitles[0]}
2. ${givenTitles[1]}

New Title:
${newTitle}

Guidelines:
- If titles are about the same topic: Write ONE combined title of 1 to 5 words.
- If new title is not combined: Write only "DIFFERENT_TOPICS"
- Do not add any explanations or additional text
- Do not use quotes in your response

Respond with only the combined title or "DIFFERENT_TOPICS".`,
    modelId: 'mistralai/mistral-large',
    projectId: '1ca4bf2e-97f4-4fa7-b6e7-f3c688fde604',
    parameters: textGenRequestParametersModel,
};

const textGeneration = async () => {
    const output = await watsonxAIService.generateText(params)
    console.log(output.result.results[0].generated_text)
}

textGeneration();