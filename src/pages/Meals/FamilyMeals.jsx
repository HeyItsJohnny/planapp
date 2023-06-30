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
import { familyMealsGrid } from "../../data/gridData";
import { Header } from "../../components";
import NewMealModal from "../../modals/NewMealModal";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

const FamilyMeals = () => {
  const [familyMeals, setFamilyMeals] = useState([]);

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "familymeals"),
      orderBy("FoodType")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Meal: doc.id,
          FoodType: doc.data().FoodType,
          Description: doc.data().Description,
        };
        list.push(data);
      });
      setFamilyMeals(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "familymeals", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
    return () => {
      setFamilyMeals([]); // This worked for me
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Meals" title="Meal List" />
      <div className="mb-10">
        <NewMealModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={familyMeals}
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
          {familyMealsGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default FamilyMeals;
