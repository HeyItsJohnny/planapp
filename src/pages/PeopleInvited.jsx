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
import { peopleInvitedGrid } from "../data/gridData";
import { Header } from "../components";

import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

import NewPeopleInviteModal from "../modals/NewPeopleInviteModal";

const PeopleInvited = () => {
  const [peopleInvited, setPeopleInvited] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "people-invited"),
      orderBy("Name")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Name: doc.data().Name,
          Email: doc.data().Email,
          Phone: doc.data().Phone,
          Status: doc.data().Status,
        };
        list.push(data);
      });
      setPeopleInvited(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      //DELETE data from Firestore (GOOD FOR NOW)
      console.log(args);
      const deletedData = [...peopleInvited];
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "people-invited", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Settings" title="People Invited" />
      <div className="mb-10">
        <NewPeopleInviteModal/>
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={peopleInvited}
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
          {peopleInvitedGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default PeopleInvited;
