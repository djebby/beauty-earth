import React, { useRef, useState } from "react";
import Wrapper from "../../shared/components/UIElements/Wrapper.js";
import Input from "../../shared/components/UIElements/Input.js";

const NewPicture = () => {
  //-----------------------------------------------------------------------------------------------------------------------------hooks-part
  const refTitle = useRef("");
  const refDescription = useRef("");
  const refAddress = useRef("");
  const refImage = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [successAlertVisibility, setSuccessAlertVisibility] = useState(false);
  const [inputValidation, setInputValidation] = useState({
    titleCssClasses: "",
    descriptionCssClasses: "",
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
        refTitle.current.value.trim().length >= 3 &&
        refDescription.current.value.trim().length >= 10 &&
        refImage.current.files[0] !== undefined
      ) {
        const formData = new FormData();
        formData.append("title", refTitle.current.value);
        formData.append("description", refDescription.current.value);
        formData.append("address", refAddress.current.value);
        formData.append("image", refImage.current.files[0]);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}pictures/`,
          {
            method: "POST",
            body: formData,
            headers: {},
          }
        );
        const data = await response.json();
        setIsLoading(false);
        if (response.ok) {
          // this response give us the new posted picture
          console.log(response.ok, data);
          setSuccessAlertVisibility(true);
          setTimeout(() => {
            setSuccessAlertVisibility(false);
          }, 5000);
          //reset the form & the css classes of validation
          refTitle.current.value = "";
          refDescription.current.value = "";
          refAddress.current.value = "";
          refImage.current.value = "";
          setInputValidation({
            titleCssClasses: "",
            descriptionCssClasses: "",
            imageCssClasses: "",
            wrongInputsAlertVisibility: false,
            wrongInputsAlertMessage: "",
          });
        } else {
          //error from backend validation...
          errorHandler(data.message);
          console.log(data); // failed to post the pic try again...
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
      {successAlertVisibility && (
        <div className="alert alert-success" role="alert">
          <i className="bi bi-send-check m-1"></i>
          Picture Added Successfully
        </div>
      )}
      <Input
        ref={refTitle}
        type="text"
        name="title"
        placeholder="picture title..."
        label="Picture Title : "
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
      />

      <Input
        ref={refImage}
        type="file"
        name="image"
        accept=".jpg,.png,.jpeg"
        label="Picture : "
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
            Loading...
          </>
        ) : (
          "post"
        )}
      </button>
    </Wrapper>
  );
};
export default NewPicture;
