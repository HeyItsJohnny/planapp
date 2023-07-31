import React, { useState, useEffect } from "react";

//DATA
import { Header } from "../components";

const Food = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Trip" title="Places to Eat" />
    </div>
  );
};

export default Food;
