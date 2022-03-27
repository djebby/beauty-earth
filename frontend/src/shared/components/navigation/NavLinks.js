import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context.js";

import classes from "./NavLinks.module.css";

const NavLinks = (props) => {
  const logCtx = useContext(AuthContext);

  const activeLinkStyle = ({ isActive }) => ({
    color: isActive ? "#61dafb" : "",
    borderBottom: isActive ? "solid 5px #61dafb" : "",
  });
  return (
    <ul className={classes.nav_links}>
      <div>
        <li>
          <NavLink style={activeLinkStyle} to="/">
            ALL PICs
          </NavLink>
        </li>
        {logCtx.isLoggedIn && (
          <>
            <li>
              <NavLink
                style={activeLinkStyle}
                to={`/${logCtx.userId}/pictures`}
              >
                MY PICs
              </NavLink>
            </li>

            <li>
              <NavLink style={activeLinkStyle} to="/pictures/new">
                ADD PIC
              </NavLink>
            </li>
          </>
        )}
      </div>
      <div>
        {!logCtx.isLoggedIn ? (
          <li>
            <NavLink style={activeLinkStyle} to="/login">
              LOGIN
            </NavLink>
          </li>
        ) : (
          <li>
            <button
              onClick={logCtx.logout}
              className="btn btn-outline-light btn-sm"
            >
              LOGOUT
            </button>
          </li>
        )}
      </div>
    </ul>
  );
};

export default NavLinks;
