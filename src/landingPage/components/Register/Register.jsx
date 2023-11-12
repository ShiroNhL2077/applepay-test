import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./Register.css";
import axios from "axios";
import { InputGroup } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { isValidNumber } from "libphonenumber-js";
// import { PhoneInput } from "react-international-phone";
// import "react-international-phone/style.css";

export default function Register({ show, onHide, changeAuthMode }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  // const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validEmail2, setValidEmail2] = useState(false);
  // const [validPhone, setValidPhone] = useState(false);
  const [validPassword, setValidPassword] = useState(true);

  const [passwordCriteria, setPasswordCriteria] = useState({});

  const [pwShow, setPwShow] = useState(false);

  const [signupBtnDisabled, setSignupBtnDisabled] = useState(false);

  const onFirstNameChange = (e) => {
    const fname = e.target.value;
    const formattedFname = capitalizeEachWord(fname);
    setFirstName(formattedFname);

    if (formattedFname.length > 2) {
      setValidFirstName(true);
    } else {
      setValidFirstName(false);
    }
  };

  // Function to capitalize each word
  function capitalizeEachWord(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const onLastNameChange = (e) => {
    const lname = e.target.value;
    const formattedLname = capitalizeEachWord(lname);
    setLastName(formattedLname);
    if (formattedLname.length > 2) {
      setValidLastName(true);
    } else {
      setValidLastName(false);
    }
  };

  const onEmailChange = (e) => {
    const eml = e.target.value;
    setEmail(eml);
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailRegex.test(eml) && eml.length > 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const onEmail2Change = (e) => {
    const eml = e.target.value;
    setEmail2(eml);
    if (eml === email) {
      setValidEmail2(true);
    } else {
      setValidEmail2(false);
    }
  };

  // const onPasswordChange = (e) => {
  //   const pw = e.target.value;
  //   setPassword(pw);

  //   // Define password strength criteria
  //   const lengthCriteria = pw.length >= 8; // Minimum length of 8 characters
  //   const uppercaseCriteria = /[A-Z]/.test(pw); // Contains at least one uppercase letter
  //   const lowercaseCriteria = /[a-z]/.test(pw); // Contains at least one lowercase letter
  //   const numberCriteria = /[0-9]/.test(pw); // Contains at least one digit
  //   const specialCharCriteria = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-]/.test(pw); // Contains at least one special character

  //   // Check if the password meets all criteria
  //   if (
  //     lengthCriteria &&
  //     uppercaseCriteria &&
  //     lowercaseCriteria &&
  //     numberCriteria &&
  //     specialCharCriteria
  //   ) {
  //     setValidPassword(true);
  //   } else {
  //     setValidPassword(false);
  //   }
  // };

  const onPasswordChange = (e) => {
    const pw = e.target.value;
    setPassword(pw);

    // Define password strength criteria
    const criteria = {
      length: pw.length >= 8, // Minimum length of 8 characters
      uppercase: /[A-Z]/.test(pw), // Contains at least one uppercase letter
      lowercase: /[a-z]/.test(pw), // Contains at least one lowercase letter
      number: /[0-9]/.test(pw), // Contains at least one digit
      
      specialChar: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-]/.test(pw), // Contains at least one special character
    };

    // Check if the password meets all criteria
    const isValidPassword = Object.values(criteria).every(
      (criterion) => criterion
    );

    setValidPassword(isValidPassword);
    setPasswordCriteria(criteria);
  };

  console.log(firstName, validFirstName);
  console.log(lastName, validLastName);
  console.log(email, validEmail);
  console.log(email2, validEmail2);
  console.log(password, validPassword);

  /* test */

  const registerBuyer = async () => {
    setSignupBtnDisabled(true);
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === ""
    ) {
      toast.error("Please fill all fields", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setSignupBtnDisabled(false);
      return;
    }

    if (
      !validFirstName ||
      !validLastName ||
      !validEmail ||
      !validEmail2 ||
      !validPassword
    ) {
      setSignupBtnDisabled(false);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/buyer-register`,
        {
          firstname: firstName,
          lastname: lastName,
          email,
          password,
        }
      );
      if (response.status === 201) {
        toast.success(
          "Registration successful. Please check your email for verification.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        hideModal();
      }
    } catch (error) {
      console.error("Registration failed: ", error);
      toast.error("Registration failed !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setSignupBtnDisabled(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Simulate a click on the button with a specified ID
      document.getElementById("regBtn").click();
    }
  };

  const hideModal = () => {
    onHide();
  };

  const [btnClicked, setBtnClicked] = useState(false);

  return (
    <div>
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
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="signup_modal"
        show={show}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="_signup_form mt-5">
            <InputGroup className="_input_group">
              <InputGroup.Text id="first-name-input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                >
                  <path
                    d="M0 20C0 15.8095 3.6 12.381 8 12.381C12.4 12.381 16 15.8095 16 20H0ZM8 11.4286C4.7 11.4286 2 8.85714 2 5.71429C2 2.57143 4.7 0 8 0C11.3 0 14 2.57143 14 5.71429C14 8.85714 11.3 11.4286 8 11.4286Z"
                    fill="#444790"
                  />
                </svg>
              </InputGroup.Text>
              <Form.Control
                placeholder="First name"
                aria-label="First name"
                aria-describedby="first-name-input"
                value={firstName}
                onChange={(e) => {
                  onFirstNameChange(e);
                }}
                maxLength={12}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            {btnClicked && firstName === "" ? (
              <p className="reg_input_feedback">First name can't be empty</p>
            ) : btnClicked && firstName.length < 3 ? (
              <p className="reg_input_feedback">
                First name need to be at least 3 characters
              </p>
            ) : firstName.length === 12 ? (
              <p className="reg_input_feedback">Max length reached</p>
            ) : (
              <p></p>
            )}
            <InputGroup className="_input_group">
              <InputGroup.Text id="last-name-input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                >
                  <path
                    d="M0 20C0 15.8095 3.6 12.381 8 12.381C12.4 12.381 16 15.8095 16 20H0ZM8 11.4286C4.7 11.4286 2 8.85714 2 5.71429C2 2.57143 4.7 0 8 0C11.3 0 14 2.57143 14 5.71429C14 8.85714 11.3 11.4286 8 11.4286Z"
                    fill="#444790"
                  />
                </svg>
              </InputGroup.Text>
              <Form.Control
                placeholder="Last name"
                aria-label="Last name"
                aria-describedby="last-name-input"
                value={lastName}
                onChange={(e) => {
                  onLastNameChange(e);
                }}
                maxLength={12}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            {btnClicked && lastName === "" ? (
              <p className="reg_input_feedback">Last name can't be empty</p>
            ) : btnClicked && lastName.length < 3 ? (
              <p className="reg_input_feedback">
                Last name need to be at least 3 characters
              </p>
            ) : lastName.length === 12 ? (
              <p className="reg_input_feedback">Max length reached</p>
            ) : (
              <p></p>
            )}
            {/* <InputGroup className="_input_group">
              <InputGroup.Text id="phone-input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M17.466 0H8.53545C6.44385 0 4.74219 1.70166 4.74219 3.79326V22.2067C4.74219 24.2983 6.44385 26 8.53545 26H17.466C19.5576 26 21.2593 24.2983 21.2593 22.2067V3.79326C21.2593 1.70166 19.5576 0 17.466 0ZM11.8857 1.26081H14.1158C14.3062 1.26081 14.4606 1.41516 14.4606 1.60565C14.4606 1.79615 14.3062 1.9505 14.1158 1.9505H11.8857C11.6952 1.9505 11.5409 1.79615 11.5409 1.60565C11.5409 1.41516 11.6952 1.26081 11.8857 1.26081ZM13.0007 24.4572C12.3913 24.4572 11.8973 23.9632 11.8973 23.3538C11.8973 22.7443 12.3913 22.2503 13.0007 22.2503C13.6102 22.2503 14.1042 22.7443 14.1042 23.3538C14.1042 23.9632 13.6102 24.4572 13.0007 24.4572ZM19.5352 20.0202C19.5352 20.3996 19.2248 20.7099 18.8455 20.7099H7.15608C6.77676 20.7099 6.4664 20.3996 6.4664 20.0202V3.88161C6.4664 3.50229 6.77676 3.19193 7.15608 3.19193H18.8455C19.2248 3.19193 19.5352 3.50229 19.5352 3.88161V20.0202Z"
                    fill="#444790"
                  />
                </svg>
              </InputGroup.Text>
              <PhoneInput
                id="number"
                name="number"
                value={phone}
                className="form-control _phone_input"
                onChange={(number) => {
                  setPhone(number);
                  setValidPhone(isValidNumber(number));
                }}
                forceDialCode
                disableDialCodePrefill
              />
            </InputGroup> */}
            <InputGroup className="_input_group">
              <InputGroup.Text id="email-input">
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
                aria-describedby="email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  onEmailChange(e);
                }}
                autoComplete="off"
                maxLength={30}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            {btnClicked && email === "" ? (
              <p className="reg_input_feedback">Email can't be empty</p>
            ) : btnClicked && !validEmail ? (
              <p className="reg_input_feedback">Invalid email</p>
            ) : email.length === 30 ? (
              <p className="reg_input_feedback">Max length reached</p>
            ) : (
              <p></p>
            )}
            <InputGroup className="_input_group">
              <InputGroup.Text id="email-comfirm-input">
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
                placeholder="Comfirm email"
                aria-label="Comfirm email"
                aria-describedby="email-comfirm-input"
                type="email"
                value={email2}
                onChange={(e) => {
                  onEmail2Change(e);
                }}
                autoComplete="off"
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            {btnClicked && email2 === "" ? (
              <p className="reg_input_feedback">Comfirm email can't be empty</p>
            ) : btnClicked && !validEmail2 ? (
              <p className="reg_input_feedback">Emails not matching</p>
            ) : (
              <p></p>
            )}
            <InputGroup className="_input_group">
              <InputGroup.Text id="password-input">
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
                aria-describedby="password-input"
                type={pwShow ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  onPasswordChange(e);
                }}
                autocomplete="new-password"
                className="_pw_input"
                maxLength={30}
                onKeyPress={handleKeyPress}
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
                    className="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                )}
              </InputGroup.Text>
            </InputGroup>
            {btnClicked && password === "" ? (
              <p className="reg_input_feedback">Password can't be empty</p>
            ) : btnClicked && !validPassword ? (
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
            ) : password.length === 30 ? (
              <p className="reg_input_feedback">Max length reached</p>
            ) : (
              <p></p>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center mb-4">
          <button
            className="btn signup_btn"
            id="regBtn"
            onClick={() => {
              registerBuyer();
              if (btnClicked === false) {
                setBtnClicked(true);
              } else {
                return;
              }
            }}
            disabled={signupBtnDisabled}
          >
            {signupBtnDisabled ? "..." : "Register"}
          </button>
          <p className="signup_notif mt-3">
            You have an account ?{" "}
            <p className="_link" onClick={changeAuthMode}>
              Sign in
            </p>
          </p>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
