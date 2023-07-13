import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

//DATA
import { tripCostGrid } from "../data/gridData";
import { Header } from "../components";

import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import NewTripCostModal from "../modals/NewTripCostModal";

const TripCosts = () => {
  const [tripCost, setTripCost] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "trip-costs"),
      orderBy("CostSummary")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          CostSummary: doc.data().CostSummary,
          Cost: "$" + doc.data().Cost,
          Status: doc.data().Status,
          Buyer: doc.data().Buyer
        };
        list.push(data);
      });
      setTripCost(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedData = [...tripCost];
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "trip-costs", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setTripCost([]);
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Settings" title="People Invited" />
      <div className="mb-10">
        <NewTripCostModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={tripCost}
        actionComplete={handleActionComplete}
        allowPaging
        allowSorting
        toolbar={["Search", "Delete"]}
        editSettings={{
          allowDeleting: true,
        }}
        width="auto"
      >
        <ColumnsDirective>
          {tripCostGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default TripCosts;
