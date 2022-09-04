import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../shared/UI/Loader";
import Tour from "./Tour";

import { postAction, tourEditeAction } from "../../actions/tourActions";
import "./TourList.css";
import ErrorModel from "../../shared/UI/errorModel";

function TourList() {
  console.log("timers updates");
  // const navigate = useNavigate();
  // console.log("changing");
  const [isEditable, setIsEditable] = useState(true);
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState(Number);
  const [name, setName] = useState("The Beautiful Nuristan");
  const [duration, setDuration] = useState(9);
  const [maxGroup, setMaxGroup] = useState(3);
  const [difficulty, setDifficulty] = useState("difficult");
  const [price, setPrice] = useState(999);
  const [summary, setSummary] = useState("it was quite a unique adventure");
  const [imageCover, setImageCover] = useState("images/nuristan.png");

  const dispatch = useDispatch();
  const state = useSelector((state) => state.tours);
  const token = useSelector((state) => state.tours.token);

  const isModalOpen = useSelector((state) => state.tours.isModalOpen);
  const userId = useSelector((state) => state.tours.userId);

  const message = useSelector((state) => state.tours.message);

  // [isModalVisible, setIsModalVisible] = useState(isModalOpen);

  const { tours } = state;
  //console.log("tourList component");
  //console.log(state?.tours.length);

  useEffect(() => {
    const getTours = async () => {
      setLoader(true);
      const tours = await fetch("http://localhost:5000/api/v1/tours", {
        method: "GET",
      });
      const toursData = await tours.json();

      dispatch({
        type: "getTours",
        payload: toursData.data?.tours,
      });

      setLoader(false);
    };
    // console.log("tours length", tours.length);

    //console.log("im here!!");
    getTours();
  }, [dispatch]);

  const createTourSubmitHandler = (e) => {
    e.preventDefault();
  };
  const editHandler = (bool) => {
    setIsEditable(false);
  };
  const gettingId = (id) => {
    //console.log(id);
    setId(id);
    const thisTour = state.tours.find((tour) => tour._id === id);
    //console.log(thisTour);
    setName(thisTour.name);
    setDuration(thisTour.duration);
    setDifficulty(thisTour.difficulty);
    setMaxGroup(thisTour.maxGroupSize);
    setPrice(thisTour.price);
    setImageCover(thisTour.imageCover);
    setSummary(thisTour.summary);
  };
  let tour;

  if (state?.tours.length > 0) {
    tour = state.tours.map((tour) => {
      return (
        <Tour
          tours={state.tours}
          getId={gettingId}
          isEditable={editHandler}
          id={tour._id}
          name={tour.name}
          key={tour._id}
          price={tour.price}
          rating={tour.ratingsAverage}
        />
      );
    });
  } else {
    if (loader !== true) {
      tour = (
        <h1 style={{ color: "white", textAlign: "center" }}>No tour found!!</h1>
      );
    }
  }

  return (
    <div className="main__page">
      <div className="tour__list">
        {" "}
        {loader === true && state.tours.length === 0 && <Loader />}
        {isModalOpen && (
          <ErrorModel header={message.header} body={message.body} />
        )}
        {tour}
      </div>
      <div className="tour__create__form">
        <form onSubmit={createTourSubmitHandler}>
          <table className="table">
            <caption style={{ textAlign: "center" }}>Create New Tour</caption>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="name">Name:</label>
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    type="text"
                    maxLength="40"
                    minLength="10"
                    name="name"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="duration">Duration:</label>
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      setDuration(e.target.value);
                    }}
                    value={duration}
                    type="number"
                    name="duration"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="maxGroup">maxGroup:</label>
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      setMaxGroup(e.target.value);
                    }}
                    value={maxGroup}
                    type="number"
                    name="maxGroup"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="difficulty">difficulty:</label>
                </td>
                <td>
                  <select
                    onChange={(e) => {
                      // console.log(e.target.value);
                      setDifficulty(e.target.value);
                    }}
                  >
                    <option value={"difficult"}>difficult</option>
                    <option value={"medium"}>medium</option>
                    <option value={"easy"}>easy</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="price">price:</label>
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                    value={price}
                    type="number"
                    name="price"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="summary">summary:</label>
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      setSummary(e.target.value);
                    }}
                    value={summary}
                    type="text"
                    maxLength="40"
                    minLength="10"
                    name="summary"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="imageCover">imageCover:</label>
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      setImageCover(e.target.value);
                    }}
                    value={imageCover}
                    type="text"
                    name="coverImage"
                  />
                </td>
              </tr>
              <tr className="add__tour__row">
                <td colSpan="2">
                  <button
                    onClick={() => {
                      const newTour = {
                        name,
                        duration: duration * 1,

                        maxGroupSize: maxGroup * 1,
                        difficulty,
                        summary,
                        price: price * 1,
                        imageCover,
                        guides: userId,
                      };
                      // console.log(newTour);

                      dispatch(postAction(newTour, token));
                    }}
                    className="add__tour__btn"
                    type="submit"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      const newTour = {
                        id: id,
                        name,
                        duration: duration * 1,
                        maxGroupSize: maxGroup * 1,
                        difficulty,
                        summary,
                        price: price * 1,
                        imageCover,
                      };
                      // console.log(newTour);

                      dispatch(tourEditeAction(id, newTour, token));
                    }}
                    className="add__tour__btn"
                    type="submit"
                    disabled={isEditable}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default React.memo(TourList);
