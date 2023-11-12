import React from "react";
import { Form } from "react-bootstrap";
import "./EventsDash.css";

export default function StepThree() {
  return (
    <div>
      <div className="row align-items-center my-3">
        <Form.Label className="col-md-2 mb-md-0 mb-3 event_dates_box_form_label">
          Time Zone :
        </Form.Label>
        <div className="col-md-10">
          <Form.Select className="create_event_form_input create_event_form_select text-uppercase">
            <option value={""}></option>
            <option value={"adult"}>adult</option>
            <option value={"children"}>children</option>
          </Form.Select>
        </div>
        <div className="col-md-2"></div>
        <p className="create_event_form_explanation col-md-10 mt-3">
          “If you haven't found a suitable ticket, you must first create it”
        </p>
        <div className="col-md-2"></div>
        <div className="col-md-10 mt-3">
          <button className="btn create_event_form_add_dates" type="buttton">
            Create Ticket{" "}
            <svg
              width="40"
              height="40"
              viewBox="0 0 53 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                opacity="0.92"
                cx="26.5"
                cy="27"
                rx="26.5"
                ry="26"
                fill="#BDCAF7"
              />
              <path
                d="M25.5931 34.2209V20.7337H27.4149V34.2209H25.5931ZM19.7551 28.3828V26.5717H33.2529V28.3828H19.7551Z"
                fill="#444790"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
