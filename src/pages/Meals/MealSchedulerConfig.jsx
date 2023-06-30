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
import { mealScheduleGrid } from "../../data/gridData";
import { Header } from "../../components";
import MealSchedulerConfigMealList from "./MealSchedulerConfigMealList"

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

const MealSchedulerConfig = () => {
  const [mealSchedule, setMealSchedule] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "mealschedule"),
      where("DayOfWeek","==","Meals"),
      orderBy("MealType")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Meal: doc.data().Meal,
          MealType: doc.data().MealType,
          Description: doc.data().Description,
          DayOfWeek: doc.data().DayOfWeek
        };
        list.push(data);
      });
      setMealSchedule(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "mealschedule", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setMealSchedule([]); // This worked for me
    };
  }, []);

  return (
    <>
    
    <MealSchedulerConfigMealList />
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Meals" title="Meal to Schedule" />
      <GridComponent
        id="gridcomp"
        dataSource={mealSchedule}
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
          {mealScheduleGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
    </>
  );
};

export default MealSchedulerConfig;
