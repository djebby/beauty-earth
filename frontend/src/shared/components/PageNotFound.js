import React from "react";

import classes from "./PageNotFound.module.css";
import imageSrc from "../../images/page_not_found.svg";

const PageNotFound = () => {
  return (
    <>
      <div className="alert alert-primary" role="alert">
        <i className="bi bi-info-circle mx-3"></i>
        Page Not Found !
      </div>
      <img
        src={imageSrc}
        alt="page not found !"
        className={classes.not_found_page}
      />
    </>
  );
};

export default PageNotFound;
