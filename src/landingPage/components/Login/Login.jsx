import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputGroup, Form, Modal } from "react-bootstrap";

import Register from "../Register/Register";
import ResetPassword from "../ResetPassword/ResetPassword";

import "./Login.css";
import { useNavigate } from "react-router-dom";
import { clearErrors, loginUser } from "../../../redux/actions/userAction";

export default function Login({ show, onHide }) {
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Replace local state with Redux state
  const dispatch = useDispatch();

  const { isAuthenticated, error } = useSelector((state) => state.user);

  const [authMode, setAuthMode] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [pwShow, setPwShow] = useState(false);

  const changeAuthMode = (mode) => {
    setAuthMode(mode);
  };

  const [loginBtnDisabled, setLoginBtnDisabled] = useState(false);

  const handleLogin = async () => {
    const { email, password } = formData;
    setLoginBtnDisabled(true);

    if (!email || !password) {
      toast.error("Please provide email and password!");
      setLoginBtnDisabled(false);
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format. Please enter a valid email address.");
      setLoginBtnDisabled(false);
      return;
    }

    // Dispatch the loginUser action
    dispatch(loginUser(email, password));
  };

  useEffect(() => {
    if (!show) {
      setAuthMode("signin");
    }
    if (error) {
      toast.error(error);
      setLoginBtnDisabled(false);
      dispatch(clearErrors());
    }
  }, [show, dispatch, error, navigate, isAuthenticated]);

  if (authMode === "signup") {
    return (
      <>
        <Register show={show} onHide={onHide} changeAuthMode={changeAuthMode} />
      </>
    );
  }
  if (authMode === "resetPassword") {
    return (
      <>
        <ResetPassword
          show={show}
          onHide={onHide}
          changeAuthMode={changeAuthMode}
        />
      </>
    );
  }

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="signin_modal"
        show={show}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>Log in</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center flex-column items-center">
          <Form className="_signin_form mt-5">
            <InputGroup className="_input_group mb-3">
              <InputGroup.Text id="basic-addon1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M21.2746 4.90806C21.185 4.30916 20.8838 3.76218 20.4256 3.36626C19.9673 2.97035 19.3824 2.75172 18.7769 2.75H3.22425C2.61869 2.75172 2.03378 2.97035 1.57556 3.36626C1.11735 3.76218 0.816146 4.30916 0.726562 4.90806L11.0006 11.5562L21.2746 4.90806Z"
                    fill="#444790"
                  />
                  <path
                    d="M11.3733 12.9526C11.2621 13.0245 11.1325 13.0627 11 13.0627C10.8675 13.0627 10.7379 13.0245 10.6267 12.9526L0.6875 6.52168V16.7139C0.688228 17.3863 0.955666 18.031 1.43114 18.5064C1.90661 18.9819 2.55127 19.2493 3.22369 19.2501H18.7763C19.4487 19.2493 20.0934 18.9819 20.5689 18.5064C21.0443 18.031 21.3118 17.3863 21.3125 16.7139V6.521L11.3733 12.9526Z"
                    fill="#444790"
                  />
                </svg>
              </InputGroup.Text>
              <Form.Control
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon1"
                type="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </InputGroup>
            <InputGroup className="_input_group mb-0">
              <InputGroup.Text id="basic-addon1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_171_5414)">
                    <path
                      d="M18.1151 1.8847C15.602 -0.628423 11.513 -0.628384 8.99992 1.88474C7.28332 3.60134 6.68707 6.13107 7.43035 8.42619L0.17168 15.6849C0.0617969 15.7948 0 15.9435 0 16.0992V19.414C0 19.7378 0.26207 19.9999 0.585938 19.9999H3.9007C4.05633 19.9999 4.20512 19.9381 4.31496 19.8282L5.14352 18.9991C5.26996 18.8726 5.33176 18.6952 5.31117 18.5173L5.20816 17.6269L6.44184 17.5108C6.72223 17.4844 6.94367 17.263 6.97 16.9826L7.08617 15.7489L7.97652 15.8525C8.14187 15.8748 8.3084 15.8193 8.43371 15.7083C8.55844 15.5967 8.62996 15.4376 8.62996 15.2706V14.1796H9.70113C9.85676 14.1796 10.0055 14.1178 10.1154 14.0079L11.618 12.5252C13.9125 13.269 16.3985 12.7177 18.1151 10.9999C20.6282 8.48685 20.6282 4.39783 18.1151 1.8847ZM16.4575 6.02806C15.772 6.71357 14.6573 6.71357 13.9718 6.02806C13.2863 5.34255 13.2863 4.22791 13.9718 3.5424C14.6573 2.85689 15.772 2.85689 16.4575 3.5424C17.143 4.22791 17.143 5.34255 16.4575 6.02806Z"
                      fill="#444790"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_171_5414">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </InputGroup.Text>
              <Form.Control
                placeholder="Password"
                aria-label="Password"
                aria-describedby="basic-addon1"
                type={pwShow ? "text" : "password"}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autocomplete="new-password"
                className="_pw_input"
              />
              <InputGroup.Text
                id="basic-addon2"
                className="show_pw_btn"
                onClick={() => {
                  setPwShow(!pwShow);
                }}
              >
                {pwShow ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="#444790"
                    class="bi bi-eye-slash-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="#444790"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                )}
              </InputGroup.Text>
            </InputGroup>
            <p className="signin_notif text-end">
              <p
                className="_link"
                onClick={() => {
                  const myObject = JSON.parse(
                    localStorage.getItem("forgetPwFeedback")
                  );

                  if (myObject) {
                    toast.error(
                      "Reset link already sent, please check you mail box"
                    );
                    return;
                  }

                  setAuthMode("resetPassword");
                }}
              >
                Forgot your password ?
              </p>
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center mb-4">
          <button
            className="btn signin_btn"
            onClick={handleLogin}
            disabled={loginBtnDisabled}
          >
            {loginBtnDisabled ? "..." : "Log in"}
          </button>
          <p className="signin_notif">
            You don't have an account ?{" "}
            <p className="_link" onClick={() => setAuthMode("signup")}>
              Sign up
            </p>
          </p>
        </Modal.Footer>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Modal>
    </>
  );
}
