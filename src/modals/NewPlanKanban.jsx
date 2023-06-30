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
  setDoc,
  doc,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const NewPlanKanban = ({ planid }) => {
  const [show, setShow] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [personResponsible, setPersonResponsible] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

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

  const handlePersonResponsibleChange = (event) => {
    setPersonResponsible(event.target.value);
  };

  const handleReset = () => {
    setPersonResponsible("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addPlanKanbanDoc(e);
    handleReset();
  };

  async function addPlanKanbanDoc(data) {
    try {
      await setDoc(
        doc(db, "familyplans", planid, "plankanban", data.target.Task.value),
        {
          PersonResponsible: personResponsible,
          Status: "ToDo",
        }
      );
    } catch (error) {
      alert("There was an error adding to the database: " + error);
    }
  }

  useEffect(() => {
    fetchFamilyMembersData();
    return () => {
      setFamilyMembers([]); // This worked for me
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
        Add New Task
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Plan</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Task"
              label="Task"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={personResponsible}
                label="Food Type"
                onChange={handlePersonResponsibleChange}
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

export default NewPlanKanban;
