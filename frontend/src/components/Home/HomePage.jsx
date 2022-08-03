import React, { useContext, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { AuthContext } from "../../MainContext";
import Rightpanel from "./Rightpanel";
import Leftpanel from "./Leftpanel";
import { HomeContext } from "./HomeContext";
import { onValue,ref } from "firebase/database";
import {db} from "../../firebase";

function HomePage() {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [currCollection, setCurrCollection] = React.useState(null);
  const [collections, setCollections] = React.useState([]);

  const { logOut, setUser, user } = useContext(AuthContext);

  const handleClose = () => {
    setOpenMenu(false);
  };



  const handleClickOpen = () => {
    setOpenMenu(true);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    onValue(ref(db,user.id),snapshot=>{
      const data = snapshot.val();
      if(data !== null && data.collections !== undefined) {
        setCollections(data.collections);
      }
    })
    
  },[]);

  return (
    <div>
      <HomeContext.Provider
        value={{
          currCollection,
          setCurrCollection,
          collections,
          setCollections,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" style={{ backgroundColor: "#115571" }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {user.name}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClickOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openMenu}
                onClose={handleClose}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        </Box>
        <Leftpanel />
        <Rightpanel />
      </HomeContext.Provider>
    </div>
  );
}

export default HomePage;
