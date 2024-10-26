require('dotenv').config()
const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');


process.env.IBM_CREDENTIALS_FILE = './Watson.env'; 

const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-10-26',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',
  });

const textGenRequestParametersModel = {
    max_new_tokens: 100,
};

const params = {
    input: "What is the capital of Thailand? ",
    modelId: 'ibm/granite-13b-chat-v2',
    projectId: '1ca4bf2e-97f4-4fa7-b6e7-f3c688fde604',
    parameters: textGenRequestParametersModel,
};

const textGeneration = async () => {
    console.log('hey')
    // const output = await watsonxAIService.generateText(params)
    // console.log(output)
}

function test() {
    console.log('h')
}
test()
textGeneration();
