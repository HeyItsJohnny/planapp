import React, { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
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
import { calendarSettingsGrid } from "../../data/gridData";
import { Header } from "../../components";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

import NewCalendarSettingsModal from "../../modals/NewCalendarSettingsModal";

const CalendarPlanSettings = () => {
  const [calendarSettings, setCalendarSettings] = useState([]);

  const fetchData = async () => {
    const docCollection = query(collection(db, "calendarsettings"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          CalendarEvent: doc.data().CalendarEvent,
          StartTime: doc.data().StartTime,
          EndTime: doc.data().EndTime,
        };
        list.push(data);
      });
      setCalendarSettings(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "calendarsettings", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setCalendarSettings([]);
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Settings" title="Everyday Calendar Events" />
      <div className="mb-10">
        <NewCalendarSettingsModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={calendarSettings}
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
          {calendarSettingsGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default CalendarPlanSettings;
