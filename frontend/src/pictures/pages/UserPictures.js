import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from "./UserPictures.module.css";
import PictureCard from "../components/PictureCard.js";
import UserAvatar from "../components/UserAvatar";

const UserPictures = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const [isLoading, setIsLoading] = useState(true);
  const [userPictures, setUserPictures] = useState([]);
  const [error, setError] = useState(false);
  const userId = useParams().userId;
  //-----------------------------------------------------------------------------------------------------------------------------fetching-data
  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}users/${userId}`
        );
        if (!response.ok) {
          setIsLoading(false);
          setError(true);
        }
        const data = await response.json();
        console.log(response.status);
        console.log(data);
        if (response.ok && data.userPictures !== null) {
          setUserPictures(data.userPictures);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    };
    fetchPictures();
  }, [userId]);
  //-----------------------------------------------------------------------------------------------------------------------------pictureDeleteHandler
  const pictureDeleteHandler = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}pictures/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        //if the response is ok we should filter out the deleted pic from the array
        setUserPictures((oldPictures) =>
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
  ) : isLoading || userPictures.length === 0 ? (
    <div
      className="spinner-border"
      style={{ width: "3rem", height: "3rem", margin: "0 48vw" }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  ) : userPictures.pictures_ids.length === 0 ? (
    <>
      <UserAvatar
        name={userPictures.name}
        email={userPictures.email}
        image_url={userPictures.image_url}
      />

      <div className="alert alert-warning" role="alert">
        No Picture Founded!
      </div>
    </>
  ) : (
    <>
      <UserAvatar
        name={userPictures.name}
        email={userPictures.email}
        image_url={userPictures.image_url}
      />
      {userPictures.pictures_ids.map((picture) => (
        <PictureCard
          key={picture._id}
          picture={picture}
          pictureDeleteHandler={pictureDeleteHandler}
        />
      ))}
    </>
  );
};

export default UserPictures;
