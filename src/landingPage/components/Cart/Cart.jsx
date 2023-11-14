import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import MobileCart from "./mobileViewCart/MobileCart";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementCartItem,
  incrementCartItem,
  removeItemsFromCart,
} from "../../../redux/actions/cartAction";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { initialCartEvent, initialCartItems } = useSelector(
    (state) => state.cart
  );

  const [cartTickets, setCartTickets] = useState([]);
  const [cartEvent, setCartEvent] = useState({});
  const [ticketsDate, setTicketsDate] = useState({});

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem("cartTickets"));
    const event = JSON.parse(localStorage.getItem("cartEvent"));
    const ticketsDate = JSON.parse(localStorage.getItem("ticketsDate"));
    if (tickets) {
      setCartTickets(tickets);
    }
    if (event) {
      setCartEvent(event);
    }
    if (ticketsDate) {
      setTicketsDate(ticketsDate);
    }
  }, []);

  const handleDeleteItem = (index) => {
    dispatch(removeItemsFromCart(index));
  };

  function formatTimeToAmPm(timeString) {
    if (!timeString) {
      return;
    }
    const [hours, minutes] = timeString.split(":");
    let period = "am";

    let hoursNum = parseInt(hours);
    if (hoursNum >= 12) {
      if (hoursNum > 12) {
        hoursNum -= 12;
      }
      period = "pm";
    } else if (hoursNum === 0) {
      hoursNum = 12; // 0:00 (midnight) is 12:00 am
    }

    if (minutes === "00") {
      return `${hoursNum}${period}`;
    } else {
      return `${hoursNum}:${minutes}${period}`;
    }
  }

  function formatDateFull(inputDate) {
    if (!inputDate) {
      return;
    }
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(inputDate);
    const dd = date.getUTCDate();
    const mm = months[date.getUTCMonth()];
    const yyyy = date.getUTCFullYear();

    const formattedDate = `${dd} ${mm}, ${yyyy}`;

    return formattedDate;
  }

  const getTotalPrice = (items) => {
    // Iterate through the items and calculate the total price
    let totalPrice = 0;
    for (const item of items) {
      totalPrice += item.orderQty * item.price;
    }
    return totalPrice.toFixed(1);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleIncrement = (index) => {
    dispatch(incrementCartItem(index));
  };

  const handleDecrement = (index) => {
    dispatch(decrementCartItem(index));
  };

  return (
    <>
      <div className="cart_container">
        {initialCartItems.length === 0 ? (
          <p id="empty-cart">your cart is empty</p>
        ) : (
          <div className="cart_inner_box">
            <div className="return_box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5458 0.219664C14.6865 0.0790127 14.8773 -2.97165e-06 15.0762 -3.27019e-08C15.2751 2.90625e-06 15.4659 0.0790242 15.6065 0.21968C15.7472 0.360336 15.8262 0.551105 15.8262 0.750019C15.8262 0.948934 15.7471 1.1397 15.6065 1.28035L8.88684 8.00001L15.6065 14.7197C15.7471 14.8603 15.8262 15.0511 15.8262 15.25C15.8262 15.4489 15.7472 15.6397 15.6065 15.7803C15.4659 15.921 15.2751 16 15.0762 16C14.8773 16 14.6865 15.921 14.5458 15.7804L7.29584 8.53035C7.22619 8.46071 7.17094 8.37803 7.13325 8.28703C7.09555 8.19603 7.07615 8.0985 7.07615 8.00001C7.07615 7.90151 7.09555 7.80398 7.13325 7.71299C7.17094 7.62199 7.22619 7.53931 7.29584 7.46966L14.5458 0.219664ZM8.70465 14.7197L1.98499 8.00001L8.70465 1.28035C8.8453 1.1397 8.92433 0.948934 8.92433 0.750019C8.92433 0.551104 8.84532 0.360336 8.70467 0.21968C8.56401 0.0790239 8.37325 2.62081e-06 8.17433 -3.20704e-07C7.97542 -3.26222e-06 7.78465 0.0790124 7.64399 0.219664L0.393994 7.46966C0.324346 7.53931 0.269097 7.62199 0.231404 7.71299C0.19371 7.80398 0.17431 7.90151 0.17431 8.00001C0.17431 8.0985 0.19371 8.19603 0.231404 8.28703C0.269097 8.37803 0.324346 8.46071 0.393994 8.53035L7.64399 15.7804C7.78465 15.921 7.97542 16 8.17433 16C8.37325 16 8.56401 15.921 8.70466 15.7803C8.84532 15.6397 8.92433 15.4489 8.92433 15.25C8.92433 15.0511 8.8453 14.8603 8.70465 14.7197Z"
                  fill="#1F2349"
                />
              </svg>
              <p onClick={() => navigate("/")}>back to event</p>
            </div>
            <div className="mobile-cart">
              <MobileCart
                cartTickets={cartTickets}
                cartEvent={cartEvent}
                handleDeleteItem={handleDeleteItem}
                formatTimeToAmPm={formatTimeToAmPm}
                formatDateFull={formatDateFull}
                getTotalPrice={getTotalPrice}
                handleDecrement={handleDecrement}
                handleIncrement={handleIncrement}
              />
            </div>
            <div className="cart-tbl-container">
              <table className="table cart-tbl table-responsive">
                <thead>
                  <tr className="_tbl_head">
                    <th>event</th>
                    <th>ticket</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th>total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {initialCartItems &&
                    initialCartItems.map((el, i) => (
                      <tr>
                        <td>
                          <div className="event-img-date col d-flex align-items-center gap-4">
                            <div className="event-pic">
                              <img src={initialCartEvent.banner} alt="" />
                            </div>
                            <div className="text-start w-100 event-name ">
                              <p>{initialCartEvent.eventName}</p>
                              <div className="event-date d-flex align-items-center justify gap-2 m-0">
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 11 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_473_10407)">
                                    <path
                                      d="M3.80558 6.10004C3.80558 6.243 3.68862 6.35993 3.54569 6.35993H2.24622C2.10329 6.35993 1.98633 6.24297 1.98633 6.10004V5.23145C1.98633 5.08849 2.10329 4.97156 2.24622 4.97156H3.54569C3.68865 4.97156 3.80558 5.08852 3.80558 5.23145V6.10004Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M3.80558 8.38239C3.80558 8.52535 3.68862 8.64228 3.54569 8.64228H2.24622C2.10329 8.64228 1.98633 8.52532 1.98633 8.38239V7.5138C1.98633 7.37084 2.10329 7.25391 2.24622 7.25391H3.54569C3.68865 7.25391 3.80558 7.37087 3.80558 7.5138V8.38239Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M6.28217 6.10004C6.28217 6.243 6.16521 6.35993 6.02229 6.35993H4.72278C4.57983 6.35993 4.46289 6.24297 4.46289 6.10004V5.23145C4.46289 5.08849 4.57986 4.97156 4.72278 4.97156H6.02229C6.16524 4.97156 6.28217 5.08852 6.28217 5.23145V6.10004Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M6.28217 8.38239C6.28217 8.52535 6.16521 8.64228 6.02229 8.64228H4.72278C4.57983 8.64228 4.46289 8.52532 4.46289 8.38239V7.5138C4.46289 7.37084 4.57986 7.25391 4.72278 7.25391H6.02229C6.16524 7.25391 6.28217 7.37087 6.28217 7.5138V8.38239Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M8.72749 6.10004C8.72749 6.243 8.61052 6.35993 8.4676 6.35993H7.16809C7.02514 6.35993 6.9082 6.24297 6.9082 6.10004V5.23145C6.9082 5.08849 7.02517 4.97156 7.16809 4.97156H8.4676C8.61055 4.97156 8.72749 5.08852 8.72749 5.23145V6.10004Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M8.72749 8.38239C8.72749 8.52535 8.61052 8.64228 8.4676 8.64228H7.16809C7.02514 8.64228 6.9082 8.52532 6.9082 8.38239V7.5138C6.9082 7.37084 7.02517 7.25391 7.16809 7.25391H8.4676C8.61055 7.25391 8.72749 7.37087 8.72749 7.5138V8.38239Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M2.63582 3.0278C2.48055 3.0278 2.35352 2.90077 2.35352 2.74547V1.21763C2.35352 1.06233 2.48055 0.935303 2.63582 0.935303H3.22312C3.37839 0.935303 3.50545 1.06233 3.50545 1.21763V2.74547C3.50545 2.90074 3.37842 3.0278 3.22312 3.0278H2.63582Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M7.52254 3.0278C7.36727 3.0278 7.24023 2.90077 7.24023 2.74547V1.21763C7.24023 1.06233 7.36727 0.935303 7.52254 0.935303H8.10984C8.26511 0.935303 8.39217 1.06233 8.39217 1.21763V2.74547C8.39217 2.90074 8.26514 3.0278 8.10984 3.0278H7.52254Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M9.87735 2.08984C9.87735 2.08984 9.41122 2.08984 9.05554 2.08984C9.00858 2.08984 8.9217 2.08984 8.9217 2.1981V2.68136C8.9217 3.14276 8.66614 3.51814 8.08492 3.51814H7.54423C6.99312 3.51814 6.70745 3.14276 6.70745 2.68136L6.70748 2.22334C6.70748 2.1368 6.64702 2.08984 6.57491 2.08984C5.88642 2.08984 4.90091 2.08984 4.18799 2.08984C4.13503 2.08984 4.03436 2.08984 4.03436 2.22694V2.68136C4.03436 3.14276 3.8043 3.51814 3.19758 3.51814H2.65689C1.98505 3.51814 1.82011 3.14276 1.82011 2.68136V2.24497C1.82011 2.12238 1.70975 2.08984 1.64967 2.08984C1.29814 2.08984 0.864493 2.08984 0.864493 2.08984C0.714502 2.08984 0.591797 2.21255 0.591797 2.56457V9.85122C0.591797 9.79918 0.714502 9.92189 0.864493 9.92189H9.87732C10.0273 9.92189 10.15 9.79918 10.15 9.85122V2.56457C10.15 2.21255 10.0273 2.08984 9.87735 2.08984ZM9.54405 9.0432C9.54405 9.19319 9.42134 9.31589 9.27135 9.31589H1.47049C1.3205 9.31589 1.19779 9.19319 1.19779 9.0432V4.52804C1.19779 4.37805 1.3205 4.25535 1.47049 4.25535H9.27135C9.42134 4.25535 9.54405 4.37805 9.54405 4.52804V9.0432Z"
                                      fill="#64C3C5"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_473_10407">
                                      <rect
                                        width="9.55822"
                                        height="9.55822"
                                        fill="white"
                                        transform="translate(0.59375 0.649292)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <p className="mb-0">
                                  {/* {formatDateFull(initialCartEvent.startDate)} */}
                                  {`${ticketsDate.day} ${ticketsDate.month}, 2024`}
                                </p>
                              </div>
                              <div className="event-date align-items-center d-flex gap-2">
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 13 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_473_10359)">
                                    <path
                                      d="M10.878 2.0391C9.67448 0.83556 8.07411 0.172729 6.37215 0.172729C4.67018 0.172729 3.06981 0.83556 1.86627 2.0391C0.662735 3.24264 0 4.84278 0 6.54488C0 8.24697 0.662735 9.84711 1.86627 11.0507C3.06981 12.2542 4.67018 12.917 6.37215 12.917C8.07411 12.917 9.67448 12.2542 10.878 11.0507C12.0816 9.84711 12.7443 8.24697 12.7443 6.54488C12.7443 4.84278 12.0816 3.24264 10.878 2.0391ZM6.37215 11.8459C3.44924 11.8459 1.07103 9.46787 1.07103 6.54488C1.07103 3.62188 3.44924 1.24389 6.37215 1.24389C9.29505 1.24389 11.6733 3.62188 11.6733 6.54488C11.6733 9.46787 9.29505 11.8459 6.37215 11.8459Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M4.42207 9.92858C4.21667 9.81006 3.95378 9.88025 3.83485 10.0857C3.71636 10.2913 3.78687 10.5543 3.99227 10.6728C4.05988 10.712 4.13392 10.7306 4.20689 10.7306C4.35529 10.7306 4.49962 10.6535 4.57934 10.5157C4.69796 10.31 4.62767 10.0472 4.42207 9.92858Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M4.19773 3.22372C4.27095 3.22372 4.34531 3.20505 4.41324 3.16567C4.61833 3.04651 4.68829 2.78334 4.56907 2.57822C4.44963 2.37285 4.18681 2.30317 3.98162 2.4223C3.77625 2.54146 3.7066 2.80434 3.82579 3.00971C3.90554 3.147 4.04952 3.22372 4.19773 3.22372Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M2.39878 4.75474C2.46636 4.79351 2.54018 4.81221 2.61307 4.81221C2.76158 4.81221 2.90623 4.73517 2.98565 4.59706C3.10421 4.39168 3.03364 4.1288 2.82823 4.01025C2.62257 3.89141 2.35972 3.96195 2.24113 4.16758C2.12255 4.3733 2.19315 4.6359 2.39878 4.75474Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M6.36727 2.64051C6.36759 2.64051 6.36759 2.64051 6.36781 2.64051C6.60524 2.63991 6.79726 2.44728 6.79707 2.20988C6.7964 1.97246 6.60387 1.78043 6.36641 1.78101C6.12895 1.78129 5.93696 1.97396 5.9375 2.21132C5.93779 2.44846 6.1301 2.64051 6.36727 2.64051Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M2.40376 8.34425C2.19835 8.46309 2.12838 8.72594 2.24761 8.93141C2.32735 9.06886 2.47168 9.14571 2.6199 9.14571C2.69308 9.14571 2.76713 9.12704 2.83506 9.08762C3.04043 8.96882 3.11033 8.70558 2.99117 8.50046C2.87205 8.29509 2.60913 8.22506 2.40376 8.34425Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M2.46885 6.54944C2.46853 6.31198 2.2759 6.11998 2.03854 6.12024C1.80115 6.12053 1.60909 6.31316 1.60938 6.55026C1.60969 6.78769 1.80201 6.97971 2.03914 6.97971H2.03937C2.27686 6.97943 2.46917 6.78677 2.46885 6.54944Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M6.37476 10.4493C6.13772 10.4497 5.94531 10.642 5.94531 10.8794C5.94563 11.1168 6.13804 11.3091 6.3754 11.3088C6.61276 11.3088 6.80517 11.1162 6.80485 10.8788C6.80488 10.6417 6.61232 10.4493 6.37476 10.4493Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M10.3422 8.33979C10.1369 8.22098 9.87403 8.29117 9.75507 8.49658C9.63626 8.70195 9.70648 8.96483 9.91185 9.08371C9.97978 9.12286 10.0538 9.14147 10.1267 9.14147C10.2752 9.14147 10.4195 9.06475 10.499 8.92689C10.6179 8.72151 10.5476 8.4586 10.3422 8.33979Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M10.7062 6.10498C10.4688 6.10559 10.2767 6.29853 10.2773 6.5359C10.2773 6.53829 10.2773 6.54068 10.2773 6.54272C10.2773 6.54364 10.2773 6.54421 10.2773 6.54482C10.2773 6.78221 10.4696 6.97456 10.707 6.97456C10.9445 6.97456 11.1368 6.78221 11.1368 6.54482C11.1368 6.54332 11.1368 6.54154 11.1368 6.53978C11.1368 6.538 11.1368 6.5359 11.1368 6.53386C11.1362 6.29646 10.9435 6.10469 10.7062 6.10498Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M8.31677 3.1587C8.38428 3.19783 8.45813 3.21618 8.531 3.21618C8.6795 3.21618 8.82415 3.13914 8.90358 3.00103C9.02216 2.7953 8.95159 2.53245 8.74593 2.4139C8.54021 2.29563 8.27729 2.36617 8.15906 2.57189C8.04057 2.77756 8.11107 3.04047 8.31677 3.1587Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M8.3258 9.92648C8.12042 10.0453 8.05023 10.3081 8.16936 10.5136C8.24908 10.6511 8.39334 10.7281 8.54162 10.7281C8.61484 10.7281 8.68863 10.7095 8.75646 10.6701C8.96186 10.5513 9.03183 10.2884 8.91302 10.0829C8.79408 9.87751 8.53117 9.80728 8.3258 9.92648Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M10.1216 4.79951C10.1951 4.79951 10.2692 4.78052 10.3373 4.74111C10.5425 4.62166 10.6121 4.35878 10.4927 4.15369C10.3735 3.94829 10.1103 3.87892 9.90524 3.99808C9.70009 4.11721 9.63044 4.38038 9.74963 4.5855C9.82938 4.72272 9.97339 4.79951 10.1216 4.79951Z"
                                      fill="#64C3C5"
                                    />
                                    <path
                                      d="M9.07187 6.84621L6.81511 6.69229L6.58985 3.38693C6.58208 3.27322 6.48752 3.18494 6.37349 3.18494C6.25949 3.18494 6.16505 3.27322 6.15722 3.38693L5.93594 6.63233L5.57474 6.6077C5.52657 6.60439 5.47919 6.62124 5.44392 6.65422C5.40871 6.68716 5.38867 6.7333 5.38867 6.7816V7.25862C5.38867 7.30695 5.40871 7.35302 5.44392 7.38596C5.47629 7.4162 5.51889 7.43293 5.56292 7.43293C5.56681 7.43293 5.57076 7.4328 5.57474 7.43254L5.88283 7.41152L5.86059 7.73678C5.85658 7.79671 5.87751 7.85559 5.91848 7.89943C5.95946 7.94334 6.01684 7.96825 6.07693 7.96825H6.67011C6.67037 7.96825 6.67065 7.96825 6.67078 7.96825C6.79045 7.96825 6.8875 7.8712 6.8875 7.75147C6.8875 7.74093 6.85975 7.34477 6.85975 7.34477L9.07196 7.19394C9.16344 7.1877 9.23449 7.11171 9.23449 7.02004C9.23429 6.92844 9.16334 6.85246 9.07187 6.84621Z"
                                      fill="#64C3C5"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_473_10359">
                                      <rect
                                        width="12.7443"
                                        height="12.7443"
                                        fill="white"
                                        transform="translate(0 0.172729)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <p className="mb-0">
                                  doors open at{" "}
                                  {/* {formatTimeToAmPm(initialCartEvent.startTime)} */}
                                  11am
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="event-img-date col mt-2 gap-4">
                            <div className="w-100 event-name">
                              <p className="text-start">{el.name}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="event-img-date col mt-2">
                            <div className=" w-100 event-name">
                              <p className="text-start">
                                {el.price.toFixed(1)} €
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="event-img-date col">
                            <div className=" w-100 event-name ">
                              <span class="cart-input-wrapper d-flex justify-content-center align-items-center">
                                <button onClick={() => handleDecrement(i)}>
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={el.orderQty}
                                  id="quantity"
                                />
                                <button onClick={() => handleIncrement(i)}>
                                  +
                                </button>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="event-img-date col mt-2">
                            <div className="w-100 event-name">
                              <p className="text-start">
                                {(el.price * el.orderQty).toFixed(1)} €
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="event-img-date col mt-1">
                            <div
                              className="cart-delete-icon border d-flex align-items-center justify-content-center"
                              onClick={() => handleDeleteItem(i)}
                            >
                              <svg
                                width="23"
                                height="23"
                                viewBox="0 0 23 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.00276 17.035C6.71617 17.3217 6.25152 17.3217 5.96494 17.035C5.67835 16.7485 5.67835 16.2838 5.96494 15.9973L10.4622 11.5L5.96494 7.00276C5.67835 6.71617 5.67835 6.25152 5.96494 5.96494C6.25152 5.67835 6.71617 5.67835 7.00276 5.96494L11.5 10.4622L15.9973 5.96494C16.2838 5.67835 16.7485 5.67835 17.035 5.96494C17.3217 6.25152 17.3217 6.71617 17.035 7.00276L12.5378 11.5L17.035 15.9973C17.3217 16.2838 17.3217 16.7485 17.035 17.035C16.7485 17.3217 16.2838 17.3217 15.9973 17.035L11.5 12.5378L7.00276 17.035Z"
                                  fill="black"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="cart_btns mt-2">
              <div className="validation_btns">
                <button id="dscnt_btn" disabled>
                  discount
                </button>
                <button disabled>validate</button>
              </div>
              <div className="cart_pyt">
                <div className="payment_btn">
                  <p>payment option :</p>
                  <div className="pyt-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4.592 2v20H0V2h4.592zm11.46 0c0 4.194-1.583 8.105-4.415 11.068l-.278.283L17.702 22h-5.668l-6.893-9.4l1.779-1.332c2.858-2.14 4.535-5.378 4.637-8.924L11.562 2h4.49zM21.5 17a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      id="paypal"
                    >
                      <g transform="translate(94.295 -288.088)">
                        <rect
                          width="63.214"
                          height="40.714"
                          x="-73.879"
                          y="317.729"
                          fill="#f9f9f9"
                          fill-rule="evenodd"
                          stroke="#000"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width=".8"
                          rx="3.599"
                          ry="3.599"
                        ></rect>
                        <g
                          fill="#005bac"
                          font-family="Segoe WP Black"
                          font-size="16.09"
                          font-weight="400"
                          letter-spacing="0"
                          word-spacing="0"
                        >
                          <path
                            d="M-57.956 335.807a5.249 5.249 0 0 1-.863 1.58 5.772 5.772 0 0 1-1.366 1.245c-.53.348-1.122.619-1.777.813a7.39 7.39 0 0 1-2.106.29h-1.037l-1.231 3.622h-3.394l3.829-11.266h4.62c.738 0 1.369.065 1.893.196s.93.345 1.22.64c.29.297.455.68.497 1.152.041.471-.054 1.047-.285 1.728zm-3.63.118c.09-.267.124-.49.1-.668a.716.716 0 0 0-.196-.428.927.927 0 0 0-.424-.232 2.251 2.251 0 0 0-.585-.07h-.644l-.945 2.78h.762c.272 0 .513-.033.722-.101a1.724 1.724 0 0 0 .946-.727c.108-.17.196-.355.263-.554zm6.571 7.432.417-1.225h-.032c-.402.445-.85.793-1.34 1.045a3.448 3.448 0 0 1-1.594.377c-.409 0-.743-.064-1.003-.193a1.29 1.29 0 0 1-.578-.53 1.568 1.568 0 0 1-.184-.79c.003-.3.063-.624.18-.97.1-.293.24-.587.418-.88a3.36 3.36 0 0 1 .714-.817 4.27 4.27 0 0 1 1.11-.656c.443-.186.98-.318 1.608-.397l2.084-.26a.646.646 0 0 0 .027-.368.555.555 0 0 0-.175-.283.893.893 0 0 0-.35-.18 1.819 1.819 0 0 0-.502-.064c-.267 0-.54.023-.82.067-.28.045-.554.103-.822.177a9.377 9.377 0 0 0-.776.247c-.248.092-.48.185-.695.28l.74-2.177c.221-.084.48-.165.777-.244.297-.078.605-.146.926-.204.32-.058.64-.105.956-.141a7.63 7.63 0 0 1 .875-.055c.733 0 1.321.08 1.764.24.444.159.763.397.96.714.195.317.278.713.248 1.187-.03.474-.153 1.028-.368 1.661l-1.508 4.44zm.068-3.527c-.271.042-.506.127-.704.255a1.01 1.01 0 0 0-.462.805c-.001.09.017.17.055.244.038.073.1.132.187.177a.774.774 0 0 0 .35.066c.168 0 .335-.032.501-.098.167-.065.323-.16.47-.283a2.318 2.318 0 0 0 .684-1.017l.103-.306zm10.045 3.755c-.32.461-.661.905-1.026 1.332a7.927 7.927 0 0 1-1.191 1.135c-.43.33-.896.593-1.4.79a4.533 4.533 0 0 1-1.66.294 7.021 7.021 0 0 1-.881-.067 5.144 5.144 0 0 1-.512-.098 3.026 3.026 0 0 1-.477-.157l.857-2.522a.872.872 0 0 0 .239.165c.096.047.199.09.307.126a2.057 2.057 0 0 0 .638.11 1.9 1.9 0 0 0 .827-.18 1.81 1.81 0 0 0 .665-.559l.473-.628-.64-8.014h3.701l-.344 3.881c-.01.12-.02.25-.033.385a13.705 13.705 0 0 1-.094.774c-.02.118-.04.219-.063.303h.03c.09-.184.205-.4.347-.649.142-.248.298-.514.467-.797l2.29-3.897h3.253z"
                            font-style="oblique"
                            font-weight="800"
                          ></path>
                          <path
                            fill="#0097d3"
                            d="M-29.138 335.807a5.249 5.249 0 0 1-.863 1.58 5.772 5.772 0 0 1-1.366 1.245c-.53.348-1.122.619-1.777.813a7.39 7.39 0 0 1-2.106.29h-1.037l-1.231 3.622h-3.394l3.829-11.266h4.62c.738 0 1.369.065 1.893.196s.93.345 1.22.64c.29.297.455.68.497 1.152.041.471-.054 1.047-.285 1.728zm-3.63.118c.09-.267.124-.49.1-.668a.716.716 0 0 0-.196-.428.927.927 0 0 0-.424-.232 2.251 2.251 0 0 0-.584-.07h-.645l-.945 2.78h.762c.272 0 .513-.033.722-.101a1.724 1.724 0 0 0 .946-.727c.108-.17.196-.355.263-.554zm6.571 7.432.417-1.225h-.032c-.402.445-.85.793-1.34 1.045a3.448 3.448 0 0 1-1.594.377c-.409 0-.743-.064-1.003-.193a1.29 1.29 0 0 1-.578-.53 1.568 1.568 0 0 1-.184-.79c.003-.3.063-.624.18-.97.1-.293.24-.587.418-.88a3.36 3.36 0 0 1 .714-.817 4.27 4.27 0 0 1 1.11-.656c.443-.186.98-.318 1.608-.397l2.084-.26a.646.646 0 0 0 .027-.368.554.554 0 0 0-.174-.283.893.893 0 0 0-.352-.18 1.819 1.819 0 0 0-.5-.064c-.268 0-.541.023-.821.067-.28.045-.554.103-.822.177a9.377 9.377 0 0 0-.776.247c-.248.092-.48.185-.695.28l.74-2.177c.221-.084.48-.165.777-.244.297-.078.605-.146.926-.204.32-.058.64-.105.956-.141a7.63 7.63 0 0 1 .875-.055c.733 0 1.321.08 1.764.24.444.159.763.397.96.714.196.317.278.713.248 1.187-.03.474-.152 1.028-.368 1.661l-1.508 4.44zm.068-3.527c-.271.042-.505.127-.703.255a1.01 1.01 0 0 0-.463.805c-.001.09.017.17.055.244.038.073.1.132.187.177a.774.774 0 0 0 .35.066c.168 0 .335-.032.502-.098.166-.065.322-.16.469-.283a2.318 2.318 0 0 0 .684-1.017l.104-.306zm4.49 3.527 4.047-11.91h3.347l-4.048 11.91z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="60"
                      viewBox="0 0 30 30"
                      id="apple-pay"
                    >
                      <g fill="#303C42" fill-rule="evenodd" clip-rule="evenodd">
                        <path d="M15.15 12.5H13v5.49h.855v-1.873h1.269c1.079 0 1.839-.742 1.839-1.813S16.21 12.5 15.15 12.5zm-.225 2.9h-1.07v-2.183h1.07c.743 0 1.166.405 1.166 1.096 0 .69-.432 1.088-1.166 1.088zM18.983 13.804c-.924 0-1.615.535-1.64 1.269h.768c.069-.354.397-.587.846-.587.544 0 .863.259.863.733v.32l-1.114.06c-1.018.07-1.58.484-1.58 1.209 0 .734.57 1.226 1.408 1.217.561 0 1.079-.285 1.303-.734h.018v.691h.785V15.15c0-.811-.647-1.346-1.657-1.346zm.837 2.633c0 .544-.466.932-1.07.94-.475 0-.786-.224-.786-.578 0-.371.294-.578.855-.613l1.001-.069v.32zM23.075 17.222h-.017l-1.062-3.375h-.89l1.503 4.144-.06.215c-.139.44-.363.605-.752.605-.069 0-.198 0-.259-.017v.673c.07.009.268.026.328.017.846 0 1.235-.32 1.589-1.312L25 13.847h-.863l-1.062 3.375z"></path>
                        <path d="M28 4H2C.897 4 0 4.897 0 6v18c0 1.103.897 2 2 2h26c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm1 20c0 .551-.449 1-1 1H2c-.551 0-1-.449-1-1V6c0-.551.449-1 1-1h26c.551 0 1 .449 1 1v18z"></path>
                        <path d="M10.44 14.25c-.01-1.011.827-1.499.865-1.522-.47-.689-1.202-.783-1.463-.794-.623-.062-1.216.367-1.532.367-.315 0-.804-.357-1.32-.347-.68.01-1.305.394-1.655 1.002-.705 1.225-.18 3.038.507 4.031.336.485.737 1.032 1.263 1.012.507-.02.698-.327 1.31-.327.613 0 .785.327 1.321.317.545-.01.891-.495 1.225-.982.385-.564.544-1.11.553-1.139-.012-.004-1.063-.407-1.074-1.618zM9.85 10c-.403.016-.89.269-1.179.606-.259.3-.486.779-.424 1.238.449.035.907-.228 1.187-.566.28-.339.467-.81.416-1.278z"></path>
                      </g>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="58"
                      height="58"
                      viewBox="0 0 256 199"
                    >
                      <path d="M46.54 198.011V184.84c0-5.05-3.074-8.342-8.343-8.342c-2.634 0-5.488.878-7.464 3.732c-1.536-2.415-3.731-3.732-7.024-3.732c-2.196 0-4.39.658-6.147 3.073v-2.634h-4.61v21.074h4.61v-11.635c0-3.731 1.976-5.488 5.05-5.488c3.072 0 4.61 1.976 4.61 5.488v11.635h4.61v-11.635c0-3.731 2.194-5.488 5.048-5.488c3.074 0 4.61 1.976 4.61 5.488v11.635h5.05Zm68.271-21.074h-7.463v-6.366h-4.61v6.366h-4.171v4.17h4.17v9.66c0 4.83 1.976 7.683 7.245 7.683c1.976 0 4.17-.658 5.708-1.536l-1.318-3.952c-1.317.878-2.853 1.098-3.951 1.098c-2.195 0-3.073-1.317-3.073-3.513v-9.44h7.463v-4.17Zm39.076-.44c-2.634 0-4.39 1.318-5.488 3.074v-2.634h-4.61v21.074h4.61v-11.854c0-3.512 1.536-5.488 4.39-5.488c.878 0 1.976.22 2.854.439l1.317-4.39c-.878-.22-2.195-.22-3.073-.22Zm-59.052 2.196c-2.196-1.537-5.269-2.195-8.562-2.195c-5.268 0-8.78 2.634-8.78 6.805c0 3.513 2.634 5.488 7.244 6.147l2.195.22c2.415.438 3.732 1.097 3.732 2.195c0 1.536-1.756 2.634-4.83 2.634c-3.073 0-5.488-1.098-7.025-2.195l-2.195 3.512c2.415 1.756 5.708 2.634 9 2.634c6.147 0 9.66-2.853 9.66-6.805c0-3.732-2.854-5.708-7.245-6.366l-2.195-.22c-1.976-.22-3.512-.658-3.512-1.975c0-1.537 1.536-2.415 3.951-2.415c2.635 0 5.269 1.097 6.586 1.756l1.976-3.732Zm122.495-2.195c-2.635 0-4.391 1.317-5.489 3.073v-2.634h-4.61v21.074h4.61v-11.854c0-3.512 1.537-5.488 4.39-5.488c.879 0 1.977.22 2.855.439l1.317-4.39c-.878-.22-2.195-.22-3.073-.22Zm-58.833 10.976c0 6.366 4.39 10.976 11.196 10.976c3.073 0 5.268-.658 7.463-2.414l-2.195-3.732c-1.756 1.317-3.512 1.975-5.488 1.975c-3.732 0-6.366-2.634-6.366-6.805c0-3.951 2.634-6.586 6.366-6.805c1.976 0 3.732.658 5.488 1.976l2.195-3.732c-2.195-1.757-4.39-2.415-7.463-2.415c-6.806 0-11.196 4.61-11.196 10.976Zm42.588 0v-10.537h-4.61v2.634c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976c0 6.366 4.61 10.976 10.537 10.976c3.073 0 5.269-1.097 6.586-3.073v2.634h4.61v-10.537Zm-16.904 0c0-3.732 2.415-6.805 6.366-6.805c3.732 0 6.367 2.854 6.367 6.805c0 3.732-2.635 6.805-6.367 6.805c-3.951-.22-6.366-3.073-6.366-6.805Zm-55.1-10.976c-6.147 0-10.538 4.39-10.538 10.976c0 6.586 4.39 10.976 10.757 10.976c3.073 0 6.147-.878 8.562-2.853l-2.196-3.293c-1.756 1.317-3.951 2.195-6.146 2.195c-2.854 0-5.708-1.317-6.367-5.05h15.587v-1.755c.22-6.806-3.732-11.196-9.66-11.196Zm0 3.951c2.853 0 4.83 1.757 5.268 5.05h-10.976c.439-2.854 2.415-5.05 5.708-5.05Zm114.372 7.025v-18.879h-4.61v10.976c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976c0 6.366 4.61 10.976 10.537 10.976c3.074 0 5.269-1.097 6.586-3.073v2.634h4.61v-10.537Zm-16.903 0c0-3.732 2.414-6.805 6.366-6.805c3.732 0 6.366 2.854 6.366 6.805c0 3.732-2.634 6.805-6.366 6.805c-3.952-.22-6.366-3.073-6.366-6.805Zm-154.107 0v-10.537h-4.61v2.634c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976c0 6.366 4.61 10.976 10.537 10.976c3.074 0 5.269-1.097 6.586-3.073v2.634h4.61v-10.537Zm-17.123 0c0-3.732 2.415-6.805 6.366-6.805c3.732 0 6.367 2.854 6.367 6.805c0 3.732-2.635 6.805-6.367 6.805c-3.951-.22-6.366-3.073-6.366-6.805Z" />
                      <path
                        fill="#FF5F00"
                        d="M93.298 16.903h69.15v124.251h-69.15z"
                      />
                      <path
                        fill="#EB001B"
                        d="M97.689 79.029c0-25.245 11.854-47.637 30.074-62.126C114.373 6.366 97.47 0 79.03 0C35.343 0 0 35.343 0 79.029c0 43.685 35.343 79.029 79.029 79.029c18.44 0 35.343-6.366 48.734-16.904c-18.22-14.269-30.074-36.88-30.074-62.125Z"
                      />
                      <path
                        fill="#F79E1B"
                        d="M255.746 79.029c0 43.685-35.343 79.029-79.029 79.029c-18.44 0-35.343-6.366-48.734-16.904c18.44-14.488 30.075-36.88 30.075-62.125c0-25.245-11.855-47.637-30.075-62.126C141.373 6.366 158.277 0 176.717 0c43.686 0 79.03 35.563 79.03 79.029Z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="58"
                      height="58"
                      viewBox="0 0 256 83"
                    >
                      <defs>
                        <linearGradient
                          id="logosVisa0"
                          x1="45.974%"
                          x2="54.877%"
                          y1="-2.006%"
                          y2="100%"
                        >
                          <stop offset="0%" stop-color="#222357" />
                          <stop offset="100%" stop-color="#254AA5" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#logosVisa0)"
                        d="M132.397 56.24c-.146-11.516 10.263-17.942 18.104-21.763c8.056-3.92 10.762-6.434 10.73-9.94c-.06-5.365-6.426-7.733-12.383-7.825c-10.393-.161-16.436 2.806-21.24 5.05l-3.744-17.519c4.82-2.221 13.745-4.158 23-4.243c21.725 0 35.938 10.724 36.015 27.351c.085 21.102-29.188 22.27-28.988 31.702c.069 2.86 2.798 5.912 8.778 6.688c2.96.392 11.131.692 20.395-3.574l3.636 16.95c-4.982 1.814-11.385 3.551-19.357 3.551c-20.448 0-34.83-10.87-34.946-26.428m89.241 24.968c-3.967 0-7.31-2.314-8.802-5.865L181.803 1.245h21.709l4.32 11.939h26.528l2.506-11.939H256l-16.697 79.963h-17.665m3.037-21.601l6.265-30.027h-17.158l10.893 30.027m-118.599 21.6L88.964 1.246h20.687l17.104 79.963h-20.679m-30.603 0L53.941 26.782l-8.71 46.277c-1.022 5.166-5.058 8.149-9.54 8.149H.493L0 78.886c7.226-1.568 15.436-4.097 20.41-6.803c3.044-1.653 3.912-3.098 4.912-7.026L41.819 1.245H63.68l33.516 79.963H75.473"
                        transform="matrix(1 0 0 -1 0 82.668)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div id="checkout_btn">
                <p className="mb-0">
                  subtotal : <span>{getTotalPrice(initialCartItems)} €</span>
                </p>
                <button onClick={handleCheckout}>Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}