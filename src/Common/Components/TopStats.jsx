import React from "react";
import "../Styles/TopStats.css";

export default function GGLStatsStrip() {
  return (
    <div className="gglra-stats-strip-wrapper">
      <div className="gglra-stats-strip-container">

        <div className="gglra-stats-strip-item">
          <h4>2014</h4>
          <p>YEAR ESTABLISHED</p>
        </div>

        <div className="gglra-stats-strip-item">
          <h4>ISO</h4>
          <p>9001:2008 CERTIFIED</p>
        </div>

        <div className="gglra-stats-strip-item">
          <h4>10+</h4>
          <p>LANDMARK PROJECTS</p>
        </div>

        <div className="gglra-stats-strip-item">
          <h4>11+</h4>
          <p>YEARS OF EXCELLENCE</p>
        </div>

        <div className="gglra-stats-strip-item">
          <h4>2</h4>
          <p>MARKETS - INDIA & DUBAI</p>
        </div>

      </div>
    </div>
  );
}