import React from "react";
import classes from "./Button.module.css";
const Button = (props) => {
  //console.log(props.disabled);
  return (
    <button
      style={{
        cursor: `${props.disabled ? "not-allowed" : "pointer"}`,
      }}
      disabled={props.disabled}
      className={classes.btn}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;

/*
disabled={true} isformValid kala true da? kala che tol conditions met shi




*/
