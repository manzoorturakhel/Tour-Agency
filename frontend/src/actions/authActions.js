export const signUpAction = (data, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: "LOAD",
    });
    const signUp = await fetch("http://localhost:5000/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const signupData = await signUp.json();

    if (signupData.status !== "success") {
      dispatch({
        type: "UNLOAD",
      });
      dispatch({
        type: "setMessage",
        header: "Sign Up Failed",
        body: "the user already exists",
      });
      dispatch({
        type: "openModal",
      });
      throw new Error("can't updated undefined id");
    }
    localStorage.setItem("token", signupData.token);
    localStorage.setItem("userId", signupData.data.user._id);

    dispatch({
      type: "SIGNUP",
      token: signupData.token,
      userId: signupData.data.user._id,
    });
    dispatch({
      type: "UNLOAD",
    });
    navigate("/");
  } catch (error) {
    console.log(error.message);
  }
};
export const login = (data, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: "LOAD",
    });
    const login = await fetch(`http://localhost:5000/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const loginData = await login.json();
    if (loginData.status !== "success") {
      dispatch({
        type: "UNLOAD",
      });
      dispatch({
        type: "setMessage",
        header: "login failed",
        body: "Either password or email is wrong",
      });
      dispatch({
        type: "openModal",
      });

      throw new Error("can't login");
    }
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("userId", loginData.data.user._id);
    localStorage.setItem(
      "tokenExpirationDate",
      new Date(new Date().getTime() + 60 * 1000 * 180)
    );
    dispatch({
      type: "login",
      token: loginData.token,
      userId: loginData.data.user._id,
    });
    dispatch({
      type: "UNLOAD",
    });
    navigate("/");
  } catch (error) {
    console.warn(error.message);
  }
};

export const logout = (navigate) => async (dispatch) => {};
