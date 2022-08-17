import {
  Paper,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  DialogTitle,
  Button,
  TextField,
  TextareaAutosize,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { HomeContext } from "./HomeContext";
import { AuthContext } from "../../MainContext";
import { uid } from "uid";
import { db } from "../../firebase";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const navIcons = {
  position: "absolute",
  right: "5px",
  bottom: "5px",
};

const testareaStyle = {
  marginTop: "10px",
};

const fabStyle = {
  backgroundColor: "#31AFB4",
  color: "white",
  position: "absolute",
  right: "3%",
  bottom: "5%",
};

const dummyNotes = [
  {
    index: 0,
    type: "statement",
    statement:
      "Write in your own voice: Use your own words to describe your qualifications to make your statement feel more personal and uniquely you.",
  },
  {
    index: 1,
    type: "defination",
    term: "Some term 1",
    statement:
      "Write in your own voice: Use your own words to describe your qualifications to make your statement feel more personal and uniquely you.",
  },
  {
    index: 2,
    type: "defination",
    term: "Some term 2",
    statement: "Write in your own voice: Use your own words to describe your",
  },
  {
    index: 3,
    type: "statement",
    statement:
      "Write in your own voice: Use your own words to describe your qualifications to make your statement feel more personal and uniquely you.Write in your own voice: Use your own words to describe your qualifications to make your statement feel more personal and uniquely you.Write in your own voice: Use your own words to describe your qualifications to make your statement feel more personal and uniquely you.Write in your own voice: Use your own words to describe your qualifications to make your statement feel more personal and uniquely you.",
  },
  {
    index: 4,
    type: "statement",
    statement: "Write in your own voice: Use your",
  },
];

function Rightpanel() {
  const [open, setOpen] = useState(false);
  const [statement, setStatement] = useState(true);
  const [notes, setNotes] = useState([]);
  const [onCardLoading, setOnCardLoading] = useState(false);
  const [currSlide, setCurrSlide] = useState(
    notes.length > 0 ? notes[0] : null
  );

  const { currCollection, isLoading, setIsLoading } = useContext(HomeContext);
  const { user, desktop } = useContext(AuthContext);

  const mainDiv = {
    position: "absolute",
    width: desktop ? "80%" : "100%",
    left: desktop ? "20%" : 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.01)",
  };

  const paperStyle = {
    width: "70%",
    height: !desktop ? "60%" : "50%",
    margin: "0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "30px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    justifyContent: "center",
    padding: "10px",
    // display: "flex",
    alignItems: "center",
    verticalAlign: "middle",
    // flexDirection: "column"
  };

  const toogle = () => {
    setStatement(!statement);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getNotes = async (indicator) => {
    await axios
      .post("/Notes/getNotes", { id: currCollection.id })
      .then((res) => {
        const response = res.data;
        setNotes(response);

        if (indicator === "first") {
          response.length > 0 && setCurrSlide(response[0]);
        } else if (indicator === "last") {
          response.length > 0 && setCurrSlide(response[response.length - 1]);
        } else {
          if (response.length > 0) {
            setCurrSlide(response[indicator]);
          } else {
            setCurrSlide(null);
          }
          // response.length > 0 &&
        }
        setIsLoading(false);
      });
  };

  const addNote = async (note) => {
    const uuid = uid();

    await axios
      .post("/Notes/addNotes", {
        note: { id: uuid, ...note },
        id: currCollection.id,
      })
      .then((res) => {
        setCurrSlide(res.data);
      });

    getNotes("last");
    handleClose();
  };

  useEffect(() => {
    if (currCollection !== null) {
      setCurrSlide(null);
      setNotes([]);
      getNotes("first");
    }
  }, [currCollection]);

  const handleAdd = (event) => {
    event.preventDefault();
    if (statement) {
      const temp = document.getElementById("textArea").value;
      if (temp !== "") {
        const note = {
          type: "statement",
          statement: temp,
        };

        addNote(note);
        // getNotes("last");

        document.getElementById("textArea").value = "";
      }
    } else {
      const temp1 = document.getElementById("textArea").value;
      const temp2 = document.getElementById("term").value;

      if (temp1 !== "" && temp2 !== "") {
        const note = {
          type: "defination",
          statement: temp1,
          term: temp2,
        };

        addNote(note);
        // getNotes("last");

        document.getElementById("textArea").value = "";
        document.getElementById("term").value = "";
      }
    }
  };

  const editSlide = () => {
    alert("Feature coming soon...");
  };

  const deleteSlide = async () => {
    // alert("Feature coming soon...");

    const temp = {
      collectionID: currCollection.id,
      noteID: currSlide.id,
    };
    setOnCardLoading(true);
    await axios
      .post("/Notes/deleteNote", temp)
      .then((res) => {
        if (res.data === "deleted") {
          if (currSlide.index === 0) {
            //deleting the last
            getNotes(currSlide.index);
          } else if (currSlide.index === notes.length - 1) {
            getNotes(currSlide.index - 1);
          } else {
            getNotes(currSlide.index);
          }
          // getNotes(currSlide.index);
        }
      });
    setOnCardLoading(false);
  };

  const handleNavigation = (curr) => {
    switch (curr) {
      case "prev":
        if (currSlide.index !== 0) {
          setCurrSlide(notes[currSlide.index - 1]);
        }
        break;

      case "next":
        if (currSlide.index !== notes.length - 1) {
          setCurrSlide(notes[currSlide.index + 1]);
        }
        break;

      case "edit":
        editSlide();
        break;
      case "delete":
        deleteSlide();
        break;
      default:
        return;
    }
  };

  return (
    <div style={mainDiv}>
      {isLoading ? (
        <Box style={paperStyle}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {currSlide !== null ? (
            <>
              <Paper elevation={5} style={paperStyle}>
                {onCardLoading ? (
                  <Box style={paperStyle}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {currSlide.type === "defination" && (
                      <Typography gutterBottom variant="h3">
                        {currSlide.term}
                      </Typography>
                    )}
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "80%",
                        textAlign: "center",
                        marginBottom: !desktop ? "20%" : "7%",
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {currSlide.statement}
                      </Typography>
                    </div>
                  </>
                )}
                <div
                  style={{
                    position: "absolute",
                    left: "15px",
                    bottom: "5px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {currSlide.index + 1 + " of " + notes.length}
                  </Typography>
                </div>

                <div style={navIcons}>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavigation("delete");
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavigation("edit");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Previous">
                    <IconButton
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavigation("prev");
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Next">
                    <IconButton
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavigation("next");
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Paper>
            </>
          ) : (
            <>
              {currCollection === null ? (
                <Paper elevation={5} style={paperStyle}>
                  <Typography variant="h4" gutterBottom>
                    Hey {user.name.split(" ")[0]}
                  </Typography>
                  {!desktop && (
                    <Typography variant="h6" gutterBottom>
                      Open the menu to create your first collection
                    </Typography>
                  )}
                </Paper>
              ) : (
                <Paper elevation={5} style={paperStyle}>
                  <Typography variant="h2">No notes</Typography>
                </Paper>
              )}
            </>
          )}
        </>
      )}

      <Fab style={fabStyle} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"New Card"}</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <FormGroup
            style={{ width: "20%", marginBottom: "5%", color: "black" }}
          >
            <FormControlLabel
              control={<Checkbox checked={statement} />}
              label="Statement"
              onClick={toogle}
            />
          </FormGroup>
          {!statement && (
            <TextField
              required
              id="term"
              type="text"
              label="Term"
              size="small"
            />
          )}
          <TextareaAutosize
            id="textArea"
            required
            aria-label="minimum height"
            minRows={3}
            maxRows={6}
            placeholder={statement ? "Statement" : "Defination"}
            style={testareaStyle}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ backgroundColor: "#115571", color: "#FFFFFF" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            style={{ backgroundColor: "#31AFB4", color: "#FFFFFF" }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Rightpanel;
