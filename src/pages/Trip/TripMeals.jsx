import React, { useState, useEffect } from "react";

//Visual
import { AiTwotoneDelete } from "react-icons/ai";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Functions
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const TripMeals = () => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [tripMeals, setTripMeals] = useState([]);

  const fetchTripMealsData = async () => {
    const docCollection = query(
      collection(
        db,
        "userprofile",
        currentUser.uid,
        "trips",
        tripid,
        "meals"
      )
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          description: doc.data().description,
          category: doc.data().category,
          name: doc.data().name,
          review_stars: doc.data().review_stars,
          website: doc.data().website,
        };
        list.push(data);
        itemCount += 1;
      });
      setTripMeals(list);
    });
  };

  const removeMeal = (meal) => {
    //removefromSelectedData(site);
    toast(meal.name + " removed from my list.");
  };

  useEffect(() => {
    fetchTripMealsData();
    return () => {
      setTripMeals([]);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Meals</p>
        </div>
        <div className="mt-5 w-72 md:w-400">
          {tripMeals.map((meal) => (
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    backgroundColor: "#FF0000",
                    color: "White",
                  }}
                  className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                  onClick={() => removeMeal(meal)}
                >
                  <AiTwotoneDelete />
                </button>
                <div>
                  <a href={meal.website} target="_blank">
                    <p className="text-md font-semibold">{meal.name}</p>
                  </a>
                  <p className="text-sm text-gray-400">{meal.category}</p>
                </div>
              </div>
              <p className={`text-green-600`}>{meal.review_stars}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TripMeals;
