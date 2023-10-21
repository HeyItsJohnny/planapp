import React from 'react';
import { AiTwotoneDelete } from "react-icons/ai";

//import { useAuth } from "../../contexts/AuthContext";
//import { convertDateFormat } from "../../globalfunctions/GlobalFunctions";
//import { deleteChore } from "../../globalfunctions/FirebaseGlobals";
//import ChoreDetails from "./Modals/ChoreDetails";


const SiteComponent = ({item}) => {
  return (
    <> 
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-5 m-3 bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center ">
        <div>
          <p className="font-bold text-gray-400">{item.name}</p>
          {/*<p className="text-l">{item.description}</p> */}
          <p className="text-l">Stars: {item.review_stars}</p>
          <a href={item.website} target="_blank">Visit Website!</a>
        </div>
      </div>
      <div className="mt-5">
        {/*
        <ChoreDetails chore={chore} />
        <button
          type="button"
          style={{
            backgroundColor: "#FF0000",
            color: "White",
            borderRadius: "10px",
          }}
          className={`text-md p-3 hover:drop-shadow-xl float-right`}
          onClick={handleDeleteChore}
        >
          <AiTwotoneDelete />
        </button>
        */}
      </div>
    </div>
  </>
  )
}

export default SiteComponent