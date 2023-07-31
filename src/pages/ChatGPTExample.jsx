import React, { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";

import { useStateContext } from "../contexts/ContextProvider";

//DATA
import { Header } from "../components";

const ChatGPTExample = () => {
  const configuration = new Configuration({
    apiKey: process.env.PLANAPP_OPENAI_API_KEY,
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

  const handleClick = () => {
    console.log("SHOW");
  }


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Home" title="Chat GPT Example" />
      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <textarea className="text-area" cols={50} rows={20}></textarea>
        
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
