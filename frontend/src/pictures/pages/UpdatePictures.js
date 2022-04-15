import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context.js";
import Wrapper from "../../shared/components/UIElements/Wrapper.js";
import Input from "../../shared/components/UIElements/Input.js";
import classes from "./UpdatePictures.module.css";

const UpdatePictures = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const logCtx = useContext(AuthContext);
  const navigation = useNavigate();
  const refTitle = useRef("");
  const refDescription = useRef("");
  const refAddress = useRef("");
  const pid = useParams().picId;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [picture, setPicture] = useState({});
  const [successAlertVisibility, setSuccessAlertVisibility] = useState(false);
  const [inputValidation, setInputValidation] = useState({
    titleCssClasses: "",
    descriptionCssClasses: "",
    wrongInputsAlertVisibility: false,
    wrongInputsAlertMessage: "",
  });
 
  //-----------------------------------------------------------------------------------------------------------------------------fetching-data
  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}pictures/${pid}`
        );
        if (response.ok) {
          const data = await response.json();
          if(data.picture.creator_id !== logCtx.userId){
            navigation("/");
          }
          setPicture(data.picture);
        } else {
          setError(true);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    };
    fetchPicture();
  }, []);
  //-----------------------------------------------------------------------------------------------------------------------------errorHandler
  const errorHandler = (errorMessage) => {
    setIsLoading(false);
    setInputValidation((prevInputValidation) => ({
      ...prevInputValidation,
      wrongInputsAlertVisibility: true,
      wrongInputsAlertMessage: errorMessage,
    }));
    setTimeout(() => {
      setInputValidation((prevInputValidation) => ({
        ...prevInputValidation,
        wrongInputsAlertVisibility: false,
      }));
    }, 5000);
  };
  //-----------------------------------------------------------------------------------------------------------------------------onSubmitHandler
  const onSubmitHandler = async () => {
    try {
      if (
        refTitle.current.value.trim().length >= 3 &&
        refDescription.current.value.trim().length >= 10
      ) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}pictures/${pid}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              title: refTitle.current.value,
              description: refDescription.current.value,
              address: refAddress.current.value,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${logCtx.token}`
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          // this response give us the new updated picture
          setSuccessAlertVisibility(true);
          setTimeout(() => {
            setSuccessAlertVisibility(false);
          }, 5000);
          //reset the form & the css classes of validation
          setInputValidation({
            titleCssClasses: "",
            descriptionCssClasses: "",
            wrongInputsAlertVisibility: false,
            wrongInputsAlertMessage: "",
          });
        } else {
          //error from backend validation...
          errorHandler(data.message);
          console.log(data); // failed to update the pic try again...
        }
      } else {
        //error from frontend validation...
        errorHandler("Please Enter a Valid Inputs Value");
      }
    } catch (error) {
      errorHandler("Failed to fetch");
      console.log(error);
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
  ) : (
    <Wrapper>
      {inputValidation.wrongInputsAlertVisibility && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-octagon-fill m-1"></i>
          {inputValidation.wrongInputsAlertMessage}
        </div>
      )}
      {successAlertVisibility && (
        <div className="alert alert-success" role="alert">
          <i className="bi bi-send-check m-1"></i>
          Picture Updated Successfully
        </div>
      )}
      <img
        className={classes.img}
        src={picture.image_url}
        alt={picture.description}
      />
      <Input
        ref={refTitle}
        type="text"
        name="title"
        placeholder="picture title..."
        label="Picture Title : "
        defaultValue={picture.title}
        cssClasses={inputValidation.titleCssClasses}
        onBlur={() => {
          setInputValidation((prevCssClasses) => ({
            ...prevCssClasses,
            titleCssClasses:
              refTitle.current.value.trim().length >= 3
                ? "is-valid"
                : "is-invalid",
          }));
        }}
      />
      <Input
        ref={refDescription}
        type="text"
        name="description"
        placeholder="picture description..."
        label="Picture Description : "
        defaultValue={picture.description}
        cssClasses={inputValidation.descriptionCssClasses}
        onBlur={() => {
          setInputValidation((prevCssClasses) => ({
            ...prevCssClasses,
            descriptionCssClasses:
              refDescription.current.value.trim().length >= 10
                ? "is-valid"
                : "is-invalid",
          }));
        }}
      />
      <Input
        ref={refAddress}
        type="text"
        name="address"
        placeholder="picture address..."
        label="Picture Address : "
        defaultValue={picture.address}
      />
      <button
        className="btn btn-info"
        onClick={onSubmitHandler}
        disabled={isLoading}
      >
        Update
      </button>
    </Wrapper>
  );
};

export default UpdatePictures;
