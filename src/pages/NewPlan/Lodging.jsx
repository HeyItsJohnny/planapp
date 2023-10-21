import React from "react";
import { Header } from "../../components";

import { useStateContext } from "../../contexts/ContextProvider";

const Lodging = ({ nextStep, backStep }) => {
  const { currentColor } = useStateContext();

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="Lodging" />
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
          onClick={nextStep}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Lodging;
