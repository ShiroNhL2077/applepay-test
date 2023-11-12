import React, { useEffect, useState } from "react";
import "./MobileOrder.css";
import { Modal } from "react-bootstrap";
import { addItemsToCart } from "../../../redux/actions/cartAction";
import { useDispatch, useSelector } from "react-redux";

export default function MobileOrder({
  isMobile,
  setIsMobile,
  eventData,
  cartItems,
  handleIncrement,
  handleDecrement,
  getTotalPrice,
}) {
  const dispatch = useDispatch();
  const {initialCartItems, inititalCartEvent} = useSelector((state) => state.cart);
  const [dslbtn, setDslBtn] = useState(false);

  const handleCloseModal = () => {
    setIsMobile(false);
  };

  useEffect(() => {
    if (initialCartItems?.length > 0 || inititalCartEvent) {
      setDslBtn(true);
    } else {
      setDslBtn(false);
    }
  }, [initialCartItems, inititalCartEvent]);

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="mobile-cart_modal"
        show={isMobile}
        onHide={handleCloseModal} // Attach the onHide event handler
      >
        <Modal.Header closeButton onClick={handleCloseModal}>
          <Modal.Title>ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center flex-column align-items-center gap-4">
          <div className="mobile-table">
            {cartItems.map((item, i) => (
              <div className="mobile-table-details" key={i}>
                <p>{item.name} :</p>
                <span>{item.price} €</span>
                <span class="input-wrapper">
                  <button
                    id="decrement"
                    onClick={() => handleDecrement(i)}
                    disabled={item.orderQty === 1}
                  >
                    -
                  </button>
                  <input type="number" value={item.orderQty} id="quantity" />
                  <button id="increment" onClick={() => handleIncrement(i)}>
                    +
                  </button>
                </span>
              </div>
            ))}
          </div>
          <div className="mobile-total-box ">
            <p>total</p>
            <span>{getTotalPrice(cartItems)} €</span>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center flex-column gap-2 mb-4">
          <button
            className="btn modal-cart_btn"
            onClick={() => {
              dispatch(addItemsToCart(cartItems, eventData));
              handleCloseModal();
            }}
            disabled={dslbtn}
          >
            <svg
              width="18"
              height="17"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_527_12738)">
                <path
                  d="M16.6898 3.25798C16.542 3.07063 16.3535 2.91931 16.1387 2.81545C15.9239 2.71159 15.6882 2.65791 15.4496 2.65846H4.7631L4.3629 0.955854C4.33567 0.84011 4.27012 0.736967 4.17689 0.663169C4.08366 0.58937 3.96822 0.549248 3.84932 0.549316H1.74018C1.60033 0.549316 1.46621 0.60487 1.36733 0.703755C1.26844 0.80264 1.21289 0.936757 1.21289 1.0766C1.21289 1.21645 1.26844 1.35056 1.36733 1.44945C1.46621 1.54833 1.60033 1.60389 1.74018 1.60389H3.43171L5.29566 9.52688C4.88917 9.56015 4.51135 9.74956 4.24148 10.0554C3.97161 10.3612 3.83065 10.7596 3.84818 11.1671C3.86571 11.5745 4.04036 11.9594 4.3355 12.2409C4.63064 12.5224 5.02332 12.6786 5.43118 12.6769H14.395C14.5349 12.6769 14.669 12.6213 14.7679 12.5225C14.8668 12.4236 14.9223 12.2894 14.9223 12.1496C14.9223 12.0098 14.8668 11.8756 14.7679 11.7768C14.669 11.6779 14.5349 11.6223 14.395 11.6223H5.43118C5.29133 11.6223 5.15721 11.5668 5.05833 11.4679C4.95944 11.369 4.90389 11.2349 4.90389 11.095C4.90389 10.9552 4.95944 10.8211 5.05833 10.7222C5.15721 10.6233 5.29133 10.5677 5.43118 10.5677H14.3328C14.6896 10.5687 15.0361 10.4485 15.3158 10.227C15.5954 10.0055 15.7917 9.69564 15.8725 9.34813L16.9898 4.60256C17.045 4.37036 17.0466 4.12865 16.9947 3.89572C16.9427 3.66278 16.8384 3.44471 16.6898 3.25798Z"
                  fill="white"
                />
                <path
                  d="M12.8143 16.3681C13.6879 16.3681 14.3961 15.6598 14.3961 14.7862C14.3961 13.9126 13.6879 13.2043 12.8143 13.2043C11.9406 13.2043 11.2324 13.9126 11.2324 14.7862C11.2324 15.6598 11.9406 16.3681 12.8143 16.3681Z"
                  fill="white"
                />
                <path
                  d="M7.01154 16.3681C7.88518 16.3681 8.5934 15.6598 8.5934 14.7862C8.5934 13.9126 7.88518 13.2043 7.01154 13.2043C6.13791 13.2043 5.42969 13.9126 5.42969 14.7862C5.42969 15.6598 6.13791 16.3681 7.01154 16.3681Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_527_12738">
                  <rect
                    width="16.8731"
                    height="16.8731"
                    fill="white"
                    transform="translate(0.685547 0.0224609)"
                  />
                </clipPath>
              </defs>
            </svg>
            Add to cart
          </button>
          <button
            className="btn modal-cart_btn"
            style={{
              background: "white",
              color: "#444790",
              border: "0.80px #444790 solid",
            }}
          >
            Checkout
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
