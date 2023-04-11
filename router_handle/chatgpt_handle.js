const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const GPTFunction = async (prompt) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.6,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  },{proxy:{host:'127.0.0.1',port:7890}});
  return response.data.choices[0].text;
};
exports.sendMessage =async (req, res)=>{
  const {message} = req.body
  const objective = await GPTFunction(message);
  res.send({code:0,objective})
}