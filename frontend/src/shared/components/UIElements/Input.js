import React from "react";
import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  return (
    <div className={`mb-3 ${classes.main_input}`}>
      <label htmlFor={props.name} className="form-label">
        {props.label}
      </label>
      <input
        onBlur={props.onBlur}
        onChange={props.onChange}
        ref={ref}
        type={props.type}
        className= {`form-control ${props.cssClasses}`}
        id={props.name}
        placeholder={props.placeholder}
        accept={props.accept}
      />
    </div>
  );
});

export default Input;
