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

  console.log(ticketsDate);

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
                          <p className="text-start">{el.price.toFixed(1)} €</p>
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
                          <p className="text-start">{(el.price * el.orderQty).toFixed(1)} €</p>
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
                <button id="dscnt_btn">discount</button>
                <button>validate</button>
              </div>
              <div className="cart_pyt">
                <div className="payment_btn">
                  <p>payment option :</p>
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
