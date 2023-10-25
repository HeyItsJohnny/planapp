import React, { useState, useEffect } from "react";
import { Header } from "../../../components";

//Visual
import { useStateContext } from "../../../contexts/ContextProvider";
import ClipLoader from "react-spinners/ClipLoader";
import SiteComponent from "./SiteComponent";
import {
  Typography,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

//Chat GPT
import { Configuration, OpenAIApi } from "openai";

const Sites = ({ sitesNext, backStep, detailsData }) => {
  const { currentColor } = useStateContext();
  let [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);

  //Chat GPT -
  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);
  //Chat GPT +

  const getAIGeneratedSites = async () => {
    try {
      setLoading(true);
      setSites([]);

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being sites, properties: name, description, review_stars, website, hours_spent. Please limit to 12 sites.",
          },
          {
            role: "user",
            content:
              "Please give me a list of things to do, sites and attractions in " +
              detailsData.Destination +
              "?",
          },
        ],
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const returnText = response.data.choices[0].message.content.replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
      const jsonObject = JSON.parse(returnText);
      console.log(jsonObject.sites);
      setSites(jsonObject.sites);

      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
      setLoading(false);
    }
  };

  const addSelectedData = (data) => {
    setSelectedSites([...selectedSites, data]);
  };

  const removefromSelectedData = (data) => {
    alert("Remove: " + data.name);
  };

  const goToNext = () => {
    sitesNext(selectedSites);
  }

  useEffect(() => {
    getAIGeneratedSites();
    return () => {
      setSites([]);
      setSelectedSites([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title={"Visit Sites in " + detailsData.Destination} />
        <div className="mt-5">
          <List disablePadding>
            {selectedSites.map((site, index) => (
              <ListItem style={{ padding: "10px 0" }} key={index}>
                <ListItemText
                  primary={
                    <a href={site.website} target="_blank">
                      {site.name}
                    </a>
                  }
                  secondary={
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
                      <p>Stars: {site.review_stars}</p>
                      <p>Hours: {site.hours_spent}</p>
                    </div>
                  }
                />
                <Typography variant="body2">REMOVE</Typography>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="mt-10">
          <button
            type="button"
            style={{
              backgroundColor: currentColor,
              color: "White",
              borderRadius: "10px",
            }}
            className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
            onClick={backStep}
          >
            Back
          </button>
          <button
            type="button"
            style={{
              backgroundColor: currentColor,
              color: "White",
              borderRadius: "10px",
            }}
            className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
            onClick={goToNext}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        {loading ? (
          <div className="flex justify-between items-center gap-2">
            <ClipLoader
              color="#ffffff"
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          sites.map((item) => (
            <SiteComponent item={item} addSelectedData={addSelectedData} />
          ))
        )}
      </div>
    </>
  );
};

export default Sites;
