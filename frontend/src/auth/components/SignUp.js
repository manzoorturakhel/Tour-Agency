import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../shared/UI/Button";
import Card from "../../shared/UI/Card";
import Input from "../../shared/UI/Input";
import { signUpAction, login } from "../../actions/authActions";
import classes from "./SignUp.module.css";
import ErrorModel from "../../shared/UI/errorModel";
import useForm from "../../custom hooks/form-hook";
import Loader from "../../shared/UI/Loader";

const SignUp = () => {
  const [loginBtn, setLoginBtn] = useState(false);

  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.tours.isModalOpen);
  const loading = useSelector((state) => state.tours.loading);
  const isAuthenticated = useSelector((state) => state.tours.isAuthenticated);

  // console.log("laoding", loading);

  // console.log("model", isModalOpen);
  const modalMsg = useSelector((state) => state.tours.message);
  const btnText = `${
    loginBtn === false ? "Switch to Login" : "Switch To Sign Up"
  }`;
  const [formData, gettingInputValues] = useForm({
    inputs: {
      name: {
        val: "",
        isValid: false,
      },
      email: {
        val: "",
        isValid: false,
      },
      password: {
        val: "",
        isValid: false,
      },
      confirmPassword: {
        val: "",
        isValid: false,
      },
      photo: {
        val: "",
        isValid: false,
      },
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const signUpHandler = () => {
    const data = {
      name: formData.inputs.name.val,
      email: formData.inputs.email.val,
      photo: formData.inputs.photo.val,
      password: formData.inputs.password.val,
      confirmPassword: formData.inputs.confirmPassword.val,
    };
    // console.warn("signup", data);
    // const checking = dispatch(signUpAction(data));

    dispatch(signUpAction(data, navigate));

    //useNavigate('/');
  };
  let isFormValid =
    loginBtn === true
      ? formData.inputs.email.isValid && formData.inputs.password.isValid
      : formData.inputs.name.isValid &&
        formData.inputs.email.isValid &&
        formData.inputs.password.isValid &&
        formData.inputs.confirmPassword.isValid &&
        formData.inputs.photo.isValid;

  return (
    <Card>
      {isModalOpen === true && (
        <ErrorModel header={modalMsg.header} body={modalMsg.body} />
      )}
      {loading && <Loader />}
      <form
        style={{ display: `${!loading ? "block" : "none"}` }}
        className={classes.signUp}
        onSubmit={(e) => {
          e.preventDefault();
          //  console.log(formData);
          // console.log("something");
        }}
      >
        <fieldset>
          <legend>{loginBtn === true ? "Login" : "Sign Up"}</legend>

          <table className={classes.table}>
            <tbody>
              <tr
                style={{
                  display: `${loginBtn === true ? "none" : "table-row"}`,
                }}
              >
                <th>
                  <label htmlFor="name">Name:</label>
                </th>
                <td>
                  <Input
                    onInput={gettingInputValues}
                    name="name"
                    type="text"
                    required={loginBtn === true ? false : true}
                    message="name should be atleast 1 character"
                    val={formData.inputs.password.val}
                  />
                </td>
              </tr>

              <tr>
                <th>
                  <label htmlFor="email">Email:</label>
                </th>
                <td>
                  <Input
                    onInput={gettingInputValues}
                    name="email"
                    type="email"
                    required={true}
                    message="email should contain @"
                    val={formData.inputs.password.val}
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: `${loginBtn === true ? "none" : "table-row"}`,
                }}
              >
                <th>
                  <label htmlFor="photo">Photo:</label>
                </th>
                <td>
                  <Input
                    onInput={gettingInputValues}
                    name="photo"
                    type="file"
                    required={false}
                    message="file should be jpg , jpeg or png no other extensions acceptable"
                    val={formData.inputs.password.val}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="password">Password:</label>
                </th>
                <td>
                  <Input
                    onInput={gettingInputValues}
                    name="password"
                    type="password"
                    required={true}
                    message="password should be atleast 8 characters"
                    val={formData.inputs.password.val}
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: `${loginBtn === true ? "none" : "table-row"}`,
                }}
              >
                <th>
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                </th>
                <td>
                  <Input
                    onInput={gettingInputValues}
                    name="confirmPassword"
                    type="password"
                    required={loginBtn === true ? false : true}
                    message="confirm password should match password"
                    val={formData.inputs.password.val}
                  />
                </td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    textAlign: "center",
                    fontSize: "25px",

                    display: `${loginBtn === true ? "none" : "table-cell"}`,
                  }}
                >
                  <Button
                    disabled={!isFormValid}
                    type="submit"
                    onClick={signUpHandler}
                  >
                    SignUp
                  </Button>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                    display: ` ${loginBtn === false ? "none" : "table-cell"}`,
                  }}
                >
                  <Button
                    disabled={!isFormValid}
                    type="submit"
                    onClick={() => {
                      const data = {
                        email: formData.inputs.email.val,

                        password: formData.inputs.password.val,
                      };
                      //console.log("login:", data);

                      dispatch(login(data, navigate));
                    }}
                  >
                    Login
                  </Button>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="2"
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                  }}
                >
                  <Button
                    disabled={false}
                    type="button"
                    onClick={() => setLoginBtn((pre) => !pre)}
                  >
                    {btnText}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </form>
    </Card>
  );
};

export default SignUp;
