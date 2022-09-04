import React from "react";
import { Link } from "react-router-dom";
import "./tour.css";

const Tour = ({ id, name, price, rating, getId, isEditable }) => {
  return (
    <div className="tour__overview">
      <img
        src="https://images.unsplash.com/photo-1555083892-97490c72c90c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"
        alt="tour_1"
        className="tour__image"
      />

      <div className="tour_body">
        <h5 className="tour__name">{name}</h5>
        <p className="tour__price">Price:{price}$</p>
        <p className="tour_rating">Average Ratings:{rating}</p>
      </div>
      <div className="tour_buttons">
        <Link to={`/tours/${id}`}>Details</Link>
        <button
          className="button"
          onClick={() => {
            getId(id);
            isEditable(false);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Tour;
