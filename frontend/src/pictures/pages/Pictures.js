import React, { useState, useEffect } from "react";
import PictureCard from "../components/PictureCard.js";

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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}pictures/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        //if the response is ok we should filter out the deleted pic from the array
        setPictures((oldPictures) =>
          oldPictures.filter((pic) => pic._id !== id)
        );
      }
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
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
  ) : pictures.length === 0 ? (
    <div className="alert alert-warning" role="alert">
      No Picture Founded!
    </div>
  ) : (
    pictures.map((picture) => (
      <PictureCard
        key={picture._id}
        picture={picture}
        pictureDeleteHandler={pictureDeleteHandler}
      />
    ))
  );
};

export default Pictures;
