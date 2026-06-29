import React from "react";
import "../Styles/S1Secondsection.css";

const statsData = [
  {
    code: "BRIHO",
    growth: "11.32%",
    label: "Noida Rental Land",
  },
  {
    code: "HPLIO",
    growth: "18.76%",
    label: "Lucknow Prime Land",
  },
  {
    code: "GIHHO",
    growth: "14.09%",
    label: "Noida  Holiday Homes",
  },
  {
    code: "IIO",
    growth: "28.36%",
    label: "India Investment Opportunity",
  },
  {
    code: "KHHIO",
    growth: "10.03%",
    label: "Lucknow Holiday Homes",
  },
];

const S1Secondsection = () => {
  return (
    <div className="stats-strip">
      <div className="stats-container">
        {[...statsData, ...statsData].map((item, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-top">
              <span className="stat-code">{item.code}</span>
              <span className="stat-growth">
                ▲ {item.growth}
              </span>
            </div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default S1Secondsection;