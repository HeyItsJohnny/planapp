import React from "react";
import { Header } from "../../components";

import { useStateContext } from "../../contexts/ContextProvider";

const Sites = ({ nextStep, backStep }) => {
  const { currentColor } = useStateContext();

  return (
    <>
      <Header category="" title="Sites" />
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
          onClick={nextStep}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Sites;
