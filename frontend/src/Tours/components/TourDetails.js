import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { tourDeleteAction } from "../../actions/tourActions";

import "./TourDetails.css";
import ErrorModel from "../../shared/UI/errorModel";
//import ErrorModel from "../../shared/UI/errorModel";

const TourDetails = () => {
  //const [isModalOpen,setIsModalOpen]= useState(false);
  let navigate = useNavigate();
  const { tourId } = useParams();
  // console.log(tourId);
  // const dispatch = useDispatch();
  const state = useSelector((state) => state.tours);
  const token = useSelector((state) => state.tours.token);
  const isModalOpen = useSelector((state) => state.tours.isModalOpen);
  const message = useSelector((state) => state.tours.message);

  //const isModalOpen = useSelector((state) => state.isModalOpen);
  const dispatch = useDispatch();
  // const [tour, setTour] = useState(null);

  const thisTour = state.tours.find((tour) => tour.id === tourId);
  if (thisTour === undefined) {
    return (
      <div className="tour_details">
        <h1>This {tourId} is an invalid Id</h1>{" "}
      </div>
    );
  }
  // console.log(thisTour);

  const onTourDeleteHandler = (id) => {
    dispatch(tourDeleteAction(id, navigate, token));

    //console.log(data);
  };

  return (
    <div className="tour_details">
      {isModalOpen === true && (
        <ErrorModel header={message.header} body={message.body} />
      )}

      {thisTour === undefined && <h1>This {tourId} is an invalid Id</h1>}
      <img
        src="https://images.unsplash.com/photo-1555083892-97490c72c90c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"
        alt={thisTour.name}
      />
      <div className="tour__content">
        <h1>{thisTour.name}</h1>
        <h4>Duration: {thisTour.duration}</h4>
        <p>
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Description:
          </span>
          {thisTour.description}
        </p>
        <p>
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Average Ratings:
          </span>
          {thisTour.ratingsAverage}
        </p>

        <p>
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Rated by:
          </span>
          {thisTour.ratingsQuantity} people
        </p>
        <p>
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Difficulty:
          </span>
          {thisTour.difficulty}
        </p>
        <p>
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Locations:
          </span>
          {thisTour.locations.map((location) => (
            <span key={location._id}>{location.description}, </span>
          ))}
        </p>
        <div className="button__center">
          <button
            onClick={() => onTourDeleteHandler(tourId)}
            style={{
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
