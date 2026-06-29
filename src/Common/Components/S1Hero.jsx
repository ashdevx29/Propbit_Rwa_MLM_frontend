import React from 'react';
import '../Styles/S1Hero.css';
import left from '../../assetsPage/assets/S1Hero/VIDEO.mp4';
import { FiArrowRight } from "react-icons/fi";
import { IoPlayCircleSharp } from "react-icons/io5";

const S1Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="typing-text">REAL ESTATE AB SAB KE LIYE </span>
        </div>
        {/* Heading */}
        <h2 className="hero-title">
          Transforming Real Estate Into <span className="text-highlight">Future Wealth</span>
        </h2>

        {/* Description */}
        <p className="hero-description">
          Build wealth through professionally managed properties, enjoy passive income, and invest in premium real estate with complete transparency and ease.
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button className="btn-primary">
            Explore Properties <FiArrowRight />
          </button>
          <a href="#how-it-work">
            <button className="btn-secondary">
              <IoPlayCircleSharp size={24} /> How it Works
            </button>
          </a>
          {/* <button className="btn-secondary">
            <IoPlayCircleSharp size={24} /> How it Works
          </button> */}
        </div>
      </div>

      {/* Hero Image Section with Floating Cards */}
      <div className="hero-image-wrapper">
        <video
          src={left}
          className="main-building"
          autoPlay
          loop
          muted
          playsInline
        />





      </div>



    </section>



  );
};

export default S1Hero;

