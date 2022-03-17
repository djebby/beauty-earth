import React from "react";
import { CSSTransition } from "react-transition-group"; //npm i react-transition-group

import classes from "./SideDrawer.module.css";

const SideDrawer = (props) => {
  return (
    <CSSTransition
    in={props.show}
    timeout={200}
    classNames="slide-in-left"
    mountOnEnter
    unmountOnExit
    >
      <aside className={classes.side_drawer} onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );
};

export default SideDrawer;
