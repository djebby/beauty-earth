import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../shared/components/UIElements/Wrapper.js";

import classes from "./Pictures.module.css";

const Pictures = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const [isLoading, setIsLoading] = useState(true);
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState(false);
  //-----------------------------------------------------------------------------------------------------------------------------fetching-data
  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}pictures/`
        );
        if (!response.ok) {
          setIsLoading(false);
          setError(true);
        }
        const data = await response.json();
        if (response.ok && data.pictures !== null) {
          setPictures(data.pictures);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    };
    fetchPictures();
  }, []);
  //-----------------------------------------------------------------------------------------------------------------------------pictureDeleteHandler
  const pictureDeleteHandler = async (id) => {
    console.log(
      "this function is for deleting the picture with this id =>",
      id
    );
  };
  //-----------------------------------------------------------------------------------------------------------------------------return(JSX)
  return error ? (
    <div className="alert alert-danger" role="alert">
      <i className="bi bi-exclamation-octagon-fill m-1"></i>
      There is no response backed from the server
    </div>
  ) : isLoading ? (
    <div
      className="spinner-border"
      style={{ width: "3rem", height: "3rem", margin: "0 48vw" }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  ) : (
    pictures.map((picture) => (
      <Wrapper key={picture._id}>
        <img
          className={classes.img}
          src={`${process.env.REACT_APP_ASSET_URL + picture.image_url}`}
        />
        <div className={classes.row}>
          <h3>{picture.title}</h3>
          <Link to={`/${picture.creator_id._id}/pictures`}>
            <img
              className={classes.img_avatar}
              src={`${
                process.env.REACT_APP_ASSET_URL + picture.creator_id.image_url
              }`}
            />
            {picture.creator_id.name}
          </Link>
        </div>
        <p>{picture.description}</p>
        <h6>
          <i className="bi bi-geo-alt-fill"></i> {picture.address}
        </h6>
        <div className={classes.edit_delete}>
          <Link to={`/pictures/update/${picture._id}`}>
            <button type="button" className="btn btn-success mx-4">
              Editing
            </button>
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={pictureDeleteHandler.bind(this, picture._id)}
          >
            Delete
          </button>
        </div>
      </Wrapper>
    ))
  );
};

export default Pictures;
