import React, { useEffect, useState } from "react";
import "./ResetPassword.css";
import { InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../../redux/actions/userAction";

export default function ResetPassword({ show, onHide, changeAuthMode }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [resetBtnDisabled, setResetBtnDisabled] = useState(false);
  const { error, message } = useSelector((state) => state.forgetPassword);

  const handleConfirm = async () => {
    setResetBtnDisabled(true);
    if (!validateEmail(email)) {
      toast.error("Invalid email format. Please enter a valid email address.");
      setResetBtnDisabled(false);
      return;
    }

    dispatch(forgotPassword(email));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
      setResetBtnDisabled(false);
    }
    if (message) {
      toast.success(message);
      setResetBtnDisabled(true);
      clickBtnByClass(".btn-close");
    }
  }, [dispatch, error, message]);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const clickBtnByClass = (cls) => {
    const button = document.querySelector(cls);
    button.click();
  };

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
        className="reset_modal"
        show={show}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="_reset_form mt-5"
            onSubmit={(e) => {
              preventDefault(e);
            }}
          >
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center mb-4">
          <button
            className="btn reset_btn"
            onClick={handleConfirm}
            disabled={resetBtnDisabled}
          >
            {resetBtnDisabled ? "..." : "Confirm"}
          </button>
          <p className="reset_notif">
            Go back to Log in ?{" "}
            <p className="_link" onClick={changeAuthMode}>
              Log In
            </p>
          </p>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
