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
import { tripCostGrid } from "../data/gridData";
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

import NewTripCostModal from "../modals/NewTripCostModal";

const TripCosts = () => {
  const [tripCost, setTripCost] = useState([]);

  const [show, setShow] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [dialogStatus, setDialogStatus] = useState("");

  const handleClose = () => setShow(false);

  const { currentColor } = useStateContext();

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "trip-costs"),
      orderBy("CostSummary")
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          CostSummary: doc.data().CostSummary,
          Cost: "$" + doc.data().Cost,
          Status: doc.data().Status,
          Buyer: doc.data().Buyer
        };
        list.push(data);
      });
      setTripCost(list);
    });
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      const deletedData = [...tripCost];
      const deletedRow = args.data[0];
      try {
        await deleteDoc(doc(db, "trip-costs", deletedRow.id));
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

    updatePeopleInvitedDoc(e);
    setDialogStatus("");
    handleClose();
  };

  async function updatePeopleInvitedDoc() {
    try {
      const totalCostsRef = doc(db, "trip-costs", selectedRowData.id);
      await updateDoc(totalCostsRef, {
        Status: dialogStatus,
      });
    } catch (error) {
      alert("There was an error updating the doc in the database: " + error);
    }
  }

  useEffect(() => {
    fetchData();
    return () => {
      setTripCost([]);
      setSelectedRowData({});
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Costs" title="Cost Summary" />
      <div className="mb-10">
        <NewTripCostModal />
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={tripCost}
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
          {tripCostGrid.map((item, index) => (
            <ColumnDirective key={item.id} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Edit, Toolbar]} />
      </GridComponent>

      <Dialog open={show} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Update Status for {selectedRowData.CostSummary}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Buyer"
              type="text"
              fullWidth
              variant="standard"
              value={selectedRowData.Buyer}
              InputProps={{ readOnly: true }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="Cost"
              type="text"
              fullWidth
              variant="standard"
              value={selectedRowData.Cost}
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
                <MenuItem value="Not Paid">Not Paid</MenuItem>
                <MenuItem value="Partically Paid">Partically Paid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
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

export default TripCosts;
