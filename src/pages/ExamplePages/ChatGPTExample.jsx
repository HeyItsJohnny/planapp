import React, { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";

import { useStateContext } from "../../contexts/ContextProvider";

//DATA
import { Header } from "../../components";

const ChatGPTExample = () => {

  const [responseString, setResponseString] = useState("");

  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const { currentColor } = useStateContext();

  /*
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
    {
      "role": "system",
      "content": "You will be provided with a question and your task is to deliver the answers in JSON file with the name, address and cuisine."
    },
    {
      "role": "user",
      "content": "what are places to eat in Martinez, CA?"
    }
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  */

  const handleClick = async () => {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being restaurants, properties: cuisine, name, yelp rating and restaurant address and no line breaks. Please limit to 4 restaurants."
          },
          {
            "role": "user",
            "content": "Give me other places to eat in Martinez, CA?"
          },
        ],
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response);
      //const restaurants = eval(response.data.choices[0].message.content);
      setResponseString(response.data.choices[0].message.content);
      const returnText = response.data.choices[0].message.content.replace(/(\r\n|\n|\r)/gm,"");
      const jsonObject = JSON.parse(returnText);
      console.log(jsonObject);
      //alert(jsonObject);
    } catch (error) {
      alert("ERROR: " + error);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Home" title="Chat GPT Example" />
      <p>RESPONSE: {responseString}</p>
      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <textarea className="text-area" cols={50} rows={10}></textarea>
      </div>
      <div className="flex gap-10 m-4 flex-wrap justify-center">
        
        <textarea className="text-area" cols={50} rows={20}>
          {responseString}
        </textarea>
      </div>
      <button
        type="button"
        style={{
          backgroundColor: currentColor,
          color: "White",
          borderRadius: "10px",
        }}
        className={`text-md p-3 hover:drop-shadow-xl`}
        onClick={handleClick}
      >
        Ask Me!
      </button>
    </div>
  );
};

export default ChatGPTExample;
