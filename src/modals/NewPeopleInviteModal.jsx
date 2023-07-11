import React, { useState } from "react";
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
import { addDoc, collection } from "firebase/firestore";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const NewPeopleInviteModal = () => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [phoneno, setPhoneNo] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePhoneNoChange = (event) => {
    setPhoneNo(event);
  };

  const handleReset = () => {
    setStatus("");
    setPhoneNo();
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addPeopleInvitedDoc(e);
    handleReset();
  };

  async function addPeopleInvitedDoc(data) {
    try {
      await addDoc(collection(db, "people-invited"), {
        Name: data.target.Name.value,
        Phone: phoneno,
        Email: data.target.Email.value,
        Status: status,
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
        Add New Person
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Invite</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="Email"
              label="Email"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
              <InputLabel id="demo-simple-select-label">Phone Number</InputLabel>
              <PhoneInput
                defaultCountry="US"
                value={phoneno}
                onChange={handlePhoneNoChange}
              />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={handleStatusChange}
                required
              >
                <MenuItem value="No Response">No Response</MenuItem>
                <MenuItem value="Attending">Attending</MenuItem>
                <MenuItem value="Maybe">Maybe</MenuItem>
                <MenuItem value="Not Attending">Not Attending</MenuItem>
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

export default NewPeopleInviteModal;
