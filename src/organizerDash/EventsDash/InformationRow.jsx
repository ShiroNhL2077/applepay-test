import React, { useState } from "react";
import Toggle from "./Toggle";

function InformationRow({ label }) {
  const [infoOptional, setInfoOptional] = useState(true);

  const toggleInfoOptional = () => {
    setInfoOptional(!infoOptional);
  };

  return (
    <div className="_information_row row mb-4">
      <div className="col-6 d-flex flex-column justify-content-center">
        <p className="_label">{label}</p>
      </div>
      <div className="col-3 d-flex justify-content-center align-items-center">
        <Toggle toggled={infoOptional} action={toggleInfoOptional} />
      </div>
      <div className="col-3 d-flex justify-content-center align-items-center">
        <Toggle toggled={!infoOptional} action={toggleInfoOptional} />
      </div>
    </div>
  );
}

export default InformationRow;
