import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import TripComponent from "./TripComponent";

//Firebase
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";


const Home = () => {
  const { currentColor } = useStateContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);

  const newTrip = async () => {
    navigate("/newplan");
  };

  const fetchTripsData = async () => {
    const docCollection = query(
      collection(db, "userprofile", currentUser.uid, "trips")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Destination: doc.data().Destination,
          StartDate: doc.data().StartDate,
          EndDate: doc.data().EndDate,
        };
        list.push(data);
        itemCount += 1;
      });
      setTrips(list);
    });
  };

  useEffect(() => {
    fetchTripsData();
    return () => {
      setTrips([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl flex justify-between items-center">
        <Header category="Home" title="My Trips" />
        <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "White",
            borderRadius: "10px",
          }}
          className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
          onClick={newTrip}
        >
          New Trip
        </button>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        {trips.map((trip) => (
          <TripComponent trip={trip} />
        ))}
      </div>
    </>
  );
};

export default Home;
