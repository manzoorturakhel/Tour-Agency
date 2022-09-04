import React, { useReducer, useEffect } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      // console.log("state checking in input change", state);

      if (action.inputType === "email") {
        return {
          ...state,
          value: action.value,
          isValid: action.value.includes("@"),
        };
      } else if (
        action.inputType === "password" &&
        action.name === "confirmPassword"
      ) {
        return {
          ...state,
          value: action.value,
          isValid: action.value === action.val,
        };
      } else if (action.inputType === "password") {
        //console.log("password:", state.password, "value:", action.value);
        return {
          ...state,
          value: action.value,

          isValid: action.value.length >= 8,
        };
      } else if (
        action.inputType === "text" &&
        action.name.toLowerCase() === "title"
      ) {
        return {
          ...state,
          value: action.value,
          isValid: action.value.trim().length >= 10,
        };
      } else {
        return {
          ...state,
          value: action.value,
          isValid: action.value.trim().length > 0,
        };
      }
    case "TOUCHED":
      return {
        ...state,
        touched: true,
      };

    default:
      return state;
  }
};

const Input = (props) => {
  const [input, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,

    touched: false,
  });
  // const [password, setPassword] = useState("");
  const isValidd = input.isValid === false && input.touched === true;
  // console.log(input.value, input.isValid, input.touched);
  const { onInput, name, val } = props;
  const { value, isValid } = input;
  //console.log("val:", val);

  useEffect(() => {
    onInput(name, value, isValid);
  }, [onInput, name, value, isValid]);

  const inputChangeHandler = (e) => {
    // console.log("name:", e.target.name);
    dispatch({
      type: "INPUT_CHANGE",
      value: e.target.value,
      val: val || null,
      inputType: props.type || "text",
      name: props.name || "title",
    });
  };
  const inputBlurHandler = () => {
    dispatch({
      type: "TOUCHED",
    });
  };

  return (
    <>
      <input
        id={props.name}
        style={{
          outlineColor: `${isValidd ? "red" : "black"}`,
          width: "50%",
          height: "30px",
          borderColor: `${isValidd ? "red" : "black"}`,
          marginBottom: "10px",
        }}
        type={props.type || "text"}
        name={props.name}
        value={input.value}
        required={props.required}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        autoComplete="off"
      />
      {isValidd && <p style={{ color: "white" }}>{props.message}</p>}

      <br></br>
    </>
  );
};

export default React.memo(Input);
