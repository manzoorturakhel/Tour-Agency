import { useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TourList from "./Tours/components/TourList";
import "./App.css";
import Header from "./shared/navigations/Header";
import TourDetails from "./Tours/components/TourDetails";
import SignUp from "./auth/components/SignUp";
import Card from "./shared/UI/Card";
let logoutTimer;
function App() {
  const token = useSelector((state) => state.tours.token);
  const dispatch = useDispatch();
  const autoLogout = useCallback(() => {
    console.log("autoLogout");

    dispatch({
      type: "LOGOUT",
    });
  }, [dispatch]);
  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("userId") &&
      new Date(localStorage.getItem("tokenExpirationDate")) > new Date()
    ) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      dispatch({
        type: "AUTH_LOG",
        token,
        userId,
      });
    }
  }, [dispatch]);
  useEffect(() => {
    console.log("token:", token);
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("tokenExpirationDate")
    ) {
      const remainingTime = +(
        new Date(localStorage.getItem("tokenExpirationDate")).getTime() -
        new Date().getTime()
      );
      console.log("remaining Time", remainingTime);
      logoutTimer = setTimeout(autoLogout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [dispatch, autoLogout, token]);
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<TourList />} />
          <Route path="/tours/:tourId" element={<TourDetails />} />

          <Route path="/reviews" element={<div> review components </div>} />
          <Route path="/authenticate" element={<SignUp />} />
          <Route path="*" element={<Card>Page not Available</Card>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
