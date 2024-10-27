require('dotenv').config()
const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

let description = "My cat is missing PLEASE help ME!";

const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-10-26',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',
});

const textGenRequestParametersModel = {
    max_new_tokens: 50,      // Reduced since we only need a short title
    temperature: 0.1,        // Very low temperature for consistent formatting
    top_p: 0.1,             // Focused responses
    repetition_penalty: 1.1  // Avoid repetitive words
};

const params = {
    input: `Convert the following description into a clear, concise title of 1-3 words. Follow these examples strictly:

Example descriptions and their titles:
"My cat Whiskers has been missing since yesterday evening in the Oak Street area" → "Missing Cat"
"Large tree has fallen across power lines on Maple Drive" → "Downed Tree"
"Warning: Flash floods reported in downtown area" → "Hazard Warning"

Rules for creating titles:
- Use 1-3 words only
- Be direct and clear
- Remove unnecessary details
- Start with key action word when possible (Missing, Downed, etc.)
- No punctuation in the title
- Use title case

Description to convert:
"${description}"

Output the title only, with no quotes or explanation:`,
    modelId: 'mistralai/mistral-large',
    projectId: '1ca4bf2e-97f4-4fa7-b6e7-f3c688fde604',
    parameters: textGenRequestParametersModel,
};

const textGeneration = async () => {
    const output = await watsonxAIService.generateText(params)
    console.log(output.result.results[0].generated_text.trim())
}

textGeneration();