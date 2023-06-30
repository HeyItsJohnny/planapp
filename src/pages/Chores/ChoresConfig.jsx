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
import { choresScheduleGrid } from "../../data/gridData";
import { Header } from "../../components";
import  ChoreScheduleConfigList  from "./ChoreScheduleConfigList";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";

const ChoresConfig = () => {
  const [choreSchedule, setChoreSchedule] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "choreschedule")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Chore: doc.id,
          Status: doc.data().Status,
          AssignedTo: doc.data().AssignedTo,
        };
        list.push(data);
      });
      setChoreSchedule(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "choreschedule", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setChoreSchedule([]); // This worked for me
    };
  }, []);

  return (
    <>
      <ChoreScheduleConfigList />
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Chores" title="Chores in Schedule" />
      <GridComponent
        id="gridcomp"
        dataSource={choreSchedule}
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
          {choresScheduleGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
    </>
  );
};

export default ChoresConfig;
