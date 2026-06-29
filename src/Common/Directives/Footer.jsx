import React from "react";
import { motion } from "framer-motion";
import "../Styles/Footer.css";
import logo from "../../assetsPage/assets/logo.png";
import location from "../../assetsPage/assets/footer/location.png";
import call from "../../assetsPage/assets/footer/call.png";
import mail from "../../assetsPage/assets/footer/mail.png";
import { HashLink } from "react-router-hash-link";
import footerone from "../../assetsPage/assets/footer/gglfooter.png"
import footertwo from "../../assetsPage/assets/footer/gglfootertwo.png"
import footerthree from "../../assetsPage/assets/footer/gglfooterthree.png"



const Footer = () => {
  return (
    <div className="nova-wrapper tagline-top">

      {/* Partner Logos */}
      <div className="nova-partner-row">
        <img src={footerone} alt="logo" />
        <img src={footertwo} alt="logo" />
        <img src={footerthree} alt="logo" />
      </div>

      {/* Heading */}
      <div className="nova-footer-heading">
        <h2>
          Real Estate - <span>Ab Sab Ke Liye</span>
        </h2>
      </div>


      {/* Footer Section */}
      <footer className="nova-footer">
        <div className="nova-footer-top">

          <div className="nova-brand-area">
            <h3 className="nova-logo">
              <img src={logo} alt="logo" />
            </h3>

            <p className="nova-brand-desc">
              GGL Unitra offers a seamless avenue for establishing a
              cutting-edge investment platform without necessitating coding
              expertise within a short time.
            </p>

            {/* <div className="nova-social-row">
              <span className="nova-social-icon">
                <i className="fa-brands fa-instagram"></i>
              </span>

              <span className="nova-social-icon">
               <i className="fa-brands fa-facebook-f"></i>
              </span>

              <span className="nova-social-icon">
                <i className="fa-brands fa-linkedin"></i>
              </span>

              <span className="nova-social-icon">
                <i className="fa-brands fa-twitter"></i>
              </span>
            </div> */}
            <div className="nova-social-row">
              <a
                href="https://www.instagram.com/gangotriglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="nova-social-icon"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              <a
                href="https://www.facebook.com/gangotriglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="nova-social-icon"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>

              <a
                href="https://www.linkedin.com/in/adesh-saxena-744212101/"
                target="_blank"
                rel="noopener noreferrer"
                className="nova-social-icon"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>

              <a
                href="https://x.com/GangotriG91657"
                target="_blank"
                rel="noopener noreferrer"
                className="nova-social-icon"
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a
                href="https://www.youtube.com/@gangotriglobal2738"
                target="_blank"
                rel="noopener noreferrer"
                className="nova-social-icon"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>


          <div className="nova-link-grid">

            <div className="nova-col">
              <h4 className="nova-col-title">Company</h4>

              <nav className="nova-nav">
                <span><HashLink smooth to="/">Home</HashLink></span>
                <span><HashLink smooth to="/about-us">About Us</HashLink></span>
                <span><HashLink smooth to="/#portfolio">Property</HashLink></span>
                <span><HashLink smooth to="/gallery">Gallery</HashLink></span>
                <span><HashLink smooth to="/blog">Blog</HashLink></span>
              </nav>
            </div>


            <div className="nova-col">
              <h4 className="nova-col-title">Legal</h4>

              <nav className="nova-nav">
                <span><HashLink smooth to="/terms-and-conditions">Terms & Conditions</HashLink></span>

                <span><HashLink smooth to="/privacy-policy">Privacy Policy</HashLink></span>
                <span><HashLink smooth to="/disclaimer">Disclaimer</HashLink></span>
              </nav>
            </div>


            <div className="nova-col">
              <h4 className="nova-col-title">Contact us</h4>

              <div className="nova-contact-info">

                <p>
                  <img src={location} alt="loc" />
                  Andreas R38, Nehru Enclave, Gomti Nagar, Lucknow, Uttar Pradesh
                </p>

                <p className="nova-upcoming-row">
                  <img src={location} alt="loc"/>
                  corporate office: B-1, PBM Building, H-169, H Block, Sector 63, Noida-201301
                  <span className="nova-upcoming">UPCOMING</span>
                </p>

                <p className="nova-upcoming-row">
                  <img src={location} alt="loc" />
                  Andreas R38, Nehru Enclave, Gomti Nagar, Udaipur, Rajasthan
                  <span className="nova-upcoming">UPCOMING</span>
                </p>

                <p>
                  <img src={mail} alt="mail" />
                  info@gglunitra.com
                </p>

                {/* <p>
                  <img src={call} alt="call"/>
                  +918953840000 , +918953840000
                </p> */}

              </div>
            </div>

          </div>
        </div>


        <div className="nova-footer-bottom">
          <p className="nova-copyright">
            © 2026 <span>GGL UNITRA.</span> All Rights Reserved
          </p>

          <div className="nova-legal-links">
            <span>Privacy Policy</span>
            <span className="nova-divider"></span>
            <span>Terms of Service</span>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default Footer;