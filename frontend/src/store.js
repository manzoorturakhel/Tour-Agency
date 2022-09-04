import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// const DEFAULT_STATE_OF_TOURS = {};
//sconst DEFAULT_STATE_OF_REVIEWS = {};
const toursReducer = (
  state = {
    isAuthenticated: false,
    tours: [],
    message: { header: "", body: "" },
    isModalOpen: false,
    userId: null,
    token: null,
    loading: false,
  },
  action
) => {
  switch (action.type) {
    case "getTours":
      return {
        ...state,
        tours: action.payload,
      };
    case "deleteTour":
      const updatedTours = { ...state };
      // console.log("Before filter Data", updatedTours);

      let filterUpdatedData = updatedTours.tours.filter(
        (tour) => tour._id !== action.payload
      );

      return {
        ...state,
        tours: filterUpdatedData,
      };
    case "addTour":
      return {
        ...state,
        tours: [...state.tours, action.payload],
      };
    case "editTour":
      const tours = [...state.tours];
      // console.log(tours);
      const findIndex = tours.findIndex(
        (tour) => tour._id === action.payload.id
      );
      // console.log(findIndex);
      let item = tours[findIndex];
      if (item) {
        item = {
          ...item,
          name: action.payload.name,
          duration: action.payload.duration,
          maxGroupSize: action.payload.maxGroupSize,
          price: action.payload.price,
          difficulty: action.payload.difficulty,
          summary: action.payload.summary,
          imageCover: action.payload.imageCover,
        };
        tours[findIndex] = item;
      }

      return {
        ...state,
        tours: tours,
      };
    case "openModal":
      return {
        ...state,
        isModalOpen: true,
      };
    case "closeModal":
      return {
        ...state,
        isModalOpen: false,
      };
    case "setMessage":
      return {
        ...state,
        message: {
          header: action.header,
          body: action.body,
        },
      };
    case "LOAD":
      return {
        ...state,
        loading: true,
      };
    case "UNLOAD":
      return {
        ...state,
        loading: false,
      };

    case "SIGNUP":
      return {
        ...state,
        isAuthenticated: true,
        userId: action.userId,
        token: action.token,
      };
    case "login":
      // console.error("login");
      return {
        ...state,
        isAuthenticated: true,
        userId: action.userId,
        token: action.token,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpirationDate");

      return {
        ...state,
        isAuthenticated: false,
        userId: null,
        token: null,
      };
    case "AUTH_LOG":
      return {
        ...state,
        isAuthenticated: true,
        userId: action.userId,
        token: action.token,
      };

    default:
      return state;
  }
};

const reducers = combineReducers({
  tours: toursReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
