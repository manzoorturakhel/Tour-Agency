import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        inputs: {
          ...state.inputs,
          [action.id]: { val: action.value, isValid: action.isValid },
        },
      };

    default:
      return state;
  }
};

const useForm = (initialState) => {
  const [formData, dispatch] = useReducer(formReducer, initialState);

  const gettingInputValues = useCallback((id, value, isValid) => {
    dispatch({
      type: "CHANGE_INPUT",
      value: value,
      isValid: isValid,
      id: id,
    });
    //console.log("inside callback function:", value, validaty);
  }, []);

  return [formData, gettingInputValues];
};

export default useForm;
