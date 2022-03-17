import React, { useState } from "react";
import { Link } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import MainHeader from "./MainHeader.js";
import NavLinks from "./NavLinks";
import logo from "../../../beautiful-earth-nav-logo.svg";
import Backdrop from "../UIElements/Backdrop.js";
import SideDrawer from "./SideDrawer.js";

const MainNavigation = (props) => {
  const [drawerOpeningState, setDrawerOpeningState] = useState(false);

  const openDrawerHandler = () => {
      setDrawerOpeningState(true);
  }
  const closeDrawerHandler = () => {
      setDrawerOpeningState(false);
  }
  console.log(drawerOpeningState);
  return (
    <>
        {drawerOpeningState && <Backdrop onClick={closeDrawerHandler}/>}
        <SideDrawer show={drawerOpeningState} onClick={closeDrawerHandler}>
            <nav className={classes.drawer_nav}>
                <NavLinks />
            </nav>
        </SideDrawer>
        <MainHeader>
            <Link to="/">
                <img src={logo} className={classes.logo} />
            </Link>
            <button className={`btn ${classes.nav_btn}`} onClick={openDrawerHandler}>
                <i className="bi bi-list" style={{fontSize: "2.5rem", color:"white"}}></i>
            </button>
            <nav className={classes.header_nav}>
                <NavLinks />
            </nav>
        </MainHeader>
    </>
  );
};

export default MainNavigation;
