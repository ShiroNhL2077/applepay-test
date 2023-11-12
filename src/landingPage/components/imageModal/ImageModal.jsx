import React from "react";
import { InputGroup, Form, Modal } from "react-bootstrap";

export default function ImageModal({ imageUrl, closeModal, isModalOpen }) {
  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        // className="signin_modal"
        show={isModalOpen}
        onHide={closeModal}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="d-flex justify-content-center flex-column items-center">
          <img src={imageUrl} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center mb-4"></Modal.Footer>
      </Modal>
    </>
  );
}
