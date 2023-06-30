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
import { choresListGrid } from "../../data/gridData";
import { Header } from "../../components";
import NewChoreModal from "../../modals/NewChoreModal";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

const ChoresList = () => {
  const [chores, setChores] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "chores")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const formattedDate = `${(doc.data().LastUpdated.toDate().getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${doc.data().LastUpdated.toDate().getDate().toString().padStart(2, '0')}/${doc.data().LastUpdated.toDate().getFullYear()}`;
        var data = {
          id: doc.id,
          Chore: doc.id,
          AssignedTo: doc.data().AssignedTo,
          Frequency: doc.data().Frequency,
          LastUpdated: formattedDate
        };
        list.push(data);
      });
      setChores(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "chores", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
    return () => {
      setChores([]); // This worked for me
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Chores" title="Chore List" />
      <div className="mb-10">
        <NewChoreModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={chores}
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
          {choresListGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default ChoresList;
