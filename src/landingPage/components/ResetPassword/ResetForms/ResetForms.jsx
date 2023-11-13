import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./ResetForms.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputGroup, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  clearErrors,
  resetPassword,
} from "../../../../redux/actions/userAction";

export default function ResetForms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { error, success } = useSelector((state) => state.forgetPassword);

  const [newPassword, setNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({});

  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [pwShow, setPwShow] = useState(false);
  const [confirmBtnDisabled, setConfirmBtnDisabled] = useState(false);

  // Password validator function
  // const isPasswordValid = (newPassword) => {
  //   const lengthCriteria = newPassword.length >= 8; // Minimum length of 8 characters
  //   const uppercaseCriteria = /[A-Z]/.test(newPassword); // Contains at least one uppercase letter
  //   const lowercaseCriteria = /[a-z]/.test(newPassword); // Contains at least one lowercase letter
  //   const numberCriteria = /[0-9]/.test(newPassword); // Contains at least one digit
  //   // eslint-disable-next-line
  //   const specialCharCriteria = /[!@#\$%^&*()_+{}[\]:;<>,.?~|/-]/.test(
  //     newPassword
  //   ); // Contains at least one special character

  //   // Combine all criteria using logical AND
  //   return (
  //     lengthCriteria &&
  //     uppercaseCriteria &&
  //     lowercaseCriteria &&
  //     numberCriteria &&
  //     specialCharCriteria
  //   );
  // };

  const onNewPasswordChange = (e) => {
    const pw = e.target.value;
    setNewPassword(pw);

    // Define password strength criteria
    const criteria = {
      length: pw.length >= 8, // Minimum length of 8 characters
      uppercase: /[A-Z]/.test(pw), // Contains at least one uppercase letter
      lowercase: /[a-z]/.test(pw), // Contains at least one lowercase letter
      number: /[0-9]/.test(pw), // Contains at least one digit
      // eslint-disable-next-line
      specialChar: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-]/.test(pw), // Contains at least one special character
    };

    // Check if the password meets all criteria
    const isValidPassword = Object.values(criteria).every(
      (criterion) => criterion
    );

    setValidNewPassword(isValidPassword);
    setPasswordCriteria(criteria);
  };

  const handlePasswordReset = async () => {
    setConfirmBtnDisabled(true);
    if (newPassword !== confirmedPassword) {
      // Check if passwords match
      toast.error("Passwords do not match");
      setConfirmBtnDisabled(false);
      return;
    }
    if (!validNewPassword) {
      // Check if the new password meets criteria
      toast.error("Password does not meet the criteria");
      setConfirmBtnDisabled(false);
      return;
    }
    // Call the resetPassword action
    dispatch(resetPassword(token, newPassword));
    toast.success("Password reset successful.");
    localStorage.removeItem("forgetPwFeedback");
    navigate("/");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, success, navigate]);

  const [btnClicked, setBtnClicked] = useState(false);

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="signin_modal"
        show
      >
        <Modal.Header>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center flex-column items-center">
          <Form className="_signin_form mt-4">
            {/* <p className="signin_notif">
              Your password should be 8 caracters min-length, has letters & number.{" "}
            </p> */}
            {/* <div id="message">
              <h4>Password must contain the following:</h4>
              <p id="length" class="valid">
                Minimum <b>8 characters.</b>
              </p>
              <p id="letter" class="valid">
                A <b>lowercase</b> letter.
              </p>
              <p id="capital" class="valid">
                A <b>capital (uppercase)</b> letter.
              </p>
              <p id="number" class="valid">
                A <b>number.</b>
              </p>
              <p id="number" class="valid">
                A <b>Special character.</b>
              </p>
            </div> */}
            <InputGroup className="_input_group mb-3">
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
                placeholder="New Password"
                aria-label="New Password"
                aria-describedby="basic-addon1"
                type={pwShow ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  onNewPasswordChange(e);
                }}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
                maxLength={30}
                className="reset_pw_input"
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
                    className="bi bi-eye-slash-fill"
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
                    className="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                )}
              </InputGroup.Text>
            </InputGroup>
            {btnClicked && newPassword === "" ? (
              <p className="reg_input_feedback">New password can't be empty</p>
            ) : btnClicked && !validNewPassword ? (
              <div className="reg_input_feedback">
                <p>
                  Invalid password. Please make sure it meets the following
                  criteria:
                </p>
                <ul>
                  {Object.entries(passwordCriteria).map(
                    ([criterion, isMet]) =>
                      !isMet && <li key={criterion}>- {criterion}</li>
                  )}
                </ul>
              </div>
            ) : newPassword.length === 30 ? (
              <p className="reg_input_feedback">Max length reached</p>
            ) : (
              <p></p>
            )}
            <InputGroup className="_input_group mb-3">
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
                placeholder="Confirm New Password"
                aria-label="Confirm New Password"
                aria-describedby="basic-addon1"
                type={pwShow ? "text" : "password"}
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                maxLength={30}
              />
            </InputGroup>
            {btnClicked && confirmedPassword === "" ? (
              <p className="reg_input_feedback">
                Comfirm password can't be empty
              </p>
            ) : btnClicked && newPassword !== confirmedPassword ? (
              <p className="reg_input_feedback">Passwords not matching</p>
            ) : (
              <p></p>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center mb-4">
          <button
            className="btn signin_btn"
            onClick={() => {
              handlePasswordReset();
              setBtnClicked(true);
            }}
            disabled={confirmBtnDisabled}
          >
            {confirmBtnDisabled ? "..." : "Confirm"}
          </button>
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
