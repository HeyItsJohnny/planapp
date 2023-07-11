import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
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

//DATA
import { peopleInvitedGrid } from "../data/gridData";
import { Header } from "../components";

import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import NewPeopleInviteModal from "../modals/NewPeopleInviteModal";

const PeopleInvited = () => {
  const [peopleInvited, setPeopleInvited] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [dialogStatus, setDialogStatus] = useState("");

  const handleClose = () => setShow(false);

  const { currentColor } = useStateContext();

  const fetchData = async () => {
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
          Email: doc.data().Email,
          Phone: doc.data().Phone,
          Status: doc.data().Status,
        };
        list.push(data);
      });
      setPeopleInvited(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedData = [...peopleInvited];
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "people-invited", deletedRow.id));
      } catch (error) {
        alert("Error deleting data from Firestore:", error);
      }
    }
  };

  function handleDoubleClick(args) {
    setSelectedRowData(args.rowData);
    setDialogStatus(args.rowData.Status);
    setShow(true);
  }

  const handleStatusChange = (event) => {
    setDialogStatus(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updatePeopleInvitedDoc();
    setDialogStatus("");
    handleClose();
  };

  async function updatePeopleInvitedDoc() {
    try {
      const peopleInviteRef = doc(db, "people-invited", selectedRowData.id);
      await updateDoc(peopleInviteRef, {
        Status: dialogStatus,
      });
    } catch (error) {
      alert("There was an error updating the doc in the database: " + error);
    }
  }

  useEffect(() => {
    fetchData();
    return () => {
      setPeopleInvited([]);
      setSelectedRowData({});
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Settings" title="People Invited" />
      <div className="mb-10">
        <NewPeopleInviteModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={peopleInvited}
        actionComplete={handleActionComplete}
        allowPaging
        allowSorting
        toolbar={["Search", "Delete"]}
        editSettings={{
          allowDeleting: true,
        }}
        width="auto"
        recordDoubleClick={handleDoubleClick}
      >
        <ColumnsDirective>
          {peopleInvitedGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>

      <Dialog open={show} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Update Status</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              type="text"
              fullWidth
              variant="standard"
              value={selectedRowData.Name}
              InputProps={{ readOnly: true }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="Phone"
              type="text"
              fullWidth
              variant="standard"
              value={selectedRowData.Phone}
              InputProps={{ readOnly: true }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="Email"
              type="text"
              fullWidth
              variant="standard"
              value={selectedRowData.Email}
              InputProps={{ readOnly: true }}
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dialogStatus}
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
              Save
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default PeopleInvited;
