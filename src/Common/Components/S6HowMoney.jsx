import React from "react";
import "../Styles/S6HowMoney.css";
import bg from "../../assetsPage/assets/bgrealstate.png"
import avtar from "../../assetsPage/assets/avtar.jpg"
      
export default function BlogOpportunity() {
  return (
    <section className="ggl-blog-section">

      <div className="ggl-blog-header">

        <span className="ggl-blog-tag">BLOGS</span>

        <h2 className="ggl-blog-heading">
         Where Property<br></br> Meets  <span>Opportunity</span>
        </h2>

      </div>


      <div className="ggl-blog-card">

        <img
          src={bg}
          alt="property"
          className="ggl-blog-bg"
        />


        {/* LEFT CONTENT */}

        <div className="ggl-blog-content">

          <p className="ggl-blog-category">Market Trends</p>

          <h3>
          The Future of Luxury Real Estate in  <span>2026</span>
          </h3>

          <p className="ggl-blog-desc">
            Discover the shifting dynamics of global property markets and
            how sustainable architecture is becoming the primary driver
            for luxury developments.
          </p>


          <div className="ggl-blog-author">

            <img
              src={avtar}
              alt="author"
            />

            <div>
              <h4>Snehal Bajaj</h4>
              <span>Chief Market Analyst</span>
            </div>

          </div>


          <button className="ggl-blog-btn">
            Read Article →
          </button>

        </div>


        {/* RIGHT TEXT */}

        <div className="ggl-blog-overlay">

          <h3>Real Estate Ab Sab Ke Liye</h3>
          <p>A Gangotri Global Ltd.</p>

        </div>

      </div>

    </section>
  );
}