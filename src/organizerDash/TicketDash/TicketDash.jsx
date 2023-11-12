import React, { useState } from "react";
import "./TicketDash.css";
import { Form, InputGroup, Modal } from "react-bootstrap";
import DatePicker from "react-multi-date-picker";

function CustomInput({ onFocus, value, onChange }) {
  return (
    <InputGroup className="eventdash_date_filter w-100">
      <Form.Control
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={"Date"}
      />
      <InputGroup.Text id="basic-addon2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 1C8.55229 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2V3.00003C17.4591 3.00031 17.8592 3.00313 18.1949 3.03057C18.5902 3.06289 18.9831 3.13424 19.3614 3.32698C19.9248 3.61405 20.3851 4.07224 20.6732 4.63781C20.8659 5.016 20.9372 5.40906 20.9695 5.80396C21 6.17815 21 6.6323 21 7.15839V16.8421C21 17.3682 21 17.8221 20.9695 18.1962C20.9372 18.591 20.8659 18.9838 20.6732 19.3619C20.3854 19.9269 19.9254 20.3859 19.3614 20.6732C18.9833 20.8659 18.5905 20.9372 18.1957 20.9695C17.8217 21 17.3677 21 16.8416 21H7.15839C6.6323 21 6.17815 21 5.80397 20.9695C5.40906 20.9372 5.016 20.8659 4.63781 20.6732C4.07276 20.3853 3.61431 19.9258 3.32698 19.3619C3.13421 18.9835 3.06288 18.5904 3.03057 18.1951C2.99997 17.8206 2.99998 17.3659 3 16.8388V7.16168C2.99998 6.6345 2.99997 6.17965 3.03057 5.80498C3.06286 5.40962 3.13416 5.01624 3.32698 4.63781C3.6146 4.07332 4.07332 3.6146 4.63781 3.32698C5.01625 3.13416 5.40962 3.06286 5.80499 3.03057C6.14079 3.00314 6.54102 3.00031 7 3.00003V2C7 1.44772 7.44772 1 8 1ZM5.9678 5.02393C5.69595 5.04613 5.59517 5.08383 5.54579 5.10899C5.35763 5.20487 5.20487 5.35763 5.109 5.54579C5.08383 5.59517 5.04614 5.69595 5.02393 5.9678C5.00358 6.21702 5.00052 6.53498 5.00007 7H18.9999C18.9995 6.53429 18.9965 6.21614 18.9761 5.96686C18.9539 5.69554 18.9163 5.595 18.8912 5.54579C18.7959 5.35871 18.6427 5.20542 18.4534 5.10899C18.4039 5.08374 18.3032 5.0461 18.0319 5.02392C17.7488 5.00078 17.3768 5 16.8002 5H7.2002C6.62365 5 6.25126 5.00078 5.9678 5.02393ZM19 9H5V16.8002C5 17.3768 5.00078 17.7489 5.02393 18.0322C5.04612 18.3037 5.08378 18.4044 5.109 18.4539C5.20516 18.6426 5.35819 18.7956 5.54579 18.8912C5.595 18.9163 5.69554 18.9539 5.96686 18.9761C6.2498 18.9992 6.62146 19 7.19691 19H16.8031C17.3786 19 17.75 18.9992 18.0327 18.9761C18.3036 18.9539 18.4041 18.9164 18.4534 18.8912C18.6421 18.7951 18.7956 18.6415 18.8912 18.4539C18.9164 18.4046 18.954 18.3041 18.9761 18.0332C18.9992 17.7505 19 17.379 19 16.8036V9ZM7 12C7 11.4477 7.44772 11 8 11H8.002C8.27127 11 8.52916 11.1086 8.71732 11.3012C8.90548 11.4938 9.00802 11.7542 9.00173 12.0234L9.00168 12.0254C8.99548 12.2906 8.88414 12.5425 8.69215 12.7256C8.50016 12.9087 8.24327 13.0081 7.97804 13.0017H7.97608C7.43327 12.9887 7 12.5449 7 12.002V12ZM11 12C11 11.4477 11.4477 11 12 11H12.002C12.2713 11 12.5292 11.1086 12.7173 11.3012C12.9055 11.4938 13.008 11.7542 13.0017 12.0234V12.0254C12.9955 12.2906 12.8841 12.5425 12.6921 12.7256C12.5002 12.9087 12.2433 13.0081 11.978 13.0017H11.9761C11.4333 12.9887 11 12.5449 11 12.002V12ZM15 12C15 11.4477 15.4477 11 16 11H16.002C16.5542 11 17.002 11.4477 17.002 12V12.002C17.002 12.2714 16.8933 12.5293 16.7006 12.7175C16.5078 12.9057 16.2473 13.0082 15.978 13.0017H15.9761C15.4333 12.9887 15 12.5449 15 12.002V12ZM7 16C7 15.4477 7.44772 15 8 15H8.002C8.27127 15 8.52916 15.1086 8.71732 15.3012C8.90548 15.4938 9.00802 15.7542 9.00173 16.0234L9.00168 16.0254C8.99548 16.2906 8.88414 16.5425 8.69215 16.7256C8.50016 16.9087 8.24327 17.0081 7.97804 17.0017H7.97608C7.43327 16.9887 7 16.5449 7 16.002V16ZM11 16C11 15.4477 11.4477 15 12 15H12.002C12.2713 15 12.5292 15.1086 12.7173 15.3012C12.9055 15.4938 13.008 15.7542 13.0017 16.0234V16.0254C12.9955 16.2906 12.8841 16.5425 12.6921 16.7256C12.5002 16.9087 12.2433 17.0081 11.978 17.0017H11.9761C11.4333 16.9887 11 16.5449 11 16.002V16ZM15 16C15 15.4477 15.4477 15 16 15H16.002C16.2713 15 16.5292 15.1086 16.7173 15.3012C16.9055 15.4938 17.008 15.7542 17.0017 16.0234V16.0254C16.9955 16.2906 16.8841 16.5425 16.6921 16.7256C16.5002 16.9087 16.2433 17.0081 15.978 17.0017H15.9761C15.4333 16.9887 15 16.5449 15 16.002V16Z"
            fill="#444790"
          />
        </svg>
      </InputGroup.Text>
    </InputGroup>
  );
}

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export default function TicketDash(props) {
  const [selectedTicketSidebarElement, setSelectedTicketSidebarElement] =
    useState("progress");

  const [rowNameFilter, setRowNameFilter] = useState(false);
  const [rowTypeFilter, setRowTypeFilter] = useState(false);
  const [rowLocationFilter, setRowLocationFilter] = useState(false);
  const [rowPriceFilter, setRowPriceFilter] = useState(false);
  const [rowQuantityFilter, setRowQuantityFilter] = useState(false);
  const [rowStartFilter, setRowStartFilter] = useState(false);
  const [rowExpireFilter, setRowExpireFilter] = useState(false);
  const [rowSelectabilityFilter, setRowSelectabilityFilter] = useState(false);

  return (
    <main className="ticketdash_container">
      <section className="eventdash_sidebar">
        <ul className="eventdash_sidebar_list text-start">
          <li
            className={`eventdash_sidebar_list_element ${
              selectedTicketSidebarElement === "free"
                ? "eventdash_sidebar_list_element_selected"
                : ""
            }`}
            onClick={() => {
              setSelectedTicketSidebarElement("free");
            }}
          >
            Free
          </li>
          <li
            className={`eventdash_sidebar_list_element ${
              selectedTicketSidebarElement === "progress"
                ? "eventdash_sidebar_list_element_selected"
                : ""
            }`}
            onClick={() => {
              setSelectedTicketSidebarElement("progress");
            }}
          >
            In Progress
          </li>
          <li
            className={`eventdash_sidebar_list_element ${
              selectedTicketSidebarElement === "expired"
                ? "eventdash_sidebar_list_element_selected"
                : ""
            }`}
            onClick={() => {
              setSelectedTicketSidebarElement("expired");
            }}
          >
            Expired
          </li>
        </ul>
      </section>
      <section className="ticketdash_content px-md-5 px-3 pt-4">
        <div className="_header">
          <h3 className="text-uppercase fw-bold text-start">
            my tickets :{" "}
            <span>
              {selectedTicketSidebarElement === "progress"
                ? "in progress"
                : selectedTicketSidebarElement === "expired"
                ? "expired"
                : "free"}
            </span>
          </h3>
          <div className="eventdash_create_event d-flex align-items-center mb-4">
            <p className="eventdash_create_event_label mb-0 me-3">
              create a new ticket
            </p>
            <button className="btn eventdash_create_event_button">+</button>
          </div>
        </div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={props.showModal}
          onHide={props.closeModal}
          className="filters_modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Filter By
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row row-cols-1">
              <div className="eventdash_filter">
                <DatePicker
                  render={<CustomInput />}
                  weekDays={weekDays}
                  highlightToday={false}
                  showOtherDays
                />
              </div>
              <div className="eventdash_filter col">
                <Form.Select className="eventdash_filter_select">
                  <option>Name</option>
                  <option value="1">VIP</option>
                  <option value="2">1st Place</option>
                  <option value="3">2sd Place</option>
                </Form.Select>
              </div>
              <div className="eventdash_filter col">
                <Form.Select className="eventdash_filter_select">
                  <option>Type</option>
                  <option value="1">Payed</option>
                  <option value="2">Free</option>
                </Form.Select>
              </div>
              <div className="eventdash_filter">
                <InputGroup className="eventdash_search_filter">
                  <Form.Control placeholder="Search" />
                  <InputGroup.Text id="basic-addon2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.707 21.293L18.738 17.324C20.3647 15.3346 21.1644 12.7961 20.9719 10.2336C20.7793 7.67103 19.6092 5.28053 17.7036 3.55652C15.798 1.83251 13.3026 0.906888 10.7337 0.97112C8.16472 1.03535 5.71873 2.08452 3.90164 3.90161C2.08455 5.7187 1.03538 8.16469 0.97115 10.7336C0.906918 13.3026 1.83254 15.798 3.55655 17.7036C5.28056 19.6092 7.67106 20.7793 10.2336 20.9718C12.7961 21.1644 15.3346 20.3646 17.324 18.738L21.293 22.707C21.4816 22.8892 21.7342 22.99 21.9964 22.9877C22.2586 22.9854 22.5094 22.8802 22.6948 22.6948C22.8803 22.5094 22.9854 22.2586 22.9877 21.9964C22.99 21.7342 22.8892 21.4816 22.707 21.293ZM11 19C9.41778 19 7.87106 18.5308 6.55546 17.6518C5.23987 16.7727 4.21449 15.5233 3.60899 14.0615C3.00349 12.5997 2.84506 10.9911 3.15374 9.43927C3.46243 7.88743 4.22435 6.46196 5.34317 5.34314C6.46199 4.22432 7.88746 3.46239 9.4393 3.15371C10.9912 2.84503 12.5997 3.00346 14.0615 3.60896C15.5233 4.21446 16.7727 5.23984 17.6518 6.55543C18.5308 7.87103 19 9.41775 19 11C18.9976 13.121 18.154 15.1544 16.6543 16.6542C15.1545 18.154 13.121 18.9976 11 19Z"
                        fill="#444790"
                      />
                    </svg>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="modal_filters_button btn">Filter</button>
          </Modal.Footer>
        </Modal>
        <div className="eventdash_filters row d-flex justify-content-between">
          <div className="tickets_filter col">
            <DatePicker
              render={<CustomInput />}
              weekDays={weekDays}
              highlightToday={false}
              showOtherDays
            />
          </div>
          <div className="eventdash_filter col">
            <Form.Select className="eventdash_filter_select">
              <option>Name</option>
              <option value="1">VIP</option>
              <option value="2">1st Place</option>
              <option value="3">2sd Place</option>
            </Form.Select>
          </div>
          <div className="eventdash_filter col">
            <Form.Select className="eventdash_filter_select">
              <option>Type</option>
              <option value="1">Payed</option>
              <option value="2">Free</option>
            </Form.Select>
          </div>
          <div className="eventdash_filter col-4">
            <InputGroup className="eventdash_search_filter">
              <Form.Control placeholder="Search" />
              <InputGroup.Text id="basic-addon2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.707 21.293L18.738 17.324C20.3647 15.3346 21.1644 12.7961 20.9719 10.2336C20.7793 7.67103 19.6092 5.28053 17.7036 3.55652C15.798 1.83251 13.3026 0.906888 10.7337 0.97112C8.16472 1.03535 5.71873 2.08452 3.90164 3.90161C2.08455 5.7187 1.03538 8.16469 0.97115 10.7336C0.906918 13.3026 1.83254 15.798 3.55655 17.7036C5.28056 19.6092 7.67106 20.7793 10.2336 20.9718C12.7961 21.1644 15.3346 20.3646 17.324 18.738L21.293 22.707C21.4816 22.8892 21.7342 22.99 21.9964 22.9877C22.2586 22.9854 22.5094 22.8802 22.6948 22.6948C22.8803 22.5094 22.9854 22.2586 22.9877 21.9964C22.99 21.7342 22.8892 21.4816 22.707 21.293ZM11 19C9.41778 19 7.87106 18.5308 6.55546 17.6518C5.23987 16.7727 4.21449 15.5233 3.60899 14.0615C3.00349 12.5997 2.84506 10.9911 3.15374 9.43927C3.46243 7.88743 4.22435 6.46196 5.34317 5.34314C6.46199 4.22432 7.88746 3.46239 9.4393 3.15371C10.9912 2.84503 12.5997 3.00346 14.0615 3.60896C15.5233 4.21446 16.7727 5.23984 17.6518 6.55543C18.5308 7.87103 19 9.41775 19 11C18.9976 13.121 18.154 15.1544 16.6543 16.6542C15.1545 18.154 13.121 18.9976 11 19Z"
                    fill="#444790"
                  />
                </svg>
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
        <div className="tickets_list mt-4">
          <div className="_filters_row">
            <div className="_row_icon">
              <svg
                width="13"
                height="20"
                viewBox="0 0 13 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                  fill="#444790"
                />
                <path
                  d="M10.5117 11.8258L6.96261 15.9675C6.90541 16.0342 6.83444 16.0878 6.75459 16.1245C6.67474 16.1612 6.58789 16.1803 6.5 16.1803C6.41211 16.1803 6.32526 16.1612 6.2454 16.1245C6.16555 16.0878 6.09459 16.0342 6.03738 15.9675L2.48828 11.8258C2.14957 11.4305 2.43039 10.8198 2.9509 10.8198L10.0501 10.8198C10.5706 10.8198 10.8514 11.4305 10.5117 11.8258Z"
                  fill="#444790"
                />
              </svg>
            </div>
            <div className="_filter">
              <span className="_label">name</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowNameFilter(!rowNameFilter);
                }}
              >
                {!rowNameFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">type</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowTypeFilter(!rowTypeFilter);
                }}
              >
                {!rowTypeFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">location</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowLocationFilter(!rowLocationFilter);
                }}
              >
                {!rowLocationFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">price</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowPriceFilter(!rowPriceFilter);
                }}
              >
                {!rowPriceFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">quantity</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowQuantityFilter(!rowQuantityFilter);
                }}
              >
                {!rowQuantityFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">start date</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowStartFilter(!rowStartFilter);
                }}
              >
                {!rowStartFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">expire date</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowExpireFilter(!rowExpireFilter);
                }}
              >
                {!rowExpireFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">selectability</span>
              <span
                className="_icon"
                onClick={() => {
                  setRowSelectabilityFilter(!rowSelectabilityFilter);
                }}
              >
                {!rowSelectabilityFilter ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 4.8258L6.96261 8.96752C6.90541 9.03424 6.83444 9.0878 6.75459 9.12452C6.67474 9.16124 6.58789 9.18025 6.5 9.18025C6.41211 9.18025 6.32526 9.16124 6.2454 9.12452C6.16555 9.0878 6.09459 9.03424 6.03738 8.96752L2.48828 4.8258C2.14957 4.43047 2.43039 3.81982 2.9509 3.81982L10.0501 3.81982C10.5706 3.81982 10.8514 4.43047 10.5117 4.8258Z"
                      fill="#444790"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5117 8.1742L6.96261 4.03248C6.90541 3.96576 6.83444 3.9122 6.75459 3.87548C6.67474 3.83876 6.58789 3.81975 6.5 3.81975C6.41211 3.81975 6.32526 3.83876 6.2454 3.87548C6.16555 3.9122 6.09459 3.96576 6.03738 4.03248L2.48828 8.1742C2.14957 8.56953 2.43039 9.18018 2.9509 9.18018L10.0501 9.18018C10.5706 9.18018 10.8514 8.56953 10.5117 8.1742Z"
                      fill="#444790"
                    />
                  </svg>
                )}
              </span>
            </div>
            <div className="_filter">
              <span className="_label">visibility</span>
            </div>
            <div className="_filter">
              <span className="_label">action</span>
            </div>
          </div>
          {/* {ticketsData.map((ticket, index) => {
            <TicketRow data={ticket} key={index} />;
          })} */}
        </div>
      </section>
    </main>
  );
}
