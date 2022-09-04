//import useFetch from "../hooks/useFetch";
//import { useNavigate } from "react-router-dom";
export const postAction = (data, token) => async (dispatch) => {
  try {
    if (!token) {
      dispatch({
        type: "setMessage",
        header: "Posting failed",
        body: "User not Authorized!! Please Authorize(sign Up / Sign In) yourself!",
      });
      dispatch({ type: "openModal" });
      throw new Error("User should be authenticated");
    }

    const tour = await fetch("http://localhost:5000/api/v1/tours", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const tourData = await tour.json();
    if (tourData.status !== "success") {
      //console.log("tourDaa:", tourData);
      dispatch({
        type: "setMessage",
        header: "Posting failed",
        body: "Title shouldnt be <10 and should be unique",
      });
      dispatch({ type: "openModal" });
      throw new Error("Tours names should be unique");
    }

    dispatch({
      type: "addTour",
      payload: tourData.data.tour,
    });
  } catch (err) {
    console.log("error", err.message);
  }
};

export const tourDeleteAction = (id, navigate, token) => async (dispatch) => {
  try {
    if (!token) {
      dispatch({
        type: "setMessage",
        header: "Deletion failed",
        body: "User not Authorized!!! Please signUp/signIn",
      });
      dispatch({ type: "openModal" });
      throw new Error("User should be authenticated");
    }
    await fetch(`http://localhost:5000/api/v1/tours/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    dispatch({
      type: "deleteTour",
      payload: id,
    });
    navigate("/");
  } catch (error) {
    console.log(error.message);
  }
};
export const tourEditeAction = (id, data, token) => async (dispatch) => {
  try {
    if (!token) {
      dispatch({
        type: "setMessage",
        header: "Editing failed",
        body: "User not Authorized!!! please signUp/signIn",
      });
      dispatch({ type: "openModal" });
      throw new Error("User should be authenticated");
    }

    const tour = await fetch(`http://localhost:5000/api/v1/tours/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const editedTour = await tour.json();
    if (editedTour.status !== "success") {
      dispatch({
        type: "setMessage",
        header: "Editing Failed Error",
        body: "Title shouldnt be <10 and should be unique",
      });
      dispatch({
        type: "openModal",
      });
      //throw new Error("can't updated undefined id");
      return;
    }

    dispatch({
      type: "editTour",
      payload: data,
    });
  } catch (error) {
    console.log(error.message);
  }
};
