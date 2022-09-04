import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Header.css";
import Button from "../UI/Button";

const Header = () => {
  const isAuthenticated = useSelector((state) => state.tours.isAuthenticated);
  const dispatch = useDispatch();
  //console.warn(isAuthenticated);
  //console.timeLog(isAuthenticated);
  const signOutHandler = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li>
          <NavLink to="/">Tours</NavLink>
        </li>
        <li>
          <NavLink to="/users">Users</NavLink>
        </li>
        <li>
          <NavLink to="/reviews">Reviews</NavLink>
        </li>
        {isAuthenticated === false && (
          <li>
            <NavLink to="/authenticate">Authenticate</NavLink>
          </li>
        )}
        {isAuthenticated === true && (
          <li>
            <Button onClick={signOutHandler}>logout</Button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
