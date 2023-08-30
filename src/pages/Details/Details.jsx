import React, { useState, useEffect } from "react";

//CONTEXT
import { useStateContext } from "../../contexts/ContextProvider";

//DATA
import { Header } from "../../components";
import Lodging from "./Lodging";
import Airfare from "./Airfare";

const Details = () => {
  const { enableAirfare, enableLodging } = useStateContext();

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Details" title="Airfare, Lodging & ToDos" />
      </div>
      {enableAirfare && <Airfare />}
      {enableLodging && <Lodging />}
    </>
  );
};

export default Details;
