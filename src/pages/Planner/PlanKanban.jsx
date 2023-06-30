import React, { useState, useEffect } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { PlanKanbanGrid } from "../../data/gridData";

import { db } from "../../firebase/firebase";

import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const PlanKanban = ({ planid }) => {
  const [planKanban, setPlanKanban] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "familyplans", planid, "plankanban")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          PersonResponsible: doc.data().PersonResponsible,
          Status: doc.data().Status,
        };
        list.push(data);
      });
      setPlanKanban(list);
    });
  };

  useEffect(() => {
    fetchData();
    return () => {
      setPlanKanban([]); // This worked for me
    };
  }, []);

  const addEvent = async (args) => {
    if (args.requestType === "cardChanged") {
      //Updated
      try {
        const mealScheduleRef = doc(db,"familyplans",planid,"plankanban",args.changedRecords[0].id
        );
        await updateDoc(mealScheduleRef, {
          PersonResponsible: args.changedRecords[0].PersonResponsible,
          Status: args.changedRecords[0].Status,
        });
      } catch (error) {
        alert("Error editing data to Database: " + error);
      }
    } else if (args.requestType === "cardRemoved") {
      //Deleted
      try {
        await deleteDoc(
          doc(db,"familyplans",planid,"plankanban", args.deletedRecords[0].id)
        );
      } catch (error) {
        alert("Error deleting data from Database: " + error);
      }
    }
  };

  return (
    <KanbanComponent
      id="kanban"
      dataSource={planKanban}
      cardSettings={{ contentField: "PersonResponsible", headerField: "id" }}
      keyField="Status"
      actionComplete={addEvent}
    >
      <ColumnsDirective>
        {PlanKanbanGrid.map((item, index) => (
          <ColumnDirective key={index} {...item} />
        ))}
      </ColumnsDirective>
    </KanbanComponent>
  );
};

export default PlanKanban;
