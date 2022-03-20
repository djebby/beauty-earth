import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../shared/components/UIElements/Wrapper";
import Input from "../../shared/components/UIElements/Input";

import classes from "./SignUp.module.css";

const SignUp = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const refName = useRef("");
  const refEmail = useRef("");
  const refPassword = useRef("");
  const refImage = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValidation, setInputValidation] = useState({
    nameCssClasses: "",
    emailCssClasses: "",
    passwordCssClasses: "",
    imageCssClasses: "",
    wrongInputsAlertVisibility: false,
    wrongInputsAlertMessage: "",
  });
  //-----------------------------------------------------------------------------------------------------------------------------onSubmitHandler
  const onSubmitHandler = async () => {
    setIsLoading(true);
    try {
      if (
        refName.current.value.length >= 6 &&
        refEmail.current.value.includes("@") &&
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
          console.log(response.ok, data);
          // this response give us the token (data.token) to login the new signup user and redirect to the home page...
        } else {
          //error from backend validation...
          setInputValidation((prevInputValidation) => ({
            ...prevInputValidation,
            wrongInputsAlertVisibility: true,
            wrongInputsAlertMessage: data.message,
          }));
          setTimeout(() => {
            setInputValidation((prevInputValidation) => ({
              ...prevInputValidation,
              wrongInputsAlertVisibility: false,
            }));
          }, 5000);
          console.log(data); // failed to signup the user try again...
        }
      } else {
        //error from frontend validation...
        setIsLoading(false);
        setInputValidation((prevInputValidation) => ({
          ...prevInputValidation,
          wrongInputsAlertVisibility: true,
          wrongInputsAlertMessage: "Please Enter a Valid Inputs Value",
        }));
        setTimeout(() => {
          setInputValidation((prevInputValidation) => ({
            ...prevInputValidation,
            wrongInputsAlertVisibility: false,
          }));
        }, 5000);
      }
    } catch (error) {
      console.log(error.message);
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
              refName.current.value.length >= 6 ? "is-valid" : "is-invalid",
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
            emailCssClasses: refEmail.current.value.includes("@")
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
              refPassword.current.value.length >= 6 ? "is-valid" : "is-invalid",
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
