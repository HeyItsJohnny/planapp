import React, { useState, useEffect } from "react";
import { MdOutlineSupervisorAccount } from 'react-icons/md';

import { Button } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { Link as RouterLink} from 'react-router-dom';

const Dashboard = () => {
  const [noReponse, setNoReponse] = useState(0);
  const [attending, setAttending] = useState(0);
  const [maybe, setMaybe] = useState(0);
  const [notAttending, setNotAttending] = useState(0);

  const { currentColor } = useStateContext();

  const fetchNoResponseData = async () => {
    const docCollection = query(
      collection(db, "people-invited"),
      where("Status","==","No Response")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      var listCount = 0;
      querySnapshot.forEach(() => {
        listCount = listCount + 1;
      });
      setNoReponse(listCount);
    });
  };

  const fetchAttendingData = async () => {
    const docCollection = query(
      collection(db, "people-invited"),
      where("Status","==","Attending")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      var listCount = 0;
      querySnapshot.forEach(() => {
        listCount = listCount + 1;
      });
      setAttending(listCount);
    });
  };

  const fetchMaybeData = async () => {
    const docCollection = query(
      collection(db, "people-invited"),
      where("Status","==","Maybe")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      var listCount = 0;
      querySnapshot.forEach(() => {
        listCount = listCount + 1;
      });
      setMaybe(listCount);
    });
  };

  const fetchNotAttendingData = async () => {
    const docCollection = query(
      collection(db, "people-invited"),
      where("Status","==","Not Attending")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      var listCount = 0;
      querySnapshot.forEach(() => {
        listCount = listCount + 1;
      });
      setNotAttending(listCount);
    });
  };

  useEffect(() => {
    fetchNoResponseData();
    fetchAttendingData();
    fetchMaybeData();
    fetchNotAttendingData();
  }, []);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">$63,448.78</p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              borderRadius="10px"
              size="md"
            />
          </div>
        </div>
        <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
          <button
            type="button"
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            component={RouterLink}
            to="/people-invited"
          >
            <MdOutlineSupervisorAccount />
          </button>
          <p className="mt-3">
            <span className="text-lg font-semibold">No Response</span>
          </p>
          <p className="text-sm text-gray-400  mt-1">{noReponse}</p>
        </div>
        <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
          <button
            type="button"
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
          >
            <MdOutlineSupervisorAccount />
          </button>
          <p className="mt-3">
            <span className="text-lg font-semibold">Attending</span>
          </p>
          <p className="text-sm text-gray-400  mt-1">{attending}</p>
        </div>
        <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
          <button
            type="button"
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
          >
            <MdOutlineSupervisorAccount />
          </button>
          <p className="mt-3">
            <span className="text-lg font-semibold">Maybe</span>
          </p>
          <p className="text-sm text-gray-400  mt-1">{maybe}</p>
        </div>
        <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
          <button
            type="button"
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
          >
            <MdOutlineSupervisorAccount />
          </button>
          <p className="mt-3">
            <span className="text-lg font-semibold">Not Attending</span>
          </p>
          <p className="text-sm text-gray-400  mt-1">{notAttending}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
