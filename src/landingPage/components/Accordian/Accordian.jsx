import { React, useState } from "react";
import "./Accordian.css";

const Accordian = ({ data }) => {
  const [selected, setSelected] = useState(null);

  const toggle = (i) => {
    if (selected === i) {
      return setSelected(null);
    }

    setSelected(i);
  };

  if (!data) {
    return;
  }

  return (
    <>
      <div className="outerfaq">
        <div className="firstrow">
          <div className="seperator">
            <div id="lineaboutus1FAQ"></div>
            <div id="lineaboutus2FAQ"></div>
          </div>
          <div className="wrapper">
            <div className="accordion">
              {data.map((item, i) => (
                <div className="item" key={i}>
                  <div className="ac_title" onClick={() => toggle(i)}>
                    <h2 className="faq_question">{item.question}</h2>
                    <span>{selected === i ? "-" : "+"}</span>
                  </div>
                  <div
                    className={selected === i ? "contentt show" : "contentt"}
                  >
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <ShapedWave /> */}
    </>
  );
};

export default Accordian;
