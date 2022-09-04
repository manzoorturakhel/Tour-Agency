import React from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import "./errorModel.css";
import Button from "./Button";

const ErrorModel = (props) => {
  const dispatch = useDispatch();

  return ReactDOM.createPortal(
    <div
      className={`overlay `}
      onClick={() =>
        dispatch({
          type: "closeModal",
        })
      }
    >
      <div className="Modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="Model__header">
          <h4>{props.header}</h4>
        </div>
        <div className="Modal__body">
          <h2>{props.body}</h2>
        </div>
        <div className="Modal__footer">
          <Button
            onClick={() =>
              dispatch({
                type: "closeModal",
              })
            }
          >
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

export default ErrorModel;
