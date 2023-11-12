import React from "react";

export default function StepFive() {
  return (
    <div className="step_five_container d-flex flex-column align-items-center">
      <svg
        width="60"
        height="60"
        viewBox="0 0 87 87"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="43.5" cy="43.5" r="43.5" fill="#64C56E" />
        <path
          d="M60.3903 31.6042C59.5751 30.7986 58.268 30.7986 57.4529 31.6042L39.1586 49.9682L29.5453 40.301C28.7348 39.4859 27.4183 39.4859 26.6079 40.301C25.7974 41.116 25.7974 42.4398 26.6079 43.2548L37.7063 54.3826C38.0857 54.783 38.6104 55.0044 39.1586 54.9997C39.7161 55.0091 40.2548 54.783 40.6437 54.3826L60.3903 34.5251C61.1914 33.7336 61.2054 32.4428 60.4184 31.6325C60.409 31.623 60.3996 31.6136 60.3903 31.6042Z"
          fill="white"
        />
      </svg>
      <p className="_label">
        Your event was created and is
        <br />
        ready to publish
      </p>
    </div>
  );
}
