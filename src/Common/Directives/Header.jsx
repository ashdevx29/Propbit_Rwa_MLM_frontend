import React, { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import "../Styles/Header.css";
import logo from "../../assetsPage/assets/logo.png";
import signin from "../../assetsPage/assets/Header/signin.png";
import signup from "../../assetsPage/assets/Header/signup.png";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <HashLink smooth to="/" className="nav-logo">
        <img src={logo} alt="logo" className="logo-image" />
      </HashLink>

      {/* Nav Links */}
      <ul
        className={isMobile ? "nav-links-mobile" : "nav-links"}
        onClick={() => setIsMobile(false)}
      >
        <li className="menu"><HashLink smooth to="/">Home</HashLink></li>
        <li className="menu"><HashLink smooth to="/about-us">About</HashLink></li>
        <li className="menu"><HashLink smooth to="/#portfolio">Properties</HashLink></li>
        <li className="menu"><HashLink smooth to="/gallery">Gallery</HashLink></li>
        <li className="menu"><HashLink smooth to="/blog">Blog</HashLink></li>
        <li className="menu"><HashLink smooth to="/contact">Contact</HashLink></li>

        {/* Mobile Buttons */}
        <li className="btn-signin-mobile">
          <Link to="/user/login">Sign In <img src={signin} alt="" /></Link>
        </li>
        <li className="btn-signup-mobile">
          <Link to="/user/signup"> Sign Up <img src={signup} alt="" /></Link>
        </li>
      </ul>

      {/* Auth Buttons (Tablet me show honge) */}
      <div className="nav-auth responsive-auth">
        <Link to="/user/login" className="btn-signin">
          Sign In <img src={signin} alt="" />
        </Link>
        <Link to="/user/signup" className="btn-signup">
          Sign Up <img src={signup} alt="" />
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? "✕" : "☰"}
      </button>

    </nav>
  );
};

export default Navbar;










// import React, { useState } from 'react';
// import { HashLink } from "react-router-hash-link";
// import '../Styles/Header.css';
// import logo from '../../assetsPage/assets/logo.png';
// import signin from '../../assetsPage/assets/Header/signin.png';
// import signup from '../../assetsPage/assets/Header/signup.png';
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   return (
//     <nav className="navbar">
//       {/* Logo */}
//       <div className="nav-logo">
//         <HashLink smooth to="/">
//           <img src={logo} alt="GGL Logo" className="logo-image" />
//         </HashLink>
//       </div>

//       {/* Navigation Links */}
//       <ul
//         className={isMobile ? "nav-links-mobile" : "nav-links"}
//         onClick={() => setIsMobile(false)}
//       >
//         <li>
//           <HashLink smooth to="/">
//             Home
//           </HashLink>
//         </li>
//         <li>
//           <HashLink smooth to="/about-us">
//             About
//           </HashLink>
//         </li>
//         <li>
//           <HashLink smooth to="/#portfolio">
//             Properties
//           </HashLink>
//         </li>
//         <li>
//           <HashLink smooth to="/gallery">
//             Gallery
//           </HashLink>
//         </li>
//          <li>
//           <HashLink smooth to="/blog">
//             Blog
//           </HashLink>
//         </li>
//         <li>
//           <HashLink smooth to="/contact">
//             Contact
//           </HashLink>
//         </li>
//         <li className="btn-signin-mobile">
//           <Link to="/user/login">
//             Sign In
//           </Link>
//         </li>
//         <li className="btn-signup-mobile">
//           <Link to="/user/signup">
//             Sign Up
//           </Link>
//         </li>
//       </ul>

      

//       {/* Auth Buttons */}
//       {/* <div className="nav-auth">
//         <Link to="/user/login" className="btn-signin">
//           Sign In{" "}
//           <img src={signin} alt="Sign In Icon" className="signin-icon" />
//         </Link>
//         <Link to="/user/signup" className="btn-signup">
//           Sign Up{" "}
//           <img src={signup} alt="Sign Up Icon" className="signup-icon" />
//         </Link>
//       </div>

    
//       <button
//         className="mobile-menu-icon"
//         onClick={() => setIsMobile(!isMobile)}
//       >
//         {isMobile ? "✕" : "☰"}
//       </button> */}

//       <div className="nav-auth responsive-auth">
//   <Link to="/user/login" className="btn-signin">
//     Sign In <img src={signin} alt="" />
//   </Link>
//   <Link to="/user/signup" className="btn-signup">
//     Sign Up <img src={signup} alt="" />
//   </Link>
// </div>

// <button
//   className="mobile-menu-icon"
//   onClick={() => setIsMobile(!isMobile)}
// >
//   {isMobile ? "✕" : "☰"}
// </button>
//     </nav>
//   );
// };

// export default Navbar;