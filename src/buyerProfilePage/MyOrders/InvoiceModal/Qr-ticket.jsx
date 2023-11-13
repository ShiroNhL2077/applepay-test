import React from "react";
import "./InvoiceModal.css";
import { useSelector } from "react-redux";
import { formatDateFull } from "../../../utils/formatDateFull";

export default function Qrticket() {
  const { clickedInvoice, clickedTicket } = useSelector(
    (state) => state.orders
  );

  return (
    <div className="qr-body-box">
      <div className="qr-box-header w-100 d-flex text-center">
        <p className="col">{clickedTicket?.ticket?.name}</p>
        <div className="qr-box-ttl col d-flex flex-column">
          <span>{clickedInvoice?.event?.eventName}</span>
          <h7>{clickedInvoice?.event?.location}</h7>
          <h7>{formatDateFull(clickedInvoice?.orderDate)}</h7>
        </div>
        <p className="col">{clickedTicket?.ticket?.price} €</p>
      </div>
      <div className="qr-code-box">
      <img src={clickedTicket.qrCode} alt="QR Code" />
        <button className="btn qr-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.748 0H5.25229C3.96514 0 2.91797 1.04717 2.91797 2.33432V13.6657C2.91797 14.9528 3.96514 16 5.25229 16H10.748C12.0352 16 13.0823 14.9528 13.0823 13.6657V2.33432C13.0823 1.04717 12.0352 0 10.748 0ZM7.314 0.775884H8.68632C8.80354 0.775884 8.89853 0.87087 8.89853 0.988095C8.89853 1.10532 8.80354 1.20031 8.68632 1.20031H7.314C7.19677 1.20031 7.10179 1.10532 7.10179 0.988095C7.10179 0.87087 7.19677 0.775884 7.314 0.775884ZM8.00016 15.0506C7.6251 15.0506 7.32108 14.7466 7.32108 14.3715C7.32108 13.9965 7.6251 13.6925 8.00016 13.6925C8.37518 13.6925 8.67923 13.9965 8.67923 14.3715C8.67923 14.7466 8.37522 15.0506 8.00016 15.0506ZM12.0213 12.3201C12.0213 12.5536 11.8303 12.7446 11.5969 12.7446H4.40344C4.17001 12.7446 3.97902 12.5536 3.97902 12.3201V2.38868C3.97902 2.15525 4.17001 1.96426 4.40344 1.96426H11.5969C11.8303 1.96426 12.0213 2.15525 12.0213 2.38868V12.3201Z"
              fill="#64C3C5"
            />
          </svg>
          Infoline
        </button>
      </div>
      <div className="export-btn mt-4">
        <div className="exp-btn btn">
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.10899 6.91426L8.98836 5.03488V12.8792C8.98836 13.3695 9.31521 13.6964 9.80548 13.6964C10.2958 13.6964 10.6226 13.3695 10.6226 12.8792V5.03488L12.502 6.91426C12.8288 7.24111 13.3191 7.24111 13.646 6.91426C13.9728 6.58741 13.9728 6.09714 13.646 5.77029L10.3775 2.50181C10.2958 2.4201 10.214 2.33838 10.1323 2.33838C9.96891 2.25667 9.72377 2.25667 9.47864 2.33838C9.39692 2.33838 9.31521 2.4201 9.2335 2.50181L5.96502 5.77029C5.63817 6.09714 5.63817 6.58741 5.96502 6.91426C6.29187 7.24111 6.78214 7.24111 7.10899 6.91426ZM17.1596 12.0621C16.6693 12.0621 16.3424 12.389 16.3424 12.8792V16.1477C16.3424 16.638 16.0156 16.9648 15.5253 16.9648H4.08564C3.59537 16.9648 3.26852 16.638 3.26852 16.1477V12.8792C3.26852 12.389 2.94167 12.0621 2.4514 12.0621C1.96113 12.0621 1.63428 12.389 1.63428 12.8792V16.1477C1.63428 17.5368 2.69653 18.5991 4.08564 18.5991H15.5253C16.9144 18.5991 17.9767 17.5368 17.9767 16.1477V12.8792C17.9767 12.389 17.6498 12.0621 17.1596 12.0621Z"
              fill="white"
            />
          </svg>
          export
        </div>
      </div>
    </div>
  );
}
