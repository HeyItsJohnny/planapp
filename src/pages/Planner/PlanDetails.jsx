import React, { useState, useEffect } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Inject,
  Edit,
  Toolbar,
} from "@syncfusion/ej2-react-grids";

import {
  Box,
  TextField,
} from "@mui/material";
import { useFormik, Field, FormikProvider } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";

//DATA
import { familyPlansGrid } from "../../data/gridData";
import { Header } from "../../components";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

//import NewPlanModal from "../../modals/NewPlanModal";
import PlanSchedule from "./PlanSchedule";
import PlanKanban from "./PlanKanban";
import NewPlanKanban from "../../modals/NewPlanKanban";
import { useParams } from "react-router-dom";

const PlanDetails = () => {
  const { planid } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [plan, setPlan] = useState({});

  const setPlanFromURL = async () => {
    try {
      const docRef = doc(db, "familyplans", planid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
      }
    } catch (err) {
      alert(err);
    }
  };


  useEffect(() => {
    setPlanFromURL();
    return () => {
      setPlan([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Plan Details" title={plan.PlanName} />
        <div className="mb-10">
          <NewPlanKanban planid={planid} />
        </div>
        <div className="mb-10">
          <PlanKanban planid={planid} />
        </div>
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Plan Details" title="Schedule" />
        <div className="mb-10">
          <PlanSchedule planid={planid} />
        </div>
      </div>
    </>
  );
};

export default PlanDetails;
