import React from "react";
import { motion } from "framer-motion";
import footer from "../../assetsPage/assets/footer11.png";
import appstore from "../../assetsPage/assets/Apple Desktop.png";
import playstore from "../../assetsPage/assets/google-play.png";

export default function Download() {
  return (
    <section className="bg-white lg:pt-20 px-3 lg:px-6 xl:px-20 py-10 overflow-hidden">

      {/* APP CARD */}
      <div
        className="
        relative w-full mx-auto bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] rounded-[40px]
        px-3 md:px-6 lg:px-[65px] pt-6

        flex flex-col lg:flex-row
        items-center lg:items-start

        h-auto lg:h-[450px]
        py-10 lg:py-0
      "
      >

        {/* LEFT CONTENT */}
        <div className="flex-1 max-w-[410px] mt-4 sm:mt-6 w-full z-10 text-center lg:text-left">

          <p className="text-black text-[22px] sm:text-[28px] lg:text-[36px] font-normal tracking-wide">
            Download our app
          </p>

          <h2 className="text-white text-[24px] sm:text-[30px] md:text-[36px] lg:text-[48px] font-normal leading-[1.2] mt-4">
            The Modern Way to Invest in Real Estate
          </h2>

          <p className="text-black text-sm sm:text-[15px] md:text-[16px] opacity-90 mt-5 mb-8">
            Track investments, monitor fractions, download reports, and explore
            new opportunities — all from your mobile device.
          </p>

          {/* STORE BUTTONS */}
          <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
            <img
              src={appstore}
              alt="appstore"
              className="h-[42px] sm:h-[46px] lg:h-[48px] cursor-pointer hover:scale-105 transition"
            />
            <img
              src={playstore}
              alt="playstore"
              className="h-[42px] sm:h-[46px] lg:h-[48px] cursor-pointer hover:scale-105 transition"
            />
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div
          className="
          relative lg:absolute
          right-0 bottom-0
          lg:right-10 lg:bottom-5

          mt-8 lg:mt-0
          flex justify-center w-full lg:w-auto
        "
        >
          <motion.div
            initial={{ rotateY: -25, rotateX: 10, opacity: 0 }}
            whileInView={{ rotateY: -15, rotateX: 5, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <img
              src={footer}
              alt="phone"
              className="
              w-[200px] sm:w-[260px] md:w-[320px]
              lg:w-[480px] xl:w-[506px]
              object-contain
            "
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}












// import React from "react";
// import { motion } from "framer-motion";
// import footer from "../../assetsPage/assets/footer11.png";
// import appstore from "../../assetsPage/assets/Apple Desktop.png";
// import playstore from "../../assetsPage/assets/google-play.png";

// export default function Download() {
//   return (
//     <section className="bg-white lg:pt-24 px-3 lg:px-6 xl:px-20 py-10 overflow-hidden">

//       {/* APP CARD */}
//       <div className="relative w-full  mx-auto bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] rounded-[40px] 
//       h-[450px] flex items-center px-6 md:px-10 lg:px-[65px] pt-5
//       max-lg:h-auto max-lg:flex-col max-lg:text-center max-lg:py-4  max-lg:py-12">

//         {/* LEFT CONTENT */}
//         <div className="flex-1 mb-6 lg:mb-0">

//           <p className="text-black text-[26px] sm:text-[30px] lg:text-[36px] font-normal tracking-wide">
//             Download our app
//           </p>

//           <h2 className="text-white text-[26px] sm:text-[32px] lg:text-[48px] font-normal leading-[1.2] mt-4 max-w-[450px] mx-auto md:mx-0">
//             The Modern Way to Invest in Real Estate
//           </h2>

//           <p className="text-black text-sm sm:text-[16px] opacity-90 mt-5 mb-8 max-w-[430px] mx-auto md:mx-0">
//             Track investments, monitor fractions, download reports, and explore
//             new opportunities — all from your mobile device.
//           </p>

//           {/* STORE BUTTONS */}

//           <div className="flex gap-4 justify-center md:justify-start flex-wrap">
//             <img
//               src={appstore}
//               alt="appstore"
//               className="h-[45px] sm:h-[48px] cursor-pointer hover:scale-105 transition"
//             />
//             <img
//               src={playstore}
//               alt="playstore"
//               className="h-[45px] sm:h-[48px] cursor-pointer hover:scale-105 transition"
//             />
//           </div>

//         </div>

//         {/* RIGHT IMAGE (3D PHONE) */}
//        <div className="absolute right-0 bottom-0 lg:right-10 md:bottom-5 pointer-events-none">
//           <motion.div
//             initial={{ rotateY: -25, rotateX: 10, opacity: 0 }}
//             whileInView={{ rotateY: -15, rotateX: 5, opacity: 1 }}
//             transition={{ duration: 1.2 }}
//             className="relative"
//           >
//             <img
//               src={footer}
//               alt="phone"
//               className="w-[220px] sm:w-[430px] lg:w-[480px] xl:w-[506px] object-contain"
//             />
//           </motion.div>
//         </div>

//       </div>
//     </section>
//   );
// }



// import React from "react";
// import { motion } from "framer-motion";
// import "../Styles/Footer.css";
// import footer from "../../assetsPage/assets/footer11.png";
// import appstore from "../../assetsPage/assets/Apple Desktop.png";
// import playstore from "../../assetsPage/assets/google-play.png";


// const Download = () => {
//   return (
//     <div className="nova-wrapper">
      
//       {/* 3D App Banner */}
//       <section className="nova-app-card">
//         <div className="nova-content-side">
//           <span className="nova-tag">Download our app</span>
//           <h2 className="nova-hero-title">
//             The Modern Way to Invest in Real Estate
//           </h2>

//           <p className="nova-hero-subtitle">
//             Track investments, monitor fractions, download reports, and explore
//             new opportunities — all from your mobile device.
//           </p>

//           <div className="nova-market-links">
//             <img
//               src={appstore}
//               alt="App Store"
//               className="nova-store-img"
//             />
//             <img
//               src={playstore}
//               alt="Play Store"
//               className="nova-store-img"
//             />
//           </div>
//         </div>

//         <div className="nova-visual-side">
//           <motion.div
//             className="nova-phone-container"
//             initial={{ rotateY: -25, rotateX: 10, opacity: 0 }}
//             whileInView={{ rotateY: -15, rotateX: 5, opacity: 1 }}
//             transition={{ duration: 1.2 }}
//           >
//             <img src={footer} alt="phone" className="nova-phone-img" />
//           </motion.div>
//         </div>
//       </section>
//       </div>
//       )};

//       export default Download;