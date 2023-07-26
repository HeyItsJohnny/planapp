import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { BsCurrencyDollar } from "react-icons/bs";

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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { GoPrimitiveDot } from "react-icons/go";

import { SparklineAreaData, ecomPieChartData } from "../data/dummy";

import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";

//DATA
import { Header } from "../components";

import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import NewTripCostModal from "../modals/NewTripCostModal";

const TripCostsBreakdown = () => {
  const { currentColor, currentMode } = useStateContext();

  //Trip States
  const [tripCost, setTripCost] = useState([]);
  const [tripCostPieChart, setTripCostPieChart] = useState([]);
  const [tripPayments, setTripPayments] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const fetchData = async () => {
    const docCollection = query(collection(db, "trip-costs"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var totalCostVar = 0;

      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Buyer: doc.data().Buyer,
          Cost: Number(doc.data().Cost),
        };

        list.push(data);
        totalCostVar = totalCostVar + Number(doc.data().Cost);
      });
      const uniqueNames = getTotalCostByName(list);
      getPieChartData(uniqueNames, totalCostVar);
      setTripCost(uniqueNames);
      setTotalCost(totalCostVar);
    });
  };

  function getTotalCostByName(data) {
    const totalAgeByName = {};

    data.forEach((person) => {
      if (totalAgeByName[person.Buyer]) {
        totalAgeByName[person.Buyer] += person.Cost;
      } else {
        totalAgeByName[person.Buyer] = person.Cost;
      }
    });

    const result = Object.keys(totalAgeByName).map((Buyer) => ({
      Buyer,
      Cost: totalAgeByName[Buyer],
    }));

    return result;
  }

  function getPieChartData(tripCostData, totalCostData) {
    const list = [];
    tripCostData.forEach((doc) => {
      var data = {
        x: doc.Buyer,
        y: doc.Cost,
        text: Math.round((doc.Cost / totalCostData) * 100) + "%",
      };
      list.push(data);
    });
    setTripCostPieChart(list);
  }

  useEffect(() => {
    fetchData();
    return () => {
      setTripCost([]);
      setTripCostPieChart([]);
      setTripPayments([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Costs" title="Cost Breakdown" />
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Payments Made</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Costs</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Payments</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className=" border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">${totalCost}</span>
                </p>
                <p className="text-gray-500 mt-1">Total Cost</p>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-semibold">$0</p>

                <p className="text-gray-500 mt-1">Total Payments</p>
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Breakdown per Person</p>
          </div>
          <div className="mt-10 w-72 md:w-400">
            {tripCost.map((item) => (
              <div key={item.id} className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{
                      color: "#03C9D7",
                      backgroundColor: "#E5FAFB",
                    }}
                    className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                  >
                    <BsCurrencyDollar />
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.Buyer}</p>
                  </div>
                </div>
                <p>${item.Cost}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <NewTripCostModal />
            </div>

            <p className="text-gray-400 text-md">Total: ${totalCost}</p>
          </div>
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Trip Cost Overview</p>
          </div>
          <div className="md:w-full overflow-auto">
            <Pie
              id="pie-chart"
              data={tripCostPieChart}
              legendVisiblity={true}
              height="350px"
            />
          </div>
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Payments per Person</p>
          </div>
          <div className="mt-10 w-72 md:w-400">
            {tripCost.map((item) => (
              <div key={item.id} className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{
                      color: "#03C9D7",
                      backgroundColor: "#E5FAFB",
                    }}
                    className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                  >
                    <BsCurrencyDollar />
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.Buyer}</p>
                  </div>
                </div>
                <p>${item.Cost}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <NewTripCostModal />
            </div>

            <p className="text-gray-400 text-md">Total: ${totalCost}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripCostsBreakdown;
