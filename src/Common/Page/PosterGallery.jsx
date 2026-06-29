import React, { useEffect, useRef, useState } from "react";
import "../Styles/PosterGallery.css";
import Header from "../Directives/Header";
import TopStats from "../Components/TopStats";
import videotop from "../assets/contactpage/contactbg.mp4";
import Footer from "../Directives/Footer";

import poster1 from "../assets/gallery/firstphoto.jpg";
import poster2 from "../assets/gallery/second.jpg";
import poster3 from "../assets/gallery/thirdphoto.jpg";
import poster4 from "../assets/gallery/fourth.jpg";
import poster5 from "../assets/gallery/fifthphoto.jpg";
import poster6 from "../assets/gallery/sixthphoto.jpg";
import poster7 from "../assets/gallery/seventhphoto.jpg";

import pgposter1 from "../assets/gallery/photo/1.png";
import pgposter2 from "../assets/gallery/photo/2.png";
import pgposter3 from "../assets/gallery/pg-three.jpeg";
import pgposter4 from "../assets/gallery/photo/3.png";
import pgposter5 from "../assets/gallery/photo/4.png";
import pgposter6 from "../assets/gallery/photo/5.png";
import pgposter7 from "../assets/gallery/photo/6.png";
import pgposter8 from "../assets/gallery/photo/7.png";
import pgposter9 from "../assets/gallery/photo/8.png";
import pgposter10 from "../assets/gallery/photo/9.png";
import pgposter11 from "../assets/gallery/photo/10.png";
import pgposter12 from "../assets/gallery/photo/11.png";


import video1 from "../../assetsPage/assets/S4About/video.mp4";
import video2 from "../../assetsPage/assets/S4About/video.mp4";
import video3 from "../../assetsPage/assets/S4About/video.mp4";
import video4 from "../../assetsPage/assets/S4About/video.mp4";
import video5 from "../../assetsPage/assets/S4About/video.mp4";

/* DATA */
const posters = [poster1, poster2, poster1, poster2];

const photoGallery = [
  { img: pgposter1, title: "Skyline Heights" },
  { img: pgposter2, title: "Azure Residences" },
  { img: pgposter3, title: "Tower Elite" },
  { img: pgposter4, title: "Skyline Heights" },
  { img: pgposter5, title: "Azure Residences" },
  { img: pgposter6, title: "Tower Elite" },
  { img: pgposter7, title: "Azure Residences" },
  { img: pgposter8, title: "Tower Elite" },
  { img: pgposter9, title: "Skyline Heights" },
  { img: pgposter10, title: "Azure Residences" },
  { img: pgposter11, title: "Tower Elite" },
  { img: pgposter12, title: "Tower Elite" },
];

const videoGallery = [
  { video: video1, thumb: poster3, title: "Residential Tower", desc: "A complete walk-through..." },
  { video: video2, thumb: poster4, title: "Luxury Villa", desc: "Explore luxury architecture..." },
  { video: video3, thumb: poster5, title: "Urban Residences", desc: "Discover elevated city living..." },
  { video: video4, thumb: poster6, title: "Commercial Space", desc: "Modern commercial projects..." },
  { video: video5, thumb: poster7, title: "Premium Living", desc: "Experience architectural elegance..." },
];

const PosterGallery = () => {

  /* RESPONSIVE */
  const [slideMove, setSlideMove] = useState(50);
  const [galleryMove, setGalleryMove] = useState(33.3333);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 600) {
        setSlideMove(100);
        setGalleryMove(100);
      } else if (window.innerWidth <= 991) {
        setSlideMove(50);
        setGalleryMove(50);
      } else {
        setSlideMove(50);
        setGalleryMove(33.3333);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* REFS */
  const posterRef = useRef(null);
  const photoRef = useRef(null);
  const videoRef = useRef(null);

  const posterIndex = useRef(1);
  const photoIndex = useRef(photoGallery.length);
const videoIndex = useRef(videoGallery.length);
  // const photoIndex = useRef(1);
  // const videoIndex = useRef(1);

  /* EXTENDED DATA */
  const extendedPosters = [
  ...posters,
  ...posters,
  ...posters
];
  const extendedPhotos = [
    ...photoGallery,
    ...photoGallery,
    ...photoGallery
  ];
  const extendedVideos = [
    ...videoGallery,
    ...videoGallery,
    ...videoGallery
  ];

  // const videoIndex = useRef(videoGallery.length);
  // const photoIndex = useRef(photoGallery.length);

  /* INIT POSITION */
  useEffect(() => {
    posterRef.current.style.transform = `translateX(-${slideMove}%)`;
    // photoRef.current.style.transform = `translateX(-${galleryMove}%)`;
    // videoRef.current.style.transform = `translateX(-${galleryMove}%)`;
  }, [slideMove]);

  useEffect(() => {
  if (!posterRef.current) return;

  posterRef.current.style.transform =
    `translateX(-${posterIndex.current * slideMove}%)`;
}, [slideMove]);

  useEffect(() => {
    videoRef.current.style.transform = `translateX(-${videoIndex.current * galleryMove}%)`;
    photoRef.current.style.transform = `translateX(-${photoIndex.current * galleryMove}%)`;
  }, [galleryMove]);

  

  /* UNIVERSAL SLIDER */
  // const infiniteSlide = (ref, indexRef, length, move) => {
  //   indexRef.current++;

  //   ref.current.style.transition = "transform 0.7s ease";
  //   ref.current.style.transform = `translateX(-${indexRef.current * move}%)`;

  //   if (indexRef.current === length - 1) {
  //     setTimeout(() => {
  //       ref.current.style.transition = "none";
  //       indexRef.current = 1;
  //       ref.current.style.transform = `translateX(-${move}%)`;
  //     }, 700);
  //   }
  // };
  const infiniteSlide = (ref, indexRef, length, move, originalLength) => {
  if (!ref.current) return;

  indexRef.current++;

  ref.current.style.transition = "transform 0.6s linear";
  ref.current.style.transform = `translateX(-${indexRef.current * move}%)`;

  if (indexRef.current >= originalLength * 2) {
    setTimeout(() => {
      ref.current.style.transition = "none";
      indexRef.current = originalLength;

      ref.current.style.transform =
        `translateX(-${indexRef.current * move}%)`;
    }, 600);
  }
};


  // const infiniteSlide = (ref, indexRef, length, move, originalLength) => {
  //   if (!ref.current) return;

  //   indexRef.current++;

  //   ref.current.style.transition = "transform 0.6s linear";
  //   ref.current.style.transform = `translateX(-${indexRef.current * move}%)`;

  //   if (indexRef.current >= originalLength * 2) {
  //     setTimeout(() => {
  //       ref.current.style.transition = "none";
  //       indexRef.current = originalLength;
  //       ref.current.style.transform = `translateX(-${indexRef.current * move}%)`;
  //     }, 600);
  //   }
  // };


  /* AUTO SLIDERS */
useEffect(() => {
  const a = setInterval(() => {
    infiniteSlide(
      posterRef,
      posterIndex,
      extendedPosters.length,
      slideMove,
      posters.length
    );
  }, 2500);

  return () => clearInterval(a);
}, [slideMove]);

useEffect(() => {
  const slider = setInterval(() => {
    infiniteSlide(
      photoRef,
      photoIndex,
      extendedPhotos.length,   // ✅ ye missing tha
      galleryMove,
      photoGallery.length
    );
  }, 2800);

  return () => clearInterval(slider);
}, [galleryMove]);

  useEffect(() => {
    const c = setInterval(() => {
      infiniteSlide(
        videoRef,
        videoIndex,
        extendedVideos.length,
        galleryMove,
        videoGallery.length
      );
    }, 2800);

    return () => clearInterval(c);
  }, [galleryMove]);

  /* MODAL */
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "auto";
  }, [activeVideo]);

  return (
    <>
      <TopStats />
      <Header />

      <div className="pg-page">

        {/* BANNER */}
        <div className="pg-banner">
          <video className="pg-video" autoPlay muted loop playsInline>
            <source src={videotop} type="video/mp4" />
          </video>
          <div className="pg-breadcrumb">HOME / GALLERY</div>
        </div>

        {/* POSTER */}
        <div className="poster-gallery-wrapper">
          <div className="pg-header">
            <div className="pg-heading">
              <h2>Poster Gallery</h2>
              <p>
                Explore our portfolio of residential and commercial projects, thoughtfully developed to deliver modern lifestyles and accessible real estate investment opportunities.
              </p>
            </div>
            <button className="pg-add-btn">
              <i className="fa-solid fa-circle-plus"></i> Add Poster
            </button>
          </div>

          <div className="pg-slider">
            <div className="pg-track" ref={posterRef}>
              {extendedPosters.map((img, index) => (
                <div className="pg-slide-item" key={index}>
                  <div className="pg-card">
                    <img src={img} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PHOTO */}
        <div className="lg-wrap">
          <div className="lg-box">
            <div className="lg-head">
              <div className="lg-head-left">
                <h2>Photo Gallery</h2>
                <p>Discover our curated collection of luxury residential and commercial
                  developments. Architecturally significant spaces designed for modern living.</p>
              </div>
              <button className="pg-add-btn">+ Add Photo</button>
            </div>

            <div className="lg-photo-slider">
              <div className="lg-photo-track" ref={photoRef}>
                {extendedPhotos.map((item, index) => (
                  <div className="lg-photo-card" key={index}>
                    <img src={item.img} alt="" />
                    <div className="lg-photo-overlay">
                      {/* <span className="lg-tag">RESIDENTIAL</span>
                      <h4>{item.title}</h4> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VIDEO */}
          <div className="lg-box">
            <div className="lg-head">
              <div className="lg-head-left">
                <h2>Video Gallery</h2>
                <p>Discover our curated collection of luxury residential and commercial
                  developments. Architecturally significant spaces designed for modern living.</p>
              </div>
              <button className="pg-add-btn">+ Add Video</button>
            </div>

            <div className="lg-video-slider">
              <div className="lg-video-track" ref={videoRef}>
                {extendedVideos.map((video, index) => (
                  <div className="lg-video-card" key={index}>
                    <div className="lg-video-thumb">
                      <video
                        src={video.video}
                        muted
                        autoPlay
                        loop
                        className="lg-video-file"
                        poster={video.thumb}
                      />

                      <button
                        className="lg-play-btn"
                        onClick={() => setActiveVideo(video.video)}
                      >
                        <i className="fa-solid fa-play"></i>
                      </button>
                    </div>

                    <div className="lg-video-info">
                      <span className="lg-mini-tag">RESIDENTIAL</span>
                      <h4>{video.title}</h4>
                      <p>{video.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg-view-more-wrap">
              <button className="lg-view-more-btn">
                View More <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {activeVideo && (
          <div className="lg-modal" onClick={() => setActiveVideo(null)}>
            <div className="lg-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="lg-close-btn" onClick={() => setActiveVideo(null)}>✕</button>
              <video src={activeVideo} controls autoPlay className="lg-modal-video" />
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default PosterGallery;


