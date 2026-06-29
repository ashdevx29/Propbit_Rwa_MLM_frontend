import React, { useState, useEffect } from "react";
import "../Styles/S2HowWorks.css";
import browse from "../../assetsPage/assets/S2HowWorks/browse1.png";
import invest from "../../assetsPage/assets/S2HowWorks/invest11.png";
import sell from "../../assetsPage/assets/S2HowWorks/earn.png"
const DATA = [
  {
    id: "browse",
    tag: "Choose Your Asset",
    heading: "Browse a curated portfolio of premium real estate opportunities.",
    description:
     "Each listing provides complete property details, projected rental yield, valuation certificates, and SPV documentation to help you make informed investment decisions.",
    img: browse,
  },
  {
    id: "invest",
    tag: "Invest Your Fraction",
    heading: "Earn monthly income and track your portfolio growth.",
    // description:
    //   "Select your investment amount, complete digital KYC, and receive your legally documented fractional units. Your name. Your ownership. Transparent, SEBI-aligned, and professionally managed by GGL.",
    description:
  "Select your investment amount, complete digital KYC, and receive your legally documented fractional units. Your name. Your ownership. Transparent, regulatory-aligned, and professionally managed by GGL.",
    img: invest,
  },
  {
    id: "manage",
    tag: "Earn & Grow",
    heading: "Earn monthly income and track your portfolio growth.",
    description: "Receive monthly rental income to your account. Monitor via the real-time dashboard. Access seamless trading options, participate in community governance, and earn loyalty rewards as your portfolio compounds.",
    // description: "Receive monthly rental income to your account. Monitor via the real-time dashboard. Trade on SMEIIT TradeX, participate in community governance, and earn loyalty rewards as your portfolio compounds.",
    img: sell,
  },
];

const S2HowWorks = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DATA.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextIndex = (activeIndex + 1) % DATA.length;

  return (
    <section id="how-it-work" className="how-works-wrapper">
      <div className="works-header-section">
        <div className="works-badge">HOW IT WORKS</div>
        <h1 className="works-heading">
          <span className="highlight">Real estate </span>  investing made simple —
          <br className="desktop-break"></br>
          FULLY DIGITAL. FULLY FRACTIONAL. FULLY SECURE.
        </h1>
      </div>

   
      <div className="how-works-container">
        {/* LEFT CONTENT */}
        <div className="how-works-left">
          {/* Active */}
          <div key={activeIndex} className="active-content">
            <span className="step-tag">{DATA[activeIndex].tag}</span>
            <h2 className="step-heading">{DATA[activeIndex].heading}</h2>
            <p className="step-description">{DATA[activeIndex].description}</p>
          </div>

          {/* Hold */}
          <div key={nextIndex} className="hold-content">
            <span className="step-tagg">{DATA[nextIndex].tag}</span>
            <h3 className="step-heading small">{DATA[nextIndex].heading}</h3>
          </div>
        </div>

        {/* RIGHT IMAGE (Direct Image No Container) */}
        {/* <div className="how-works-right">
          <img
            key={activeIndex}
            src={DATA[activeIndex].img}
            alt="section visual"
            className="dynamic-image"
          />
        </div> */}
        <div className="how-works-right">
  {/* <div className="image-wrapper">
    <img
      key={activeIndex}
      src={DATA[activeIndex]?.img || null}
      alt="section visual"
      className="dynamic-image"
    />
  </div> */}
  <div className="image-wrapper">
  {DATA.map((item, index) => (
    <img
      key={item.id}
      src={item.img}
      alt="section visual"
      className={`dynamic-image ${
        index === activeIndex ? "active" : ""
      }`}
    />
  ))}
</div>
</div>
      </div>
    </section>
  );
};

export default S2HowWorks;
