//Chat GPT
import { Configuration, OpenAIApi } from "openai";

//Chat GPT -
const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

export async function getChatActivities(tripDestination) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being activities, properties: activity_name, description, review_stars, website, hours_spent. Please limit to 5 activities.",
      },
      {
        role: "user",
        content:
          "Please give me a list of things to do, sites and attractions in " +
          tripDestination +
          "?",
      },
    ],
    temperature: 1.5,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const returnText = response.data.choices[0].message.content.replace(
    /(\r\n|\n|\r)/gm,
    ""
  );
  const jsonObject = JSON.parse(returnText);

  return jsonObject;
}

export async function getChatRestaurants(tripDestination) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being restaurants, properties: resturant_name, review_stars, website, category. Please provide up to 5 restaurants.",
      },
      {
        role: "user",
        content:
          "Please give me a list of popular resturants in " +
          tripDestination +
          "?",
      },
    ],
    temperature: 1.5,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const returnText = response.data.choices[0].message.content.replace(
    /(\r\n|\n|\r)/gm,
    ""
  );
  const jsonObject = JSON.parse(returnText);

  return jsonObject;
}
