require('dotenv').config()
const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');
const findMatchingCoordinates = require('./locationlogic')

const titleComparison = async (req, res, next) => {
    try {
      // incoming data
      const { latitude, longitude } = req.body;

      const givenTitles = await findMatchingCoordinates(longitude, latitude);

      if (givenTitles.length == 0) {
        next();
      }

      let newTitle = req.titleFromTextGen;

      const watsonxAIService = WatsonXAI.newInstance({
        version: "2024-10-26",
        serviceUrl: "https://us-south.ml.cloud.ibm.com",
      });

      const textGenRequestParametersModel = {
        max_new_tokens: 50, // Reduced since we only need a boolean
        temperature: 0.1, // Very low temperature for consistent output
        top_p: 0.1, // Focused responses
      };

      const params = {
        input: `You are a title similarity checker. Your task is to determine if the new title is semantically similar to any of the given titles. Respond with exactly "true" if similar, or exactly "false" if not similar.
    
    Given Titles:
    1. ${givenTitles[0]}
    2. ${givenTitles[1]}
    
    New Title:
    ${newTitle}
    
    Rules:
    - Respond ONLY with the word "true" if the new title is similar to any given title
    - Respond ONLY with the word "false" if the new title is not similar to any given title
    - Do not add any other text or explanations
    - Do not use quotes or punctuation
    
    Output only the word true or false:`,
        modelId: "mistralai/mistral-large",
        projectId: "1ca4bf2e-97f4-4fa7-b6e7-f3c688fde604",
        parameters: textGenRequestParametersModel,
      };
      const output = await watsonxAIService.generateText(params);
      const result = output.result.results[0].generated_text.trim().toLowerCase();
      console.log(result)
      if (result == "true") {
        res.status(200).json({message: "Someone has inserted this point already!"})
      } else {
        next()
      }
    } catch (error) {
        next(error)
    }
}

module.exports = titleComparison