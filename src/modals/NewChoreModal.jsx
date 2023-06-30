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
import { doc, setDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";

const NewChoreModal = () => {
  const [show, setShow] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

  const handleAssignedToChange = (event) => {
    setAssignedTo(event.target.value);
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handleReset = () => {
    setAssignedTo("");
    setFrequency("");
    handleClose();
  };

  const fetchFamilyMembersData = async () => {
    const docCollection = query(
      collection(db, "housemembers"),
      orderBy("Name")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          Name: doc.data().Name,
          Role: doc.data().Role,
        };
        list.push(data);
      });
      setFamilyMembers(list);
    });
  };

  useEffect(() => {
    fetchFamilyMembersData();
    return () => {
      setFamilyMembers([]); // This worked for me
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    addChoreDoc(e);
    handleReset();
  };

  async function addChoreDoc(data) {
    try {
      await setDoc(doc(db, "chores", data.target.Chore.value), {
        AssignedTo: assignedTo,
        Frequency: frequency,
        LastUpdated: new Date()
      });
    } catch (error) {
      alert("There was an error adding to the database: " + error);
    }
  }

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
        Add New Chore
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Chore</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Chore"
              label="Chore"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={frequency}
                label="Food Type"
                onChange={handleFrequencyChange}
                required
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assignedTo}
                label="Food Type"
                onChange={handleAssignedToChange}
                required
              >
                {familyMembers.map((item) => (
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

export default NewChoreModal;
