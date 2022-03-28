import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context.js";
import PictureCard from "../components/PictureCard.js";
import UserAvatar from "../components/UserAvatar";
import classes from "./UserPictures.module.css";

const UserPictures = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const logCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userPictures, setUserPictures] = useState({});
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
          setError(true);
          setIsLoading(false);
        }
        const data = await response.json();

        if (response.ok && data.userPictures !== null) {
          let picturesArray = data.userPictures.pictures_ids.map((pic) => ({
            ...pic,
            creator_id: {
              _id: data.userPictures._id,
              email: data.userPictures.email,
              name: data.userPictures.name,
              image_url: data.userPictures.image_url,
            },
          }));
          let creator = {
            _id: data.userPictures._id,
            email: data.userPictures.email,
            name: data.userPictures.name,
            image_url: data.userPictures.image_url,
          };
          setUserPictures({ pictures: picturesArray, creator });
          setIsLoading(false);
        }
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchPictures();
  }, [userId]);
  //-----------------------------------------------------------------------------------------------------------------------------pictureDeleteHandler
  const pictureDeleteHandler = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}pictures/${id}`,
        {
          method: "DELETE",
          body: {},
          headers: { Authorization: `Bearer ${logCtx.token}` },
        }
      );
      if (response.ok) {
        //if the response is ok we should filter out the deleted pic from the array
        setUserPictures((oldUserPictures) => ({
          ...oldUserPictures,
          pictures: oldUserPictures.pictures.filter((pic) => pic._id !== id),
        }));
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
  ) :  userPictures.pictures.length === 0 ? (
    <>
      <UserAvatar
        name={userPictures.creator.name}
        email={userPictures.creator.email}
        image_url={userPictures.creator.image_url}
      />

      <div className="alert alert-warning" role="alert">
        No Picture Founded!
      </div>
    </>
  ) : (
    <>
      <UserAvatar
        name={userPictures.creator.name}
        email={userPictures.creator.email}
        image_url={userPictures.creator.image_url}
      />
      {userPictures.pictures.map((picture) => (
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
