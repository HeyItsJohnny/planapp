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
import { toDoSettingsGrid } from "../../data/gridData";
import { Header } from "../../components";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

import NewToDoSettingsModal from "../../modals/NewToDoSettingsModal";
const ToDoListSettings = () => {
  const [toDoSettings, setToDoSettings] = useState([]);

  const fetchData = async () => {
    const docCollection = query(collection(db, "todosettings"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          ToDo: doc.data().ToDo,
        };
        list.push(data);
      });
      setToDoSettings(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedData = [...toDoSettings];
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "todosettings", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setToDoSettings([]);
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Settings" title="Consistent To Dos" />
      <div className="mb-10">
        <NewToDoSettingsModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={toDoSettings}
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
          {toDoSettingsGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default ToDoListSettings;
