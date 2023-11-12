import React, { useEffect, useRef } from "react";
import "./MainDash.css";
import DonutChart from "react-donut-chart";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Calendar, DateObject } from "react-multi-date-picker";

export default function MainDash() {
  const currentDate = new Date();

  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentDate.getFullYear();
  const salesAmount = 698;
  const salesAmountString = salesAmount.toFixed(3);

  const [beforeDecimal, afterDecimal] = salesAmountString.split(".");

  const reactDonutChartdata = [
    { label: "1st", value: 50 },
    { label: "2sd", value: 100 },
    { label: "3rd", value: 30 },
    { label: "VIP", value: 57 },
  ];
  const reactDonutChartBackgroundColor = [
    "#65C8CE",
    "#ECEFF1",
    "#FDBF41",
    "#444790",
  ];

  const reactDonutChartInnerRadius = 0.3;
  const reactDonutChartSelectedOffset = -0.13;
  const reactDonutChartHandleClick = (item, toggled) => {
    if (toggled) {
      console.log(item);
    }
  };
  let reactDonutChartStrokeColor = "transparent";

  const svgRef = useRef(null);

  useEffect(() => {
    // Check if the SVG element exists before modifying it
    if (svgRef.current) {
      // Define your new viewBox value
      const newViewBox = "0 0 200 200"; // Replace with your desired viewBox value

      // Modify the viewBox attribute
      svgRef.current.setAttribute("viewBox", newViewBox);
    }
  }, []);

  const ordersData = [
    {
      id: "23694",
      event: "Rock party",
      ticketsAmount: 1200,
      total: 250,
      date: "11/10/2023",
    },
    {
      id: "23694",
      event: "Rock party",
      ticketsAmount: 1200,
      total: 250,
      date: "11/10/2023",
    },
    {
      id: "23694",
      event: "Rock party",
      ticketsAmount: 1200,
      total: 250,
      date: "11/10/2023",
    },
    {
      id: "23694",
      event: "Rock party",
      ticketsAmount: 1200,
      total: 250,
      date: "11/10/2023",
    },
  ];

  const nextEventData = {
    eventName: "Rock party",
    eventDate: "02/12/2023",
    eventTime: "21:00",
    eventLocation: "9 Berlin",
    eventImg:
      "https://w0.peakpx.com/wallpaper/920/606/HD-wallpaper-party-party-rock-new-years-celebration-silhouettes-entertain-happy-lights-people-party-bright-celebrate.jpg",
    eventSoldTickets: 70,
    eventTotalTickets: 100,
    eventRevenue: 99,
  };

  function formatDateFull(inputDate) {
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

    const [dd, mm, yyyy] = inputDate.split("/");
    const formattedDate = `${parseInt(dd)} ${
      months[parseInt(mm) - 1]
    }, ${yyyy}`;

    return formattedDate;
  }

  function splitNumberToDecimalParts(number) {
    const numberString = number.toFixed(3);
    const [beforeDecimal, afterDecimal] = numberString.split(".");
    return [beforeDecimal, afterDecimal];
  }

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const values = [
    [
      new DateObject().set({ day: 1, month: 11 }),
      new DateObject().set({ day: 3, month: 12, year: 2024 }),
    ],
    [new DateObject().set({ day: 11 }), new DateObject().set({ day: 12 })],
    [new DateObject().set({ day: 23 }), new DateObject().set({ day: 27 })],
  ];

  console.log();

  return (
    <main className="px-xxl-5 px-3 py-3 maindash_container w-100 m-0">
      <h1 className="dash_header mb-sm-0 mb-5">Dashboard</h1>
      <div className="dash_content d-flex justify-content-xl-between flex-xl-row align-items-center flex-column">
        <section className="maindash_details_box h-100 p-0 row">
          <div className="user_details_outerbox main_dash_detail col-xl-4 col-lg-4 col-md-7 mb-4">
            <div className="user_details_innerbox w-100">
              <div className="user_image">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="80" height="80" rx="40" fill="#D4E3FF" />
                  <g opacity="0.4">
                    <path
                      d="M24.5333 58.5333C24.5333 50.0267 31.4933 43.0667 40 43.0667C48.5067 43.0667 55.4667 50.0267 55.4667 58.5333H24.5333ZM40 41.1333C33.62 41.1333 28.4 35.9133 28.4 29.5333C28.4 23.1533 33.62 17.9333 40 17.9333C46.38 17.9333 51.6 23.1533 51.6 29.5333C51.6 35.9133 46.38 41.1333 40 41.1333Z"
                      fill="#6977FF"
                    />
                  </g>
                </svg>
              </div>
              <div className="h-100 w-100 d-flex flex-column align-items-center justify-content-between">
                <p className="user_name mb-1">Organizer name</p>
                <div className="user_details_content mb-2 d-flex row w-100">
                  <div className="user_detail p-0 d-flex flex-column align-items-center justify-content-start col-4">
                    <div className="user_detail_icon">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 28 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#7225FF" />
                        <g
                          clip-path="url(#clip0_0_1)"
                          filter="url(#filter0_d_0_1)"
                        >
                          <path
                            d="M10.8233 8.93103V17.7948C10.2067 17.0962 9.17898 16.9383 8.38107 17.4194C7.58327 17.9006 7.24336 18.8832 7.57348 19.7545C7.90349 20.6258 8.80925 21.1366 9.72562 20.9683C10.642 20.8 11.3071 20.0006 11.306 19.0689V11.2241L18.0646 9.53448V15.8637C17.4481 15.1652 16.4203 15.0072 15.6224 15.4883C14.8246 15.9696 14.4847 16.9522 14.8148 17.8235C15.1449 18.6947 16.0506 19.2055 16.967 19.0372C17.8834 18.8689 18.5484 18.0696 18.5474 17.1379V7L10.8233 8.93103Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_0_1"
                            x="2"
                            y="7"
                            width="22"
                            height="22"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_0_1"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_0_1"
                              result="shape"
                            />
                          </filter>
                          <clipPath id="clip0_0_1">
                            <rect
                              width="14"
                              height="14"
                              fill="white"
                              transform="translate(6 7)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="user_detail_text">
                      <p className="fw-bold m-0">23</p>
                      <p className="mb-0">Events</p>
                    </div>
                  </div>
                  <div className="user_detail p-0 d-flex flex-column align-items-center justify-content-start col-4">
                    <div className="user_detail_icon">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#FEA62F" />
                        <g filter="url(#filter0_d_0_1)">
                          <path
                            d="M16.314 9.35417C15.9013 9.35315 15.4925 9.43402 15.1113 9.59208C14.7301 9.75015 14.384 9.98227 14.0931 10.275L13.5 10.8681L12.9069 10.275C12.4675 9.8348 11.9073 9.53493 11.2974 9.41337C10.6874 9.29181 10.0551 9.35403 9.48051 9.59215C8.90594 9.83027 8.41498 10.2336 8.06983 10.751C7.72467 11.2684 7.54086 11.8766 7.54167 12.4985C7.54015 13.1683 7.68477 13.8303 7.96543 14.4384C8.24609 15.0465 8.65603 15.586 9.16667 16.0194L13.324 19.5808C13.373 19.6228 13.4354 19.6459 13.5 19.6459C13.5646 19.6459 13.627 19.6228 13.676 19.5808L17.8333 16.0085C18.344 15.5752 18.7539 15.0356 19.0346 14.4275C19.3152 13.8195 19.4599 13.1574 19.4583 12.4877C19.454 11.6561 19.121 10.8599 18.532 10.2729C17.9429 9.68584 17.1456 9.35559 16.314 9.35417Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_0_1"
                            x="3"
                            y="8"
                            width="21"
                            height="21"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_0_1"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_0_1"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                    <div className="user_detail_text">
                      <p className="w-bold m-0">614</p>
                      <p className="mb-0">Followers</p>
                    </div>
                  </div>
                  <div className="user_detail p-0 d-flex flex-column align-items-center justify-content-start col-4">
                    <div className="user_detail_icon">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 28 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#4BEAC5" />
                        <g
                          clip-path="url(#clip0_0_1)"
                          filter="url(#filter0_d_0_1)"
                        >
                          <path
                            d="M16.6972 13.0428C16.6101 12.7703 16.471 12.515 16.297 12.283L16.2912 12.2889C16.21 12.1844 16.1288 12.0684 16.0302 11.9698C15.9316 11.8712 15.8213 11.7842 15.717 11.703L14.5278 12.8921C14.6496 12.9559 14.7656 13.0255 14.8701 13.1299C15.3516 13.6114 15.3515 14.3885 14.8701 14.8701L10.7399 19.0003C10.2584 19.4817 9.48126 19.4818 8.99975 19.0003C8.51824 18.5189 8.51833 17.7416 8.99975 17.2601L10.6705 15.5893C10.3747 14.9687 10.2587 14.2726 10.3341 13.6056L7.83964 16.1C6.72012 17.2196 6.72012 19.0409 7.83964 20.1604C8.959 21.2798 10.7805 21.2798 11.8999 20.1604L16.0302 16.0302C16.8365 15.2238 17.0569 14.0522 16.6972 13.0428ZM20.1604 7.83964C19.0409 6.72012 17.2196 6.72012 16.1 7.83964L11.9698 11.9698C11.1635 12.7761 10.9432 13.9478 11.3028 14.957C11.3897 15.2297 11.529 15.4849 11.703 15.7169L11.7087 15.7112C11.7901 15.8155 11.8712 15.9316 11.9698 16.0302C12.0684 16.1288 12.1786 16.2158 12.2831 16.297L13.4721 15.1078C13.3504 15.0441 13.2344 14.9744 13.1299 14.8701C12.6485 14.3885 12.6485 13.6113 13.1299 13.1299L17.2601 8.99975C17.7416 8.51824 18.5188 8.51824 19.0003 8.99975C19.4818 9.48126 19.4818 10.2584 19.0003 10.7399L17.3294 12.4106C17.6253 13.0314 17.7413 13.7273 17.6659 14.3945L20.1604 11.8999C21.2798 10.7805 21.2798 8.959 20.1604 7.83964Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_0_1"
                            x="3"
                            y="7"
                            width="22"
                            height="22"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_0_1"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_0_1"
                              result="shape"
                            />
                          </filter>
                          <clipPath id="clip0_0_1">
                            <rect
                              width="14"
                              height="14"
                              fill="white"
                              transform="translate(7 7)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="user_detail_text">
                      <p className="w-bold mb-0">
                        <a href="google.com">
                          Copy
                          <br />
                          profile-url
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <button className="btn user_details_button">see profile</button>
              </div>
            </div>
          </div>
          <div className="sales_amount_outerbox main_dash_detail col-xl-3 col-lg-4 col-md-5 col-sm-6 mb-md-4 mb-5">
            <div className="sales_amount_innerbox d-flex flex-column justify-content-between">
              <div className="sales_amount_header">
                <h3 className="text-start fw-bold">Gross sales</h3>
                <p className="sales_amount_date">
                  {`${currentMonth}, ${currentYear}`}{" "}
                </p>
              </div>
              <div className="sales_amount_value d-flex">
                <p className="before_decimal mb-0 fw-bold me-2">
                  {beforeDecimal}{" "}
                </p>
                <p className="after_decimal mb-0 fw-bold me-2">
                  {afterDecimal || "000"}{" "}
                </p>
                <p className="currency mb-0">€</p>
              </div>
              <div className="sales_amount_chart">
                <svg
                  width="428"
                  height="121"
                  viewBox="0 0 428 121"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_57_2)">
                    <path
                      d="M452.328 35.1893V144.674H-26.8761V62.6755L42.4581 15.3591C57.0612 5.40212 80.6839 5.40212 95.2871 15.3591L173.518 68.6999C188.121 78.6569 211.744 78.6569 226.347 68.6999L257.271 47.6146C271.875 37.6576 295.497 37.6576 310.1 47.6146L320.04 54.4338C334.644 64.3908 358.266 64.3908 372.869 54.4338L400.296 35.7332C414.593 25.9854 437.602 25.7762 452.266 35.1893H452.328Z"
                      fill="#57BEC0"
                      fill-opacity="0.15"
                    />
                  </g>
                  <g filter="url(#filter0_d_57_2)">
                    <path
                      d="M428 29.9335H427.944C414.505 21.0485 399.412 29.9335 392.481 34.1711L367.346 51.8226C353.963 61.2209 332.314 61.2209 318.931 51.8226L309.821 45.3859C296.438 35.9876 274.789 35.9876 261.406 45.3859L233.066 65.2883C219.683 74.6866 198.034 74.6866 184.651 65.2883L112.956 14.9401C99.5732 5.54178 77.9242 5.54178 64.5412 14.9401L1 59.6019"
                      stroke="#57BEC0"
                      stroke-width="3"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_57_2"
                      x="0.137451"
                      y="5.39136"
                      width="449.634"
                      height="83.4457"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="13" dy="7" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.341176 0 0 0 0 0.745098 0 0 0 0 0.752941 0 0 0 0.45 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_57_2"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_57_2"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_57_2">
                      <rect
                        x="1"
                        width="423.452"
                        height="121"
                        rx="40"
                        fill="white"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div className="tickets_chart_outerbox main_dash_detail col-xl-5 col-lg-4 col-md-5 col-sm-6 mb-md-4 mb-5">
            <div className="tickets_chart_innerbox">
              <div className="tickets_chart_header">
                <h2 className="text-start fw-bold">Sales by ticket type</h2>
                <p className="tickets_chart_date">
                  {`${currentMonth}, ${currentYear}`}{" "}
                </p>
              </div>
              <div className="tickects_chart_box">
                <svg className="tickects_chart_container w-100">
                  <DonutChart
                    className="tickects_chart"
                    width={500}
                    legend={false}
                    strokeColor={reactDonutChartStrokeColor}
                    data={reactDonutChartdata}
                    colors={reactDonutChartBackgroundColor}
                    innerRadius={reactDonutChartInnerRadius}
                    selectedOffset={reactDonutChartSelectedOffset}
                    onClick={(item, toggled) =>
                      reactDonutChartHandleClick(item, toggled)
                    }
                  />
                </svg>
                <div className="tickets_chart_labels d-flex justify-content-between">
                  {reactDonutChartdata.map((el, index) => (
                    <div
                      className="tickets_chart_label d-flex align-items-center me-1"
                      key={index}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="13"
                          height="13"
                          fill={reactDonutChartBackgroundColor[index]}
                        />
                      </svg>
                      <p className="mb-0 ms-2">{`${el.label}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="orders_outerbox main_dash_detail col-xxl-7 col-lg-7 col-md-12">
            <div className="orders_innerbox">
              <div className="orders_header d-flex justify-content-between align-items-center">
                <h2 className="text-start fw-bold">Recent orders</h2>
                <p className="orders_date mb-0">
                  {`${currentMonth}, ${currentYear}`}
                </p>
              </div>
              <div className="orders_list d-flex flex-column justify-content-between">
                {ordersData.map((el, index) => (
                  <div
                    className="orders_list_element py-1 d-flex justify-content-between align-items-center"
                    key={index}
                  >
                    <div className="orders_list_element_icon">
                      <svg
                        width="44"
                        height="45"
                        viewBox="0 0 44 45"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <ellipse
                          cx="21.8611"
                          cy="22.2897"
                          rx="21.8611"
                          ry="22.2897"
                          fill="#FEA62F"
                          fill-opacity="0.17"
                        />
                        <path
                          d="M15.8438 19.6562C16.1026 19.6562 16.3125 19.4464 16.3125 19.1875C16.3125 18.9286 16.1026 18.7188 15.8438 18.7188C15.5849 18.7188 15.375 18.9286 15.375 19.1875C15.375 19.4464 15.5849 19.6562 15.8438 19.6562Z"
                          fill="#FEA62F"
                        />
                        <path
                          d="M15.8438 24.3438C16.1026 24.3438 16.3125 24.1339 16.3125 23.875C16.3125 23.6161 16.1026 23.4062 15.8438 23.4062C15.5849 23.4062 15.375 23.6161 15.375 23.875C15.375 24.1339 15.5849 24.3438 15.8438 24.3438Z"
                          fill="#FEA62F"
                        />
                        <path
                          d="M15.8438 29.0312C16.1026 29.0312 16.3125 28.8214 16.3125 28.5625C16.3125 28.3036 16.1026 28.0938 15.8438 28.0938C15.5849 28.0938 15.375 28.3036 15.375 28.5625C15.375 28.8214 15.5849 29.0312 15.8438 29.0312Z"
                          fill="#FEA62F"
                        />
                        <path
                          d="M31.3125 13.5625H30.375V33.7188C30.375 33.8431 30.3256 33.9623 30.2377 34.0502C30.1498 34.1381 30.0306 34.1875 29.9062 34.1875H14.4375V35.125H31.3125V13.5625Z"
                          fill="#FEA62F"
                        />
                        <path
                          d="M18.1875 11.6875V10.2812C18.1875 9.78397 17.99 9.30706 17.6383 8.95542C17.2867 8.60379 16.8098 8.40625 16.3125 8.40625C15.8152 8.40625 15.3383 8.60379 14.9867 8.95542C14.635 9.30706 14.4375 9.78397 14.4375 10.2812V11.6875H15.375V10.2812C15.375 10.0326 15.4738 9.79415 15.6496 9.61834C15.8254 9.44252 16.0639 9.34375 16.3125 9.34375C16.5611 9.34375 16.7996 9.44252 16.9754 9.61834C17.1512 9.79415 17.25 10.0326 17.25 10.2812V11.6875H15.375V13.5625C15.375 13.8111 15.4738 14.0496 15.6496 14.2254C15.8254 14.4012 16.0639 14.5 16.3125 14.5C16.5611 14.5 16.7996 14.4012 16.9754 14.2254C17.1512 14.0496 17.25 13.8111 17.25 13.5625V12.625H18.1875V13.5625C18.1875 14.0598 17.99 14.5367 17.6383 14.8883C17.2867 15.24 16.8098 15.4375 16.3125 15.4375C15.8152 15.4375 15.3383 15.24 14.9867 14.8883C14.635 14.5367 14.4375 14.0598 14.4375 13.5625V11.6875H12.5625V33.25H29.4375V11.6875H18.1875ZM15.8438 29.9688C15.5656 29.9688 15.2937 29.8863 15.0625 29.7318C14.8312 29.5772 14.651 29.3576 14.5445 29.1006C14.4381 28.8437 14.4103 28.5609 14.4645 28.2882C14.5188 28.0154 14.6527 27.7648 14.8494 27.5681C15.046 27.3715 15.2966 27.2375 15.5694 27.1833C15.8422 27.129 16.1249 27.1569 16.3819 27.2633C16.6389 27.3697 16.8585 27.55 17.013 27.7812C17.1675 28.0125 17.25 28.2844 17.25 28.5625C17.25 28.9355 17.1018 29.2931 16.8381 29.5569C16.5744 29.8206 16.2167 29.9688 15.8438 29.9688ZM15.8438 25.2812C15.5656 25.2812 15.2937 25.1988 15.0625 25.0443C14.8312 24.8897 14.651 24.6701 14.5445 24.4131C14.4381 24.1562 14.4103 23.8734 14.4645 23.6007C14.5188 23.3279 14.6527 23.0773 14.8494 22.8806C15.046 22.684 15.2966 22.55 15.5694 22.4958C15.8422 22.4415 16.1249 22.4694 16.3819 22.5758C16.6389 22.6822 16.8585 22.8625 17.013 23.0937C17.1675 23.325 17.25 23.5969 17.25 23.875C17.25 24.248 17.1018 24.6056 16.8381 24.8694C16.5744 25.1331 16.2167 25.2812 15.8438 25.2812ZM15.8438 20.5938C15.5656 20.5938 15.2937 20.5113 15.0625 20.3568C14.8312 20.2022 14.651 19.9826 14.5445 19.7256C14.4381 19.4687 14.4103 19.1859 14.4645 18.9132C14.5188 18.6404 14.6527 18.3898 14.8494 18.1931C15.046 17.9965 15.2966 17.8625 15.5694 17.8083C15.8422 17.754 16.1249 17.7819 16.3819 17.8883C16.6389 17.9947 16.8585 18.175 17.013 18.4062C17.1675 18.6375 17.25 18.9094 17.25 19.1875C17.25 19.5605 17.1018 19.9181 16.8381 20.1819C16.5744 20.4456 16.2167 20.5938 15.8438 20.5938ZM27.0938 29.0312H19.5938C19.4694 29.0312 19.3502 28.9819 19.2623 28.894C19.1744 28.806 19.125 28.6868 19.125 28.5625C19.125 28.4382 19.1744 28.319 19.2623 28.231C19.3502 28.1431 19.4694 28.0938 19.5938 28.0938H27.0938C27.2181 28.0938 27.3373 28.1431 27.4252 28.231C27.5131 28.319 27.5625 28.4382 27.5625 28.5625C27.5625 28.6868 27.5131 28.806 27.4252 28.894C27.3373 28.9819 27.2181 29.0312 27.0938 29.0312ZM27.0938 24.3438H19.5938C19.4694 24.3438 19.3502 24.2944 19.2623 24.2065C19.1744 24.1185 19.125 23.9993 19.125 23.875C19.125 23.7507 19.1744 23.6315 19.2623 23.5435C19.3502 23.4556 19.4694 23.4062 19.5938 23.4062H27.0938C27.2181 23.4062 27.3373 23.4556 27.4252 23.5435C27.5131 23.6315 27.5625 23.7507 27.5625 23.875C27.5625 23.9993 27.5131 24.1185 27.4252 24.2065C27.3373 24.2944 27.2181 24.3438 27.0938 24.3438ZM27.0938 19.6562H19.5938C19.4694 19.6562 19.3502 19.6069 19.2623 19.519C19.1744 19.431 19.125 19.3118 19.125 19.1875C19.125 19.0632 19.1744 18.944 19.2623 18.856C19.3502 18.7681 19.4694 18.7188 19.5938 18.7188H27.0938C27.2181 18.7188 27.3373 18.7681 27.4252 18.856C27.5131 18.944 27.5625 19.0632 27.5625 19.1875C27.5625 19.3118 27.5131 19.431 27.4252 19.519C27.3373 19.6069 27.2181 19.6562 27.0938 19.6562Z"
                          fill="#FEA62F"
                        />
                      </svg>
                    </div>
                    <div className="orders_list_element_detail">
                      <p className="mb-0">{el.id}</p>
                    </div>
                    <div className="orders_list_element_detail">
                      <p className="mb-0">{el.event}</p>
                    </div>
                    <div className="orders_list_element_detail">
                      <p className="mb-0">{el.ticketsAmount} chair</p>
                    </div>
                    <div className="orders_list_element_detail">
                      <p className="mb-0">{el.total} €</p>
                    </div>
                    <div className="orders_list_element_detail">
                      <p className="mb-0">{el.date}</p>
                    </div>
                    <button className="orders_list_element_button btn p-0">
                      <svg
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          opacity="0.15"
                          x="0.850586"
                          y="0.572998"
                          width="27.4335"
                          height="27.4335"
                          rx="13.7168"
                          fill="#889BFF"
                        />
                        <g clip-path="url(#clip0_75_6)">
                          <path
                            d="M18.1728 14.7184C18.1728 14.9182 18.0965 15.1179 17.9443 15.2701L13.1522 20.0622C12.8474 20.367 12.3531 20.367 12.0484 20.0622C11.7437 19.7575 11.7437 19.2633 12.0484 18.9585L16.2887 14.7184L12.0486 10.4783C11.7438 10.1735 11.7438 9.6794 12.0486 9.37471C12.3533 9.06973 12.8475 9.06973 13.1523 9.37471L17.9444 14.1667C18.0967 14.319 18.1728 14.5188 18.1728 14.7184Z"
                            fill="#889BFF"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_75_6">
                            <rect
                              width="11.1449"
                              height="11.1449"
                              fill="white"
                              transform="translate(9.42383 20.2908) rotate(-90)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="next_event_outerbox main_dash_detail col-lg-5 col-md-7 col-12">
            <div className="next_event_innerbox d-flex justify-content-between flex-column">
              <div
                className="next_event_banner"
                style={{ backgroundImage: `url("${nextEventData.eventImg}")` }}
              >
                <p className="next_event_name mb-0">
                  {nextEventData.eventName}
                </p>
                <p className="next_event_date mb-0">
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="me-3"
                  >
                    <path
                      d="M6.56689 10.6028C6.56689 10.895 6.32778 11.134 6.03561 11.134H3.37914C3.08697 11.134 2.84786 10.8949 2.84786 10.6028V8.82713C2.84786 8.5349 3.08697 8.29585 3.37914 8.29585H6.03561C6.32784 8.29585 6.56689 8.53496 6.56689 8.82713V10.6028Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M6.5671 15.2684C6.5671 15.5607 6.32799 15.7997 6.03581 15.7997H3.37935C3.08717 15.7997 2.84807 15.5606 2.84807 15.2684V13.4928C2.84807 13.2005 3.08717 12.9615 3.37935 12.9615H6.03581C6.32805 12.9615 6.5671 13.2006 6.5671 13.4928V15.2684Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M11.6294 10.6028C11.6294 10.895 11.3903 11.134 11.0982 11.134H8.44164C8.14941 11.134 7.91036 10.8949 7.91036 10.6028V8.82713C7.91036 8.5349 8.14947 8.29585 8.44164 8.29585H11.0982C11.3904 8.29585 11.6294 8.53496 11.6294 8.82713V10.6028Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M11.6297 15.2684C11.6297 15.5607 11.3905 15.7997 11.0984 15.7997H8.44185C8.14962 15.7997 7.91057 15.5606 7.91057 15.2684V13.4928C7.91057 13.2005 8.14967 12.9615 8.44185 12.9615H11.0984C11.3906 12.9615 11.6297 13.2006 11.6297 13.4928V15.2684Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M16.6294 10.6028C16.6294 10.895 16.3903 11.134 16.0982 11.134H13.4416C13.1494 11.134 12.9104 10.8949 12.9104 10.6028V8.82713C12.9104 8.5349 13.1495 8.29585 13.4416 8.29585H16.0982C16.3904 8.29585 16.6294 8.53496 16.6294 8.82713V10.6028Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M16.6297 15.2684C16.6297 15.5607 16.3905 15.7997 16.0984 15.7997H13.4418C13.1496 15.7997 12.9106 15.5606 12.9106 15.2684V13.4928C12.9106 13.2005 13.1497 12.9615 13.4418 12.9615H16.0984C16.3906 12.9615 16.6297 13.2006 16.6297 13.4928V15.2684Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M4.17414 4.32243C3.85673 4.32243 3.59704 4.06274 3.59704 3.74527V0.621972C3.59704 0.3045 3.85673 0.0448151 4.17414 0.0448151H5.37474C5.69215 0.0448151 5.9519 0.3045 5.9519 0.621972V3.74527C5.9519 4.06268 5.69221 4.32243 5.37474 4.32243H4.17414Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M14.1692 4.32243C13.8518 4.32243 13.5921 4.06274 13.5921 3.74527V0.621972C13.5921 0.3045 13.8518 0.0448151 14.1692 0.0448151H15.3698C15.6872 0.0448151 15.947 0.3045 15.947 0.621972V3.74527C15.947 4.06268 15.6873 4.32243 15.3698 4.32243H14.1692Z"
                      fill="#65C8CE"
                    />
                    <path
                      d="M18.9821 2.40501C18.9821 2.40501 18.0292 2.40501 17.3021 2.40501C17.2061 2.40501 17.0285 2.40501 17.0285 2.62631V3.61422C17.0285 4.55744 16.506 5.32482 15.3179 5.32482H14.2126C13.086 5.32482 12.502 4.55744 12.502 3.61422L12.502 2.67791C12.502 2.50101 12.3784 2.40501 12.231 2.40501C10.8236 2.40501 8.80895 2.40501 7.35155 2.40501C7.24329 2.40501 7.0375 2.40501 7.0375 2.68528V3.61422C7.0375 4.55744 6.56719 5.32482 5.32691 5.32482H4.22159C2.84816 5.32482 2.511 4.55744 2.511 3.61422V2.72213C2.511 2.47153 2.28539 2.40501 2.16257 2.40501C1.44395 2.40501 0.557462 2.40501 0.557462 2.40501C0.25084 2.40501 0 2.65585 0 3.37547V18.2713C0 18.1649 0.25084 18.4157 0.557462 18.4157H18.982C19.2886 18.4157 19.5395 18.1649 19.5395 18.2713V3.37547C19.5395 2.65585 19.2886 2.40501 18.9821 2.40501ZM18.3007 16.6195C18.3007 16.9261 18.0499 17.1769 17.7433 17.1769H1.79627C1.48965 17.1769 1.23881 16.9261 1.23881 16.6195V7.38933C1.23881 7.08271 1.48965 6.83187 1.79627 6.83187H17.7433C18.0499 6.83187 18.3007 7.08271 18.3007 7.38933V16.6195Z"
                      fill="#65C8CE"
                    />
                  </svg>
                  {nextEventData.eventDate}
                </p>
              </div>
              <div className="next_event_sales d-flex justify-content-between">
                <div className="next_event_sales_tickets">
                  <div className="next_event_sales_tickets_progressbar pt-3">
                    <CircularProgressbar
                      value={
                        (nextEventData.eventSoldTickets /
                          nextEventData.eventTotalTickets) *
                        100
                      }
                      text={`${nextEventData.eventSoldTickets}`}
                      circleRatio={0.5}
                      strokeWidth={13}
                      styles={buildStyles({
                        rotation: -0.25,
                        strokeLinecap: "butt",
                        trailColor: "#eee",
                        pathColor: "#65C8CE",
                      })}
                    />
                  </div>
                  <p className="mb-0 mt-xxl-3 mt-2 next_event_sales_tickets_progressbar_label">
                    Tickets sold
                    <br />
                    {`/${nextEventData.eventTotalTickets}Tickets`}
                  </p>
                </div>
                <div className="next_event_sales_revenue">
                  <div className="d-flex justify-content-center align-items-center">
                    <p className="next_event_sales_revenue_afterDec me-1 mb-0">
                      {splitNumberToDecimalParts(nextEventData.eventRevenue)[0]}
                    </p>
                    <p className="next_event_sales_revenue_beforeDec me-1 mb-0">
                      {splitNumberToDecimalParts(nextEventData.eventRevenue)[1]}
                    </p>
                    <p className="next_event_sales_revenue_Currency mb-0">€</p>
                  </div>
                  <p className="next_event_sales_revenue_label">
                    The gross revenue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="maindash_calander_outerbox row pe-xl-3 ps-xl-0 px-3">
          <div className="maindash_calendar_innerbox d-flex flex-xl-nowrap flex-wrap flex-xl-column flex-sm-row flex-column justify-content-between col-12">
            <div className="maindash_calendar">
              <h4 className="maindash_calendar_innerbox_header mb-4 px-3">
                Calendar
              </h4>
              <Calendar
                weekDays={weekDays}
                currentDate={
                  new DateObject({
                    year: currentYear,
                    month: currentDate.getMonth() + 1,
                    day: 1,
                  })
                }
                readOnly
                value={values}
                multiple
                range
                highlightToday={false}
                mapDays={({ date }) => {
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // Set the time to midnight to compare dates accurately

                  // Check if the date is in the past
                  const isPastDate = date < currentDate;

                  if (isPastDate) {
                    return {
                      disabled: true,
                      style: { color: "#ccc" },
                    };
                  }
                }}
              />
            </div>
            <div className="maindash_calendar_innerbox_divider d-xl-none"></div>
            <div className="maindash_calendar_next_event_box">
              <h4 className="text-start fw-bold px-3">Events</h4>
              <p className="text-muted text-start ps-3 m-0 fs-6">3 events</p>
              <div className="maindash_current_events_box">
                <div className="d-flex flex-wrap maindash_calendar_next_event_details_box">
                  <p className="maindash_calendar_next_event_date ps-3 w-100">
                    {formatDateFull(nextEventData.eventDate)}
                  </p>
                  <p className="maindash_calendar_next_event_hour mt-3 mb-0">
                    {nextEventData.eventTime}
                  </p>
                  <div className="maindash_calendar_divider mt-4"></div>
                  <div className="maindash_calendar_next_event_details d-flex justify-content-between align-items-center">
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="21" cy="21" r="21" fill="#7225FF" />
                      <g
                        clip-path="url(#clip0_21_359)"
                        filter="url(#filter0_d_21_359)"
                      >
                        <path
                          d="M16.2348 12.8965V26.1921C15.31 25.1443 13.7684 24.9074 12.5715 25.629C11.3748 26.3509 10.865 27.8248 11.3602 29.1318C11.8552 30.4387 13.2138 31.2049 14.5884 30.9524C15.9629 30.6999 16.9606 29.5009 16.959 28.1034V16.3362L27.0969 13.8017V23.2956C26.1721 22.2477 24.6305 22.0108 23.4336 22.7325C22.2369 23.4543 21.727 24.9282 22.2222 26.2353C22.7172 27.5421 24.0759 28.3083 25.4504 28.0559C26.825 27.8034 27.8226 26.6044 27.821 25.2069V10L16.2348 12.8965Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_21_359"
                          x="5"
                          y="10"
                          width="29"
                          height="29"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_21_359"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_21_359"
                            result="shape"
                          />
                        </filter>
                        <clipPath id="clip0_21_359">
                          <rect
                            width="21"
                            height="21"
                            fill="white"
                            transform="translate(9 10)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="d-flex flex-column text-start align-items-center">
                      <p className="maindash_calendar_next_event_name mb-1 w-100">
                        {nextEventData.eventName}
                      </p>
                      <p className="maindash_calendar_next_event_location mb-0 w-100">
                        {nextEventData.eventLocation}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap maindash_calendar_next_event_details_box">
                  <p className="maindash_calendar_next_event_date px-3 w-100">
                    {formatDateFull(nextEventData.eventDate)}
                  </p>
                  <p className="maindash_calendar_next_event_hour mt-3 mb-0">
                    {nextEventData.eventTime}
                  </p>
                  <div className="maindash_calendar_divider mt-4"></div>
                  <div className="maindash_calendar_next_event_details d-flex justify-content-between align-items-center">
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="21" cy="21" r="21" fill="#7225FF" />
                      <g
                        clip-path="url(#clip0_21_359)"
                        filter="url(#filter0_d_21_359)"
                      >
                        <path
                          d="M16.2348 12.8965V26.1921C15.31 25.1443 13.7684 24.9074 12.5715 25.629C11.3748 26.3509 10.865 27.8248 11.3602 29.1318C11.8552 30.4387 13.2138 31.2049 14.5884 30.9524C15.9629 30.6999 16.9606 29.5009 16.959 28.1034V16.3362L27.0969 13.8017V23.2956C26.1721 22.2477 24.6305 22.0108 23.4336 22.7325C22.2369 23.4543 21.727 24.9282 22.2222 26.2353C22.7172 27.5421 24.0759 28.3083 25.4504 28.0559C26.825 27.8034 27.8226 26.6044 27.821 25.2069V10L16.2348 12.8965Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_21_359"
                          x="5"
                          y="10"
                          width="29"
                          height="29"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_21_359"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_21_359"
                            result="shape"
                          />
                        </filter>
                        <clipPath id="clip0_21_359">
                          <rect
                            width="21"
                            height="21"
                            fill="white"
                            transform="translate(9 10)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="d-flex flex-column text-start align-items-center">
                      <p className="maindash_calendar_next_event_name mb-1 w-100">
                        {nextEventData.eventName}
                      </p>
                      <p className="maindash_calendar_next_event_location mb-0 w-100">
                        {nextEventData.eventLocation}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap maindash_calendar_next_event_details_box">
                  <p className="maindash_calendar_next_event_date px-3 w-100">
                    {formatDateFull(nextEventData.eventDate)}
                  </p>
                  <p className="maindash_calendar_next_event_hour mt-3 mb-0">
                    {nextEventData.eventTime}
                  </p>
                  <div className="maindash_calendar_divider mt-4"></div>
                  <div className="maindash_calendar_next_event_details d-flex justify-content-between align-items-center">
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="21" cy="21" r="21" fill="#7225FF" />
                      <g
                        clip-path="url(#clip0_21_359)"
                        filter="url(#filter0_d_21_359)"
                      >
                        <path
                          d="M16.2348 12.8965V26.1921C15.31 25.1443 13.7684 24.9074 12.5715 25.629C11.3748 26.3509 10.865 27.8248 11.3602 29.1318C11.8552 30.4387 13.2138 31.2049 14.5884 30.9524C15.9629 30.6999 16.9606 29.5009 16.959 28.1034V16.3362L27.0969 13.8017V23.2956C26.1721 22.2477 24.6305 22.0108 23.4336 22.7325C22.2369 23.4543 21.727 24.9282 22.2222 26.2353C22.7172 27.5421 24.0759 28.3083 25.4504 28.0559C26.825 27.8034 27.8226 26.6044 27.821 25.2069V10L16.2348 12.8965Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_21_359"
                          x="5"
                          y="10"
                          width="29"
                          height="29"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_21_359"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_21_359"
                            result="shape"
                          />
                        </filter>
                        <clipPath id="clip0_21_359">
                          <rect
                            width="21"
                            height="21"
                            fill="white"
                            transform="translate(9 10)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="d-flex flex-column text-start align-items-center">
                      <p className="maindash_calendar_next_event_name mb-1 w-100">
                        {nextEventData.eventName}
                      </p>
                      <p className="maindash_calendar_next_event_location mb-0 w-100">
                        {nextEventData.eventLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
