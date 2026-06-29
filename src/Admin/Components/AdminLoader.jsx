import "../../Styles/AdminStyles/Adminloader.css";
import React from "react";

import Logo from "../../assets/propbit/icon 1.png";

const Loader = () => {
  return (
    <div className="full-loader-overlay">
      <div className="loader-container">
        
        <div className="main-content">

          {/* Ring + Logo */}
          <div className="ring-wrapper">
            <svg className="progress-ring" width="100%" height="100%" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E8A6" />
                  <stop offset="100%" stopColor="#0082ED" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <circle cx="180" cy="180" r="148" fill="none" stroke="#E7EEF6" strokeWidth="14"/>
              <circle 
                cx="180" 
                cy="180" 
                r="148" 
                fill="none" 
                stroke="url(#loaderGrad)" 
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="930"
                strokeDashoffset="160"
                className="animated-ring"
                filter="url(#glow)"
              />
            </svg>

            <div className="orbit">
              <div className="dot"></div>
            </div>

            <div className="logo-box">
              <img src={Logo} alt="PropBit" />
            </div>
          </div>

          <h2 className="loading-text">Loading<span>.</span><span>.</span><span>.</span></h2>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Loader;





