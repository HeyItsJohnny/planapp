//Chat GPT
import { Configuration, OpenAIApi } from "openai";

//Chat GPT -
const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

export async function getChatActivitiesPerDay(
  tripDestination,
  tripcategory
) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being activities, properties: activity_name, description, and hours_spent. " +
          "Please provide 2 activities."
      },
      {
        role: "user",
        content:
          "The theme of my vacation is " +
          tripcategory +
          ". Please give me two activities to do that correspond with my vacation theme including: sites and attractions in " +
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

export async function getChatActivitiesPerDayDoNotInclude(
  tripDestination,
  tripcategory,
  actitivesToNotInclude
) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being activities, properties: activity_name, description, and hours_spent. " +
          "Please provide 2 activities."
      },
      {
        role: "user",
        content:
          "The theme of my vacation is " +
          tripcategory +
          ". Please give me two activities to do that correspond with my vacation theme including: sites and attractions in " +
          tripDestination +
          "? Please do not include " + actitivesToNotInclude,
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

export async function getChatActivities(
  tripDestination,
  tripcategory,
  numberOfDays
) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being activities, properties: activity_name, description. Please provide activities for the " +
          numberOfDays +
          " days I am there.",
      },
      {
        role: "user",
        content:
          "The theme of my vacation is " +
          tripcategory +
          ". Please give me a list of things to do that correspond with my vacation theme including: sites and attractions in " +
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

export async function getChatRestaurants(tripDestination, numberOfDays) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being restaurants, properties: resturant_name, review_stars, category. Please provide activities for the " +
          numberOfDays +
          " days I am there.",
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

export async function getChatItinerary(
  tripDestination,
  activityString,
  mealString,
  wakeupTime,
  bedTime
) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being itinerary, properties: day, start_time, end_time, activity.",
      },
      {
        role: "user",
        content:
          "The theme of my vacation is " +
          tripDestination.Category +
          ". Please create an itinerary for me that is structured with a breakfast, an activity, lunch, another activity and dinner. I will be staying in " +
          tripDestination.Destination +
          " from " +
          tripDestination.StartDate +
          " to " +
          tripDestination.EndDate +
          ". Please fill in my itinerary with opportunities to relax. Please do not duplicate my visits and have the day format in YYYY-MM-DD. Also please have the start_time and end_time in a 24 hour format." +
          "Please include these places and activities in my itinerary: " +
          activityString +
          ". Also please include these meals in my itinerary: " +
          mealString +
          ". Please keep in mind I wake up at " + wakeupTime + " and would like 1 hour to get ready for the morning, I also go to bed at " + bedTime + ' and would like 1 hour to get ready for bed. Do not include wakeup and bedtime in your data.',
      },
    ],
    temperature: 1,
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
