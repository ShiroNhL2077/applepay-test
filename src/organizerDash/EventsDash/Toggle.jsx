import React from "react";

import "./Toggle.css";

const Toggle = ({ toggled, action }) => {
  return (
    <label className="toggle_label">
      <input
        className="toggle_input"
        type="checkbox"
        checked={toggled}
        onChange={action}
      />
      <span className="toggle_span" />
    </label>
  );
};

export default Toggle;
