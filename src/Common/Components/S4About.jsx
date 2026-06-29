import React, { useRef, useState, useEffect } from "react";
import video from "../../assetsPage/assets/S4About/video.mp4";
import icon from "../../assetsPage/assets/S4About/Icon.png";
import { Link } from "react-router-dom";


const AboutSection = () => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const vid = videoRef.current;

    const updateProgress = () => {
      if (!vid || !vid.duration) return;
      const percent = (vid.currentTime / vid.duration) * 100;
      if (progressRef.current) {
        progressRef.current.style.width = percent + "%";
      }
    };

    vid.addEventListener("timeupdate", updateProgress);
    return () => vid.removeEventListener("timeupdate", updateProgress);
  }, []);

  const toggleVideo = () => {
    const vid = videoRef.current;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="" className="w-full px-3 md:px-6 lg:px-8 xl:px-24 py-4 md:py-12 ">

      {/* Header */}
      <div className="text-left md:text-center mb-6 md:mb-14">
        <span className="bg-[#DCFCE7]  text-[#1A3C34] px-4 py-1 font-[600]  rounded-full text-xs tracking-widest font-[Poppins]">
          ABOUT US
        </span>

        <h2 className=" mt-5 lg:mt-8 text-xl text-[#0F172A]  sm:text-2xl lg:text-3xl font-[400] droxen-font tracking-wide">
          ABOUT OUR{" "}
          <span className="text-[#0082ED]">
            REAL ESTATE PLATFORM
          </span>
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-10">

        {/* Left */}
        <div className="w-full md:w-[45%] lg:w-[55%]">
          <h3 className="text-2xl lg:text-3xl font-[500] mb-6 font-[Gued] text-[#000]">
            Finding Great Properties for Smart Investors
          </h3>

          <p className="text-[#4B5563] text-sm sm:text-base lg:text-lg leading-relaxed mb-6 max-w-full md:max-w-md font-[Gued] md:mb-10">
            Over 11 years, GGL has grown from a Lucknow-based developer into one of Uttar Pradesh's most recognised and trusted real estate brands, with a portfolio spanning residential townships, commercial complexes, and hospitality developments.
          </p>

          <Link to="/about-us">
            <button className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-400 transition px-8 py-3 rounded-full shadow-lg text-black font-medium">
              Learn More
            </button>
          </Link>
        </div>

        {/* Right */}
        <div className="w-full md:w-[55%] lg:w-[45%] relative">

          {/* Video */}
          <div className="rounded-xl overflow-hidden relative">
            <video
              ref={videoRef}
              src={video}
              autoPlay
              muted
              loop
              className="w-full h-[250px] md:h-[300px] lg:h-[389px] object-cover"
            />

            {/* Controls */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 w-[85%]">

              <button
                onClick={toggleVideo}
                className="bg-black/60 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm"
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <div className="flex-1 h-[6px] bg-white/50 rounded overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-white transition-all"
                  style={{ width: "0%" }}
                ></div>
              </div>

            </div>
          </div>

          {/* Floating Card */}
          <div className="absolute top-[8%] left-[-10px] md:left-[-25%] rotate-[-15deg] bg-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-3">

            <div className="bg-green-100 p-2 rounded">
              <img src={icon} alt="" className="sm:w-5 sm:h-5 w-2 h-2" />
            </div>

            <div>
              <p className="text-[10px] sm:text-xs text-[#6B7280] font-[400]">Average Profit</p>
              <p className="text-xs sm:text-sm text-[#0F172A] font-[700]">Upto 20%</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;






