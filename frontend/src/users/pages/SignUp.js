import React, { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import Wrapper from "../../shared/components/UIElements/Wrapper";
import Input from "../../shared/components/UIElements/Input";


import classes from "./SignUp.module.css";

const SignUp = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const logCtx = useContext(AuthContext); console.log(logCtx);
  const refName = useRef("");
  const refEmail = useRef("");
  const refPassword = useRef("");
  const refImage = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValidation, setInputValidation] = useState({
    nameCssClasses: "",
    emailCssClasses: "",
    passwordCssClasses: "",
    imageCssClasses: "",
    wrongInputsAlertVisibility: false,
    wrongInputsAlertMessage: "",
  });
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
    setIsLoading(true);
    try {
      if (
        refName.current.value.trim().length >= 6 &&
        refEmail.current.value.trim().includes("@") &&
        refPassword.current.value.length >= 6 &&
        refImage.current.files[0] !== undefined
      ) {
        const formData = new FormData();
        formData.append("name", refName.current.value);
        formData.append("email", refEmail.current.value);
        formData.append("password", refPassword.current.value);
        formData.append("image", refImage.current.files[0]);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}users/signup`,
          {
            method: "POST",
            body: formData,
            headers: {},
          }
        );
        const data = await response.json();
        setIsLoading(false);
        if (response.ok) {
          // if the user signup successfully we should store the userId (data.userId) & the userToken (data.userToken) in the Context  
          logCtx.login(data.userId, data.userToken);
          // we should redirect programmatically to the home page...
          navigate("/");
        } else {
          //error from backend validation...
          errorHandler(data.message);
          console.log(data); // failed to signup the user try again...
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
  return (
    <Wrapper>
      {inputValidation.wrongInputsAlertVisibility && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-octagon-fill m-1"></i>
          {inputValidation.wrongInputsAlertMessage}
        </div>
      )}
      <Input
        ref={refName}
        type="text"
        name="name"
        placeholder="your name..."
        label="User Name : "
        cssClasses={inputValidation.nameCssClasses}
        onBlur={() => {
          setInputValidation((prevCssClasses) => ({
            ...prevCssClasses,
            nameCssClasses:
              refName.current.value.trim().length >= 6 ? "is-valid" : "is-invalid",
          }));
        }}
      />
      <Input
        ref={refEmail}
        type="email"
        name="email"
        placeholder="your email..."
        label="User Email : "
        cssClasses={inputValidation.emailCssClasses}
        onBlur={() => {
          setInputValidation((prevCssClasses) => ({
            ...prevCssClasses,
            emailCssClasses: refEmail.current.value.trim().includes("@")
              ? "is-valid"
              : "is-invalid",
          }));
        }}
      />
      <Input
        ref={refPassword}
        type="password"
        name="password"
        placeholder="your password..."
        label="User Password : "
        cssClasses={inputValidation.passwordCssClasses}
        onBlur={() => {
          setInputValidation((prevCssClasses) => ({
            ...prevCssClasses,
            passwordCssClasses:
              refPassword.current.value.trim().length >= 6 ? "is-valid" : "is-invalid",
          }));
        }}
      />
      <Input
        ref={refImage}
        type="file"
        name="image"
        accept=".jpg,.png,.jpeg"
        label="User Picture : "
        cssClasses={inputValidation.imageCssClasses}
        onChange={() => {
          setInputValidation((prevCssClasses) => ({
            ...prevCssClasses,
            imageCssClasses:
              refImage.current.files[0] === undefined
                ? "is-invalid"
                : "is-valid",
          }));
        }}
      />
      <div className={classes.signup}>
        <button
          className="btn btn-info"
          onClick={onSubmitHandler}
          disabled={isLoading}
        >
          {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...{" "}
              </>
          ) : "signup"}
        </button>
        <p>
          You have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </Wrapper>
  );
};
export default SignUp;
