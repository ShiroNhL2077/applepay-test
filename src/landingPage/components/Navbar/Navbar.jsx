import React, { useEffect, useRef } from "react";
import { useState } from "react";

import "./Navbar.css";
import Login from "../Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/actions/userAction";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.user);
  const { initialCartItems } = useSelector((state) => state.cart);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [isDropdownOpen]);

  return (
    <>
      <header className="header ">
        <div className="header_innerbox">
          <a href="/" className="logo">
            <svg
              width="150"
              height="59"
              viewBox="0 0 171 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44.4958 25.9555H57.8245C58.7259 25.9555 59.4738 26.2779 60.0731 26.9175C60.6725 27.5571 60.9746 28.3552 60.9746 29.3172C60.9746 30.2792 60.6725 31.0087 60.0731 31.6271C59.4738 32.2455 58.7259 32.5574 57.8245 32.5574H44.4958C43.5944 32.5574 42.8465 32.2403 42.2472 31.5954C41.6478 30.9558 41.3457 30.1577 41.3457 29.1957C41.3457 28.2337 41.6429 27.5095 42.2472 26.8858C42.8465 26.2673 43.5944 25.9555 44.4958 25.9555ZM50.5138 18.455C51.4895 18.455 52.287 18.8091 52.9011 19.5069C53.5203 20.2046 53.8274 21.0767 53.8274 22.118V48.8217C53.8274 49.382 53.9314 49.8418 54.1344 50.2013C54.3375 50.5607 54.6198 50.825 54.9765 50.9836C55.3331 51.1421 55.7145 51.2214 56.1305 51.2214C56.5813 51.2214 56.9924 51.1316 57.3688 50.9519C57.7452 50.7721 58.1761 50.6823 58.6615 50.6823C59.1866 50.6823 59.662 50.9413 60.093 51.4593C60.5239 51.9773 60.7418 52.7014 60.7418 53.6212C60.7418 54.7417 60.1722 55.6615 59.0281 56.3803C57.8839 57.0992 56.6555 57.4586 55.343 57.4586C54.5555 57.4586 53.6837 57.3899 52.7278 57.2472C51.7718 57.1045 50.8704 56.7662 50.0284 56.227C49.1864 55.6879 48.483 54.858 47.9184 53.7375C47.3537 52.6169 47.0764 51.0787 47.0764 49.1177V22.1127C47.0764 21.0714 47.4033 20.2046 48.062 19.5016C48.7158 18.8039 49.5331 18.4497 50.5088 18.4497L50.5138 18.455Z"
                fill="#1F2349"
              />
              <path
                d="M66.1998 21.4526C64.9269 21.4526 64.0254 21.2306 63.5004 20.7919C62.9754 20.3532 62.7129 19.5709 62.7129 18.4503V17.3086C62.7129 16.151 63.0051 15.3581 63.5846 14.9405C64.1641 14.5177 65.0557 14.3115 66.2543 14.3115C67.5669 14.3115 68.4832 14.5335 69.0082 14.9722C69.5332 15.411 69.7957 16.1933 69.7957 17.3086V18.4503C69.7957 19.6131 69.5134 20.4007 68.9537 20.8183C68.3891 21.2412 67.4728 21.4473 66.1998 21.4473V21.4526ZM69.6323 53.7962C69.6323 54.8375 69.3153 55.7096 68.6763 56.4073C68.0374 57.1051 67.235 57.4592 66.2593 57.4592C65.2835 57.4592 64.4762 57.1103 63.8422 56.4073C63.2032 55.7096 62.8862 54.8375 62.8862 53.7962V29.0165C62.8862 27.9752 63.2032 27.1084 63.8422 26.4053C64.4762 25.7076 65.2835 25.3535 66.2593 25.3535C67.235 25.3535 68.0374 25.7023 68.6763 26.4053C69.3153 27.1031 69.6323 27.9752 69.6323 29.0165V53.7962Z"
                fill="#1F2349"
              />
              <path
                d="M86.0465 24.7559C88.1813 24.7559 90.0486 24.9937 91.6435 25.4747C93.2334 25.9557 94.4717 26.627 95.3533 27.4833C96.2349 28.3449 96.6758 29.3756 96.6758 30.5755C96.6758 31.3789 96.4529 32.1295 96.0022 32.8272C95.5514 33.5249 94.8976 33.8791 94.0358 33.8791C93.4365 33.8791 92.9412 33.7892 92.5449 33.6095C92.1487 33.4298 91.8069 33.1972 91.5048 32.9171C91.2027 32.6369 90.846 32.3779 90.4349 32.1401C90.0585 31.9022 89.4889 31.7119 88.7212 31.5692C87.9535 31.4265 87.3789 31.3578 87.0074 31.3578C85.0956 31.3578 83.4759 31.7965 82.1435 32.6792C80.8112 33.5619 79.7909 34.7512 79.0776 36.2524C78.3644 37.7536 78.0078 39.482 78.0078 41.443C78.0078 43.404 78.3743 45.0743 79.1024 46.5755C79.8354 48.0766 80.8459 49.2659 82.1386 50.1487C83.4313 51.0261 84.9222 51.4701 86.6112 51.4701C87.5473 51.4701 88.3547 51.412 89.0283 51.2904C89.7019 51.1688 90.2665 50.9891 90.7123 50.7512C91.2373 50.4288 91.7079 50.0905 92.119 49.7311C92.5301 49.3717 93.1492 49.1919 93.9764 49.1919C94.9521 49.1919 95.7 49.5197 96.225 50.1804C96.7501 50.8411 97.0126 51.6498 97.0126 52.6118C97.0126 53.5738 96.4875 54.52 95.4375 55.3393C94.3875 56.1586 93.0105 56.8193 91.3067 57.3214C89.5979 57.8183 87.7553 58.072 85.7692 58.072C82.8073 58.072 80.2416 57.3426 78.0672 55.8837C75.8928 54.4248 74.2137 52.4321 73.0349 49.9108C71.8561 47.3895 71.2617 44.5722 71.2617 41.4536C71.2617 38.1764 71.8908 35.2851 73.1439 32.7849C74.397 30.2848 76.1454 28.3237 78.3743 26.9019C80.6032 25.4853 83.1639 24.7717 86.0515 24.7717L86.0465 24.7559Z"
                fill="#1F2349"
              />
              <path
                d="M101.961 57.4588C100.985 57.4588 100.178 57.11 99.5438 56.407C98.9049 55.7092 98.5879 54.8371 98.5879 53.7958V16.7109C98.5879 15.6696 98.9049 14.8027 99.5438 14.0997C100.178 13.402 100.985 13.0479 101.961 13.0479C102.937 13.0479 103.739 13.402 104.378 14.0997C105.017 14.7974 105.334 15.6696 105.334 16.7109V53.7958C105.334 54.8371 105.017 55.7092 104.378 56.407C103.739 57.1047 102.937 57.4588 101.961 57.4588ZM119.841 25.3584C120.703 25.3584 121.451 25.739 122.09 26.5001C122.729 27.2613 123.046 28.0013 123.046 28.7201C123.046 29.6821 122.595 30.5807 121.699 31.4212L104.774 48.0396L104.492 39.7568L117.37 26.4948C118.083 25.7337 118.905 25.3531 119.846 25.3531L119.841 25.3584ZM120.683 57.4007C119.708 57.4007 118.885 56.999 118.212 56.2008L107.81 44.44L112.927 39.4027L123.046 51.1635C123.759 51.9669 124.116 52.8655 124.116 53.8645C124.116 54.8635 123.73 55.7568 122.962 56.4175C122.194 57.0783 121.436 57.406 120.683 57.406V57.4007Z"
                fill="#1F2349"
              />
              <path
                d="M139.068 58.0561C135.883 58.0561 133.114 57.3478 130.771 55.9259C128.428 54.5093 126.63 52.5747 125.372 50.138C124.114 47.696 123.49 44.9368 123.49 41.8552C123.49 38.2556 124.174 35.1846 125.541 32.6421C126.908 30.105 128.696 28.1545 130.91 26.7908C133.119 25.4324 135.467 24.7505 137.938 24.7505C139.85 24.7505 141.658 25.1681 143.367 26.0085C145.071 26.8489 146.581 28.0012 147.894 29.4601C149.206 30.919 150.247 32.6104 151.014 34.5291C151.782 36.4479 152.163 38.4882 152.163 40.6501C152.129 41.6121 151.772 42.3891 151.094 42.9917C150.415 43.5942 149.632 43.8902 148.731 43.8902H127.255L125.571 37.8909H146.205L144.967 39.0908V37.4733C144.892 36.3104 144.506 35.2744 143.817 34.3494C143.124 33.4297 142.262 32.7003 141.232 32.1611C140.202 31.622 139.102 31.3524 137.943 31.3524C136.784 31.3524 135.769 31.511 134.793 31.8334C133.817 32.1558 132.975 32.695 132.262 33.4509C131.549 34.212 130.989 35.2322 130.578 36.5113C130.167 37.7905 129.959 39.4132 129.959 41.3689C129.959 43.5308 130.38 45.3597 131.222 46.8608C132.064 48.362 133.154 49.5037 134.481 50.2807C135.813 51.0577 137.225 51.4489 138.726 51.4489C140.113 51.4489 141.217 51.3273 142.044 51.0894C142.867 50.8516 143.535 50.5609 144.04 50.2173C144.546 49.879 145.001 49.5883 145.417 49.3451C146.091 48.9857 146.73 48.806 147.329 48.806C148.156 48.806 148.835 49.1073 149.385 49.7046C149.93 50.3071 150.202 51.0049 150.202 51.803C150.202 52.8813 149.677 53.8645 148.627 54.7419C147.651 55.6246 146.284 56.3911 144.521 57.0518C142.758 57.7125 140.94 58.0402 139.068 58.0402V58.0561Z"
                fill="#1F2349"
              />
              <path
                d="M154.533 25.9555H167.857C168.758 25.9555 169.506 26.2779 170.105 26.9175C170.705 27.5571 171.002 28.3552 171.002 29.3172C171.002 30.2792 170.705 31.0087 170.105 31.6271C169.506 32.2455 168.758 32.5574 167.857 32.5574H154.533C153.636 32.5574 152.884 32.2403 152.284 31.5954C151.685 30.9558 151.383 30.1577 151.383 29.1957C151.383 28.2337 151.68 27.5095 152.284 26.8858C152.884 26.2673 153.631 25.9555 154.533 25.9555ZM160.551 18.455C161.527 18.455 162.319 18.8091 162.938 19.5069C163.557 20.2046 163.864 21.0767 163.864 22.118V48.8217C163.864 49.382 163.964 49.8418 164.172 50.2013C164.375 50.5607 164.657 50.825 165.014 50.9836C165.37 51.1421 165.752 51.2214 166.168 51.2214C166.618 51.2214 167.029 51.1316 167.406 50.9519C167.782 50.7721 168.213 50.6823 168.699 50.6823C169.224 50.6823 169.699 50.9413 170.135 51.4593C170.566 51.9773 170.779 52.7014 170.779 53.6212C170.779 54.7417 170.204 55.6615 169.065 56.3803C167.921 57.0992 166.693 57.4586 165.385 57.4586C164.598 57.4586 163.726 57.3899 162.77 57.2472C161.814 57.1045 160.917 56.7662 160.07 56.227C159.223 55.6879 158.525 54.858 157.96 53.7375C157.396 52.6169 157.118 51.0787 157.118 49.1177V22.1127C157.118 21.0714 157.445 20.2046 158.104 19.5016C158.763 18.7986 159.575 18.4497 160.551 18.4497V18.455Z"
                fill="#1F2349"
              />
              <path
                d="M57.5758 0.677899C56.714 -0.225966 55.3321 -0.225966 54.4703 0.677899L35.1286 21.2818L24.965 10.4354C24.1081 9.52098 22.7163 9.52098 21.8595 10.4354C21.0026 11.3499 21.0026 12.8352 21.8595 13.7496L33.5932 26.2346C33.9944 26.6839 34.5491 26.9323 35.1286 26.927C35.7181 26.9376 36.2877 26.6839 36.6988 26.2346L57.5758 3.95507C58.4228 3.06706 58.4376 1.61876 57.6055 0.709614C57.5956 0.699042 57.5857 0.688471 57.5758 0.677899Z"
                fill="#57BEC0"
              />
              <path
                d="M27.6644 34.5641C26.8967 32.6876 25.8367 30.9645 24.5242 29.4686C23.2215 28.015 21.6663 26.8416 19.9525 26.0117C18.2487 25.1818 16.4012 24.759 14.529 24.7748C12.0475 24.759 9.60563 25.4673 7.47087 26.8151C5.20733 28.2106 3.34499 30.235 2.08196 32.6771C0.685207 35.2195 0.00168761 38.3117 0.00168761 41.9166C-0.0379367 44.8237 0.620818 47.6939 1.91356 50.2522C3.17163 52.6995 5.05379 54.7187 7.33714 56.0771C9.65516 57.499 12.4536 58.2232 15.6582 58.2232C17.5206 58.2179 19.3631 57.869 21.1165 57.203C22.8897 56.5476 24.1874 55.8181 25.2424 54.909C26.2974 53.9998 26.8472 53.0167 26.8472 51.9225C26.8472 51.1297 26.5549 50.3738 26.0299 49.8135C25.4752 49.2321 24.7273 48.9202 23.9496 48.9413C23.2859 48.9678 22.6371 49.1422 22.0378 49.4488L20.641 50.3209C20.0318 50.7332 19.3631 51.0239 18.6647 51.1931C17.5701 51.4732 16.4458 51.5948 15.3214 51.5578C13.8306 51.5737 12.3595 51.1719 11.0569 50.3949C9.69974 49.5862 8.56549 48.4075 7.78291 46.975C7.28761 46.087 6.94585 45.0933 6.74277 43.9886H25.3811C26.2429 43.9886 27.075 43.6662 27.7338 43.0794C28.4074 42.5033 28.8036 41.6364 28.8234 40.7114C28.8234 38.5971 28.4272 36.5092 27.6644 34.5588V34.5641ZM8.80324 33.5069C9.51648 32.7458 10.3932 32.1802 11.359 31.8683C12.3892 31.5406 13.4591 31.382 14.529 31.3926C15.6731 31.3873 16.8073 31.6569 17.8376 32.1908C18.8331 32.7193 19.7148 33.4646 20.428 34.3738C21.0917 35.2882 21.4929 36.3877 21.587 37.54V37.9417H6.80716C6.89632 37.4765 7.00529 37.0167 7.13406 36.5568C7.46592 35.4151 8.03552 34.3685 8.80324 33.5016V33.5069Z"
                fill="#57BEC0"
              />
            </svg>
          </a>
          <nav className="navbar ">
            {isAuthenticated && (
              <svg
                width="27"
                height="29"
                viewBox="0 0 27 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.0668 3.18105C16.1428 3.20631 16.2208 3.14831 16.2172 3.06822C16.1334 1.22904 14.6613 0 13.0491 0C11.427 0 9.96487 1.24485 9.88098 3.06936C9.8773 3.14945 9.95535 3.20745 10.0314 3.18218C11.89 2.56372 14.2404 2.57375 16.0668 3.18105Z"
                  fill="#12163E"
                />
                <path
                  d="M24.4748 21.302C22.9727 20.0145 22.1112 18.1414 22.1112 16.1635V15.3996C22.1112 15.3276 22.0452 15.2748 21.9747 15.289C18.1273 16.0595 14.4081 13.0967 14.4081 9.0625C14.4081 6.32353 15.9094 4.85688 16.3941 4.44103C16.4584 4.3858 16.4417 4.28153 16.3629 4.25026C10.4925 1.92108 3.98622 6.24854 3.98622 12.6875V16.1635C3.98622 18.1015 3.15377 19.9902 1.6226 21.302C1.36999 21.5183 1.16381 21.7919 1.02618 22.0921C0.321454 23.6238 1.44673 25.375 3.12981 25.375H22.9271C24.1485 25.375 25.1905 24.4446 25.2772 23.2263C25.3319 22.457 25.0041 21.7553 24.4748 21.302Z"
                  fill="#12163E"
                />
                <path
                  d="M13.0489 29C14.7307 29 16.1778 27.9769 16.8004 26.5202C16.8487 26.4071 16.768 26.2812 16.645 26.2812H9.45277C9.3298 26.2812 9.24909 26.4071 9.2974 26.5202C9.92 27.9769 11.3672 29 13.0489 29Z"
                  fill="#12163E"
                />
                <path
                  d="M20.752 14.5C23.7693 14.5 26.1895 12.0571 26.1895 9.0625C26.1895 6.06451 23.7499 3.625 20.752 3.625C17.737 3.625 15.3145 6.07352 15.3145 9.0625C15.3145 12.0605 17.754 14.5 20.752 14.5ZM20.0485 7.65555C19.8242 7.76713 19.5523 7.6765 19.4402 7.45277C19.3286 7.22904 19.4192 6.9566 19.6429 6.84445L20.5492 6.39133C20.8482 6.2418 21.2051 6.45799 21.2051 6.79688V10.8184C21.2051 10.8496 21.2305 10.875 21.2617 10.875H21.6428C21.8842 10.875 22.0949 11.0573 22.1104 11.2982C22.1273 11.5621 21.9185 11.7812 21.6582 11.7812H19.8611C19.6197 11.7812 19.409 11.599 19.3935 11.3581C19.3766 11.0941 19.5854 10.875 19.8457 10.875H20.2422C20.2735 10.875 20.2988 10.8496 20.2988 10.8184V7.62162C20.2988 7.57948 20.2544 7.55206 20.2168 7.57098L20.0485 7.65555Z"
                  fill="#64C3C5"
                />
              </svg>
            )}
            <p className="nav-item mb-0" onClick={() => navigate("/cart")}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_423_8904"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                >
                  <path d="M0 0.608696H27.3913V28H0V0.608696Z" fill="white" />
                </mask>
                <g mask="url(#mask0_423_8904)">
                  <path
                    d="M5.67188 6.27944H26.5898L23.3799 17.5142H8.88179"
                    stroke="#1F2349"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.6962 23.9341C13.6962 24.8205 12.9777 25.5391 12.0913 25.5391C11.2049 25.5391 10.4863 24.8205 10.4863 23.9341C10.4863 23.0477 11.2049 22.3291 12.0913 22.3291C12.9777 22.3291 13.6962 23.0477 13.6962 23.9341Z"
                    stroke="#1F2349"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.7744 23.9341C21.7744 24.8205 21.0558 25.5391 20.1694 25.5391C19.283 25.5391 18.5645 24.8205 18.5645 23.9341C18.5645 23.0477 19.283 22.3291 20.1694 22.3291C21.0558 22.3291 21.7744 23.0477 21.7744 23.9341Z"
                    stroke="#1F2349"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M23.3789 20.7241H9.87265C8.67958 20.7241 7.90358 19.4686 8.43712 18.4014L8.88073 17.5142"
                    stroke="#1F2349"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0.802734 3.06953H4.7542C6.12061 7.85279 8.88103 17.5142 8.88103 17.5142"
                    stroke="#1F2349"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </svg>
              <span className="cart-number">{initialCartItems?.length}</span>
              {/* <span className="cart-number">{cartNumber}</span> */}
            </p>

            <div className="d-flex align-items-center">
              <p className="nav-item mb-0">
                {isAuthenticated ? (
                  <div className="user_icon" onClick={toggleDropdown}>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9987 11.9168C9.96536 11.9168 7.58203 9.5335 7.58203 6.50016C7.58203 3.46683 9.96536 1.0835 12.9987 1.0835C16.032 1.0835 18.4154 3.46683 18.4154 6.50016C18.4154 9.5335 16.032 11.9168 12.9987 11.9168ZM12.9987 3.25016C11.157 3.25016 9.7487 4.6585 9.7487 6.50016C9.7487 8.34183 11.157 9.75016 12.9987 9.75016C14.8404 9.75016 16.2487 8.34183 16.2487 6.50016C16.2487 4.6585 14.8404 3.25016 12.9987 3.25016Z"
                        fill="#1F2349"
                      />
                      <path
                        d="M22.7493 24.9167C22.0993 24.9167 21.666 24.4833 21.666 23.8333C21.666 19.0667 17.766 15.1667 12.9993 15.1667C8.23268 15.1667 4.33268 19.0667 4.33268 23.8333C4.33268 24.4833 3.89935 24.9167 3.24935 24.9167C2.59935 24.9167 2.16602 24.4833 2.16602 23.8333C2.16602 17.875 7.04102 13 12.9993 13C18.9577 13 23.8327 17.875 23.8327 23.8333C23.8327 24.4833 23.3993 24.9167 22.7493 24.9167Z"
                        fill="#1F2349"
                      />
                    </svg>
                  </div>
                ) : (
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={setShowLoginModal}
                  >
                    <path
                      d="M12.9987 11.9168C9.96536 11.9168 7.58203 9.5335 7.58203 6.50016C7.58203 3.46683 9.96536 1.0835 12.9987 1.0835C16.032 1.0835 18.4154 3.46683 18.4154 6.50016C18.4154 9.5335 16.032 11.9168 12.9987 11.9168ZM12.9987 3.25016C11.157 3.25016 9.7487 4.6585 9.7487 6.50016C9.7487 8.34183 11.157 9.75016 12.9987 9.75016C14.8404 9.75016 16.2487 8.34183 16.2487 6.50016C16.2487 4.6585 14.8404 3.25016 12.9987 3.25016Z"
                      fill="#1F2349"
                    />
                    <path
                      d="M22.7493 24.9167C22.0993 24.9167 21.666 24.4833 21.666 23.8333C21.666 19.0667 17.766 15.1667 12.9993 15.1667C8.23268 15.1667 4.33268 19.0667 4.33268 23.8333C4.33268 24.4833 3.89935 24.9167 3.24935 24.9167C2.59935 24.9167 2.16602 24.4833 2.16602 23.8333C2.16602 17.875 7.04102 13 12.9993 13C18.9577 13 23.8327 17.875 23.8327 23.8333C23.8327 24.4833 23.3993 24.9167 22.7493 24.9167Z"
                      fill="#1F2349"
                    />
                  </svg>
                )}
              </p>
              {isAuthenticated && (
                <div className="dropdown">
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {isAdmin && (
                        <a href="/dashboard" className="dropdown-item">
                          Dashboard
                        </a>
                      )}
                      <a href="/profile" className="dropdown-item">
                        Account
                      </a>
                      <p className="dropdown-item mb-0" onClick={handleLogout}>
                        Logout
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <Login show={showLoginModal} onHide={() => setShowLoginModal(false)} />
    </>
  );
}
