import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const NewTripCostModal = () => {
  const [peopleInvited, setPeopleInvited] = useState([]);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [buyer, setBuyer] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

  const fetchPeopleInvitedData = async () => {
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
        };
        list.push(data);
      });
      setPeopleInvited(list);
    });
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleBuyerChange = (event) => {
    setBuyer(event.target.value);
  };

  const handleReset = () => {
    setStatus("");
    setBuyer("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addPeopleInvitedDoc(e);
    handleReset();
  };

  async function addPeopleInvitedDoc(data) {
    try {
      await addDoc(collection(db, "trip-costs"), {
        CostSummary: data.target.CostSummary.value,
        Cost: data.target.Cost.value,
        Status: status,
        Buyer: buyer,
      });
    } catch (error) {
      alert("There was an error adding to the database: " + error);
    }
  }

  useEffect(() => {
    fetchPeopleInvitedData();
    return () => {
      setPeopleInvited([]);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        style={{
          backgroundColor: currentColor,
          color: "White",
          borderRadius: "10px",
        }}
        className={`text-md p-3 hover:drop-shadow-xl`}
        onClick={handleShow}
      >
        Add Cost
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Cost</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="CostSummary"
              label="Cost Summary"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="Cost"
              label="Cost ($)"
              type="number"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Payment Status"
                onChange={handleStatusChange}
                required
              >
                <MenuItem value="Not Paid">Not Paid</MenuItem>
                <MenuItem value="Partically Paid">Partically Paid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Financed By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={buyer}
                label="Financed By"
                onChange={handleBuyerChange}
                required
              >
                {peopleInvited.map((item) => (
                  <MenuItem value={item.Name}>{item.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <button
              type="submit"
              style={{
                backgroundColor: currentColor,
                color: "White",
                borderRadius: "10px",
              }}
              className={`text-md p-3 hover:drop-shadow-xl`}
            >
              Add
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default NewTripCostModal;
