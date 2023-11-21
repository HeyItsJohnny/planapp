import React, { useState } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";

//Modal
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";

const NewSiteModal = ({addSelectedData}) => {
  const { currentColor } = useStateContext();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var newActivity = {
        name: e.target.name.value,
        description: e.target.description.value ?? "",
        website: e.target.website.value ?? "www.google.com",
        hours_spent: e.target.hours_spent.value ?? "",
        review_stars: ""
    }
    addSelectedData(newActivity);
    handleReset();
  };

  return (
    <>
      <button
        type="button"
        style={{
          backgroundColor: currentColor,
          color: "White",
          borderRadius: "10px",
        }}
        className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
        onClick={handleShow}
      >
        Add
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Activity</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="website"
              label="Website"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="hours_spent"
              label="Hours Spent"
              type="number"
              fullWidth
              variant="standard"
            />
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

export default NewSiteModal;
