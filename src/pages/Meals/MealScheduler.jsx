import React, { useState, useEffect } from "react";
import {
  KanbanComponent,
} from "@syncfusion/ej2-react-kanban";

import { Header } from "../../components";

import { db } from "../../firebase/firebase";

import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const MealScheduler = () => {
  const [mealSchedule, setMealSchedule] = useState([]);

  const fetchData = async () => {
    const docCollection = query(collection(db, "mealschedule"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          Id: itemCount + '. ' + doc.data().Meal,
          DocumentId: doc.id,
          Meal: doc.data().Meal,
          MealType: doc.data().MealType,
          Description: doc.data().Description,
          DayOfWeek: doc.data().DayOfWeek,
        };
        list.push(data);
        itemCount += 1;
      });
      setMealSchedule(list);
    });
  };

  useEffect(() => {
    fetchData();
    return () => {
      setMealSchedule([]); // This worked for me
    };
  }, []);
  
  const addEvent = async (args) => {
    console.log(args);
    //console.log(args.data[0].previousData);
    if (args.requestType === "cardChanged") {
      //Updated
      try {
        const mealScheduleRef = doc(db,"mealschedule",args.changedRecords[0].DocumentId);
        await updateDoc(mealScheduleRef, {
          Meal: args.changedRecords[0].Meal,
          MealType: args.changedRecords[0].MealType,
          Description: args.changedRecords[0].Description ?? "",
          DayOfWeek: args.changedRecords[0].DayOfWeek?? "",
        });
      } catch (error) {
        alert("Error editing data to Database: " + error);
      }
    } else if (args.requestType === "cardRemoved") {
      //Deleted
      try {
        await deleteDoc(doc(db, "mealschedule", args.deletedRecords[0].DocumentId));
      } catch (error) {
        alert("Error deleting data from Database: " + error);
      }
    }
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Meals" title="Meal Schedule" />
      <KanbanComponent
        id="kanban"
        dataSource={mealSchedule}
        columns={[
          { headerText: "Meals", keyField: "Meals" },
          { headerText: "Sunday", keyField: "Sunday" },
          { headerText: "Monday", keyField: "Monday" },
          { headerText: "Tuesday", keyField: "Tuesday" },
          { headerText: "Wednesday", keyField: "Wednesday" },
          { headerText: "Thursday", keyField: "Thursday" },
          { headerText: "Friday", keyField: "Friday" },
          { headerText: "Saturday", keyField: "Saturday" },
        ]}
        cardSettings={{ contentField: "Description", headerField: "Id" }}
        keyField="DayOfWeek"
        swimlaneSettings={{ keyField: "MealType" }}
        actionComplete={addEvent}
      ></KanbanComponent>
    </div>
  );
};

export default MealScheduler;
