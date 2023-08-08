import React, { useState, useEffect } from "react";
import { BsCurrencyDollar } from "react-icons/bs";

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

//DATA
import { Header } from "../../components";

import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import PlanComponent from "./PlanComponent";
import NewPlanModal from "../../modals/NewPlanModal";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const { currentColor } = useStateContext();

  const fetchData = async () => {
    const docCollection = query(collection(db, "plans"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Name: doc.data().Name,
          Type: doc.data().Type,
          SubType: doc.data().SubType,
        };
        list.push(data);
      });
      setPlans(list);
    });
  };

  useEffect(() => {
    fetchData();
    return () => {
      setPlans([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Home" title="Plans" />
        <NewPlanModal />
        {/*
      <GridComponent
        id="gridcomp"
        dataSource={plans}
        allowPaging
        allowSorting
        toolbar={["Search", "Delete"]}
        editSettings={{
          allowDeleting: true,
        }}
        width="auto"
      >
        <ColumnsDirective>
          {plansGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>
          */}
      </div>
        <div className="flex flex-wrap lg:flex-nowrap justify-center">
          {plans.map((plan) => (
            <PlanComponent plan={plan} />
          ))}
        </div>
    </>
  );
};

export default Plans;
