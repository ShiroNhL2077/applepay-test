import React from "react";
import { useState } from "react";
import Toggle from "./Toggle";
import "./EventsDash.css";
import InformationRow from "./InformationRow";

import DurationControl from "react-duration-control";

import "react-duration-control/dist/react-duration-control.css";

export default function StepFour() {
  const labelsArray = [
    "Title (Mr., Mrs., etc.)",
    "Addition",
    "Gender",
    "Handicap must be considered? (Yes/No answer)",
    "Private phone",
    "Mobil phone",
    "Home address",
    "Delivery address",
    "Website",
    "Blog",
    "Job title",
    "Company / Organization",
    "Business address",
    "Business phone",
  ];

  const [minutes, setMinutes] = useState(0);
  return (
    <div className="step_four_container">
      <p className="_subtitle">
        what information do you need from your participants ?
      </p>
      <div className="_information_container">
        <div className="_header row">
          <div className="col-6">
            <p className="fw-bold">Details</p>
          </div>
          <div className="col-3 fw-bold">
            <p className="text-center">Optional</p>
          </div>
          <div className="col-3 fw-bold">
            <p className="text-center">Mandatory</p>
          </div>
        </div>{" "}
        <div className="_information_row row mb-2">
          <div className="col-6 d-flex flex-column justify-content-center">
            <p className="_label">first name</p>
            <p className="_sublabel">We collect first name by standard</p>
          </div>
          <div className="col-3 d-flex justify-content-center align-items-center"></div>
          <div className="col-3 d-flex justify-content-center align-items-center">
            <Toggle toggled={true} disabled={true} />
          </div>
        </div>
        <div className="_information_row row mb-2">
          <div className="col-6 d-flex flex-column justify-content-center">
            <p className="_label">last name</p>
            <p className="_sublabel">We collect last name by standard</p>
          </div>
          <div className="col-3 d-flex justify-content-center align-items-center"></div>
          <div className="col-3 d-flex justify-content-center align-items-center">
            <Toggle toggled={true} disabled={true} />
          </div>
        </div>
        <div className="_information_row row mb-2">
          <div className="col-6 d-flex flex-column justify-content-center">
            <p className="_label">email add</p>
            <p className="_sublabel">We collect email add by standard</p>
          </div>
          <div className="col-3 d-flex justify-content-center align-items-center"></div>
          <div className="col-3 d-flex justify-content-center align-items-center">
            <Toggle toggled={true} disabled={true} />
          </div>
        </div>
        {labelsArray.map((itm, index) => (
          <InformationRow label={itm} key={index} />
        ))}
        <div className="_divider mb-4"></div>
        <div className="_options">
          <p className="_title">More Options :</p>
          <p className="_subtitle">Time limit for registration :</p>
          <p className="_description">
            Specify how long the ordering process can take before the tickets
            are released.
            <br />
            Allow participants enough time to complete the order form.
          </p>
          <div className="_time_picker mt-3 d-flex">
            <DurationControl
              pattern="{mm} Minutes"
              value={minutes}
              onChange={setMinutes}
            />
            <div className="_icon d-flex align-items-center px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
              >
                <g clip-path="url(#clip0_54_12956)">
                  <path
                    d="M19.6319 3.36829C17.4598 1.19623 14.5716 0 11.5 0C8.42841 0 5.54018 1.19623 3.36812 3.36829C1.19606 5.54036 0 8.42818 0 11.5C0 14.5718 1.19606 17.4596 3.36812 19.6317C5.54018 21.8038 8.42841 23 11.5 23C14.5716 23 17.4598 21.8038 19.6319 19.6317C21.8039 17.4596 23 14.5718 23 11.5C23 8.42818 21.8039 5.54036 19.6319 3.36829ZM11.5 21.0669C6.22495 21.0669 1.93292 16.7752 1.93292 11.5C1.93292 6.22478 6.22495 1.93315 11.5 1.93315C16.7751 1.93315 21.0671 6.22478 21.0671 11.5C21.0671 16.7752 16.7751 21.0669 11.5 21.0669Z"
                    fill="#444790"
                  />
                  <path
                    d="M7.98094 17.6067C7.61024 17.3928 7.13581 17.5195 6.92116 17.8902C6.70732 18.2614 6.83457 18.7359 7.20527 18.9499C7.32728 19.0205 7.46092 19.0542 7.59259 19.0542C7.86043 19.0542 8.1209 18.9151 8.26477 18.6664C8.47884 18.2951 8.35199 17.8207 7.98094 17.6067Z"
                    fill="#444790"
                  />
                  <path
                    d="M7.57905 5.50609C7.71119 5.50609 7.84539 5.4724 7.96798 5.40133C8.33811 5.18628 8.46438 4.71133 8.24921 4.34114C8.03365 3.9705 7.55933 3.84475 7.18903 4.05974C6.81838 4.27479 6.69269 4.74922 6.9078 5.11987C7.05172 5.36763 7.31156 5.50609 7.57905 5.50609Z"
                    fill="#444790"
                  />
                  <path
                    d="M4.3322 8.26933C4.45416 8.33931 4.58738 8.37306 4.71894 8.37306C4.98695 8.37306 5.248 8.23402 5.39135 7.98476C5.60531 7.61412 5.47794 7.13968 5.10724 6.92573C4.73608 6.71125 4.2617 6.83856 4.04769 7.20966C3.83367 7.58094 3.96109 8.05485 4.3322 8.26933Z"
                    fill="#444790"
                  />
                  <path
                    d="M11.4866 4.45346C11.4871 4.45346 11.4871 4.45346 11.4875 4.45346C11.916 4.45237 12.2626 4.10473 12.2622 3.67629C12.261 3.2478 11.9136 2.90125 11.485 2.90229C11.0565 2.9028 10.71 3.25051 10.7109 3.67888C10.7115 4.10685 11.0585 4.45346 11.4866 4.45346Z"
                    fill="#444790"
                  />
                  <path
                    d="M4.33891 14.7473C3.96821 14.9618 3.84194 15.4362 4.0571 15.807C4.20102 16.0551 4.4615 16.1938 4.72899 16.1938C4.86107 16.1938 4.9947 16.1601 5.11729 16.0889C5.48793 15.8745 5.61409 15.3994 5.39904 15.0293C5.18404 14.6586 4.70955 14.5322 4.33891 14.7473Z"
                    fill="#444790"
                  />
                  <path
                    d="M4.45346 11.5081C4.45289 11.0796 4.10524 10.7331 3.67687 10.7335C3.24844 10.734 2.90183 11.0817 2.90234 11.5096C2.90292 11.9381 3.24999 12.2846 3.67796 12.2846H3.67836C4.10697 12.2841 4.45404 11.9364 4.45346 11.5081Z"
                    fill="#444790"
                  />
                  <path
                    d="M11.5036 18.5466C11.0758 18.5471 10.7285 18.8943 10.7285 19.3226C10.7291 19.7511 11.0763 20.0983 11.5047 20.0977C11.9331 20.0977 12.2803 19.75 12.2798 19.3216C12.2798 18.8936 11.9323 18.5466 11.5036 18.5466Z"
                    fill="#444790"
                  />
                  <path
                    d="M18.6644 14.7393C18.2938 14.5249 17.8195 14.6515 17.6048 15.0222C17.3904 15.3929 17.5171 15.8673 17.8878 16.0818C18.0104 16.1525 18.144 16.1861 18.2755 16.1861C18.5435 16.1861 18.804 16.0476 18.9473 15.7988C19.1619 15.4282 19.0351 14.9537 18.6644 14.7393Z"
                    fill="#444790"
                  />
                  <path
                    d="M19.3208 10.7062C18.8924 10.7073 18.5457 11.0556 18.5469 11.4839C18.5469 11.4882 18.5469 11.4926 18.5469 11.4962C18.5469 11.4979 18.5469 11.4989 18.5469 11.5C18.5469 11.9285 18.8939 12.2756 19.3223 12.2756C19.7509 12.2756 20.0979 11.9285 20.0979 11.5C20.0979 11.4973 20.0979 11.4941 20.0979 11.4909C20.0979 11.4877 20.0979 11.4839 20.0979 11.4802C20.097 11.0518 19.7491 10.7057 19.3208 10.7062Z"
                    fill="#444790"
                  />
                  <path
                    d="M15.0114 5.38899C15.1333 5.4596 15.2666 5.49272 15.3981 5.49272C15.6661 5.49272 15.9271 5.35368 16.0705 5.10442C16.2845 4.73314 16.1571 4.25877 15.786 4.04481C15.4147 3.83137 14.9402 3.95867 14.7268 4.32995C14.513 4.70111 14.6402 5.1756 15.0114 5.38899Z"
                    fill="#444790"
                  />
                  <path
                    d="M15.0252 17.6031C14.6546 17.8175 14.5279 18.2919 14.7429 18.6626C14.8868 18.9108 15.1471 19.0498 15.4147 19.0498C15.5469 19.0498 15.6801 19.0161 15.8025 18.9452C16.1732 18.7307 16.2994 18.2562 16.085 17.8854C15.8704 17.5147 15.3959 17.388 15.0252 17.6031Z"
                    fill="#444790"
                  />
                  <path
                    d="M18.268 8.35009C18.4007 8.35009 18.5344 8.31582 18.6574 8.24469C19.0276 8.02913 19.1534 7.55469 18.9378 7.18457C18.7227 6.81386 18.2477 6.68869 17.8776 6.90374C17.5074 7.11873 17.3817 7.59368 17.5968 7.96386C17.7407 8.21152 18.0006 8.35009 18.268 8.35009Z"
                    fill="#444790"
                  />
                  <path
                    d="M16.3737 12.0437L12.3009 11.7659L11.8944 5.80065C11.8803 5.59543 11.7097 5.4361 11.5039 5.4361C11.2982 5.4361 11.1277 5.59543 11.1136 5.80065L10.7142 11.6577L10.0624 11.6133C9.97542 11.6073 9.88992 11.6377 9.82627 11.6972C9.76273 11.7567 9.72656 11.8399 9.72656 11.9271V12.788C9.72656 12.8752 9.76273 12.9584 9.82627 13.0178C9.88469 13.0724 9.96156 13.1026 10.041 13.1026C10.048 13.1026 10.0552 13.1023 10.0624 13.1019L10.6184 13.0639L10.5783 13.6509C10.571 13.7591 10.6088 13.8654 10.6827 13.9445C10.7567 14.0237 10.8602 14.0687 10.9687 14.0687H12.0392C12.0397 14.0687 12.0402 14.0687 12.0404 14.0687C12.2564 14.0687 12.4315 13.8935 12.4315 13.6775C12.4315 13.6584 12.3815 12.9435 12.3815 12.9435L16.3739 12.6713C16.539 12.66 16.6672 12.5229 16.6672 12.3574C16.6669 12.1921 16.5388 12.055 16.3737 12.0437Z"
                    fill="#444790"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_54_12956">
                    <rect width="23" height="23" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
