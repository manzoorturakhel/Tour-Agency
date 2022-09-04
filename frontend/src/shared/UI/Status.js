import React from "react";
import "./Status.css";
const Status = (props) => {
  return (
    <div className="status">
      <h6>{props.message}</h6>
    </div>
  );
};

export default Status;
