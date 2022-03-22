import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Wrapper from "../../shared/components/UIElements/Wrapper";
import Input from "../../shared/components/UIElements/Input";

import classes from "./Login.module.css";

const Login = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const refEmail = useRef("");
  const refPassword = useRef("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValidation, setInputValidation] = useState({
    emailCssClasses: "",
    passwordCssClasses: "",
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
        refEmail.current.value.trim().includes("@") &&
        refPassword.current.value.length >= 6
      ) {
        const formData = new FormData();
        formData.append("email", refEmail.current.value);
        formData.append("password", refPassword.current.value);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}users/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: refEmail.current.value,
              password: refPassword.current.value,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setIsLoading(false);
        if (response.ok) {
          console.log(response.ok, data);
          // this response give us the token (data.userToken) to login the user and we should redirect programmatically to the home page...
          navigate("/");
        } else {
          // wrong credentials invalid email or password or server error...
          errorHandler(data.message);
          console.log(response.ok); // failed to signup the user try again...
        }
      } else {
        errorHandler("Please Enter a Valid Credentials");
      }
    } catch (error) {
      errorHandler("Failed to fetch");
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
              refPassword.current.value.length >= 6 ? "is-valid" : "is-invalid",
          }));
        }}
      />
      <div className={classes.login}>
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
          ) : (
            "login"
          )}
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </Wrapper>
  );
};

export default Login;
