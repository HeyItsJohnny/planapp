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

//DATA
import { familyPlansGrid } from "../../data/gridData";
import { Header } from "../../components";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

import NewPlanModal from "../../modals/NewPlanModal";

import { useNavigate } from "react-router-dom";

const Planner = () => {
  const navigate = useNavigate();
  const [familyPlans, setFamilyPlans] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "familyplans"),
      orderBy("PlanName")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {        
        var data = {
          id: doc.id,
          PlanName: doc.data().PlanName,
          StartDate: doc.data().StartDate,
          EndDate: doc.data().EndDate
        };
        list.push(data);
      });
      setFamilyPlans(list);
    });
  };
  
  function handleDoubleClick(args) {
    //alert(args.rowData.id);
    navigate("/plandetails/" + args.rowData.id);
  }

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "familyplans", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setFamilyPlans([]);
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Plans" title="Family Plans" />
      <div className="mb-10">
        <NewPlanModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={familyPlans}
        actionComplete={handleActionComplete}
        allowPaging
        allowSorting
        toolbar={["Search", "Delete"]}
        editSettings={{
          allowDeleting: true,
        }}
        width="auto"
        recordDoubleClick={handleDoubleClick}
      >
        <ColumnsDirective>
          {familyPlansGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Planner;
