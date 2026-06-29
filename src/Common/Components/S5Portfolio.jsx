import React, { useRef, useEffect } from "react";
import properties from "../../assetsPage/assets/S5Portfolio/properties.png";
import cardone from "../assets/portfolio/1.png";
import cardtwo from "../assets/portfolio/2.png";
import card3 from "../assets/portfolio/3.png";
import card4 from "../assets/portfolio/4.png";
import card5 from "../assets/portfolio/5.png";
import card6 from "../assets/portfolio/6.png";
import card7 from "../assets/portfolio/7.png";
import card8 from "../assets/reletedproperty/8.png";
import card9 from "../assets/portfolio/9.png";

import bedsIcon from "../../assetsPage/assets/S5Portfolio/first.png";
import bath from "../../assetsPage/assets/S5Portfolio/second.png";
import sqft from "../../assetsPage/assets/S5Portfolio/thierd.png";
import avtar from "../../assetsPage/assets/S5Portfolio/avtar.jpg";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { GrLocation } from "react-icons/gr";

const propertyData = [
  {
    id: "Gangotri City",
    category: "Properties",
    mainHeading: "INVEST IN GANGOTRI CITY, LUCKNOW",
    description:
      "Own premium residential plots in Gangotri City, a rapidly developing area of Lucknow with strong future growth potential.",
    location: "Lucknow, India",
    totalPrice: "8,500,000",
    return: "14% - 18%",
    img: cardone,
  },
  {
    id: "Orbit City",
    category: "Properties",
    mainHeading: "INVEST IN ORBIT CITY, LUCKNOW",
    description:
      "Secure your investment in Orbit City, offering well-planned plots in one of Lucknow’s emerging residential zones.",
    location: "Lucknow, India",
    totalPrice: "12,200,000",
    return: "12% - 15%",
    img: cardtwo,
  },
  {
    id: "Golden Grove Houses",
    category: "Properties",
    mainHeading: "INVEST IN GOLDEN GROVE HOUSES, LUCKNOW",
    description:
      "Experience modern living with Golden Grove Houses, featuring premium housing options in a prime Lucknow location.",
    location: "Lucknow, India",
    totalPrice: "8,500,000",
    return: "14% - 18%",
    img: card3,
  },
  {
    id: "Calisto City",
    category: "Properties",
    mainHeading: "INVEST IN CALISTO CITY, LUCKNOW",
    description:
      "Calisto City offers well-designed residential plots with excellent connectivity and high appreciation potential.",
    location: "Lucknow, India",
    totalPrice: "12,200,000",
    return: "12% - 15%",
    img: card4,
  },
  {
    id: "Krishna Garden",
    category: "Properties",
    mainHeading: "INVEST IN KRISHNA GARDEN, SHAHJAHANPUR",
    description:
      "Krishna Garden provides affordable residential plots in Shahjahanpur, ideal for long-term investment and peaceful living.",
    location: "Shahjahanpur, India",
    totalPrice: "8,500,000",
    return: "14% - 18%",
    img: card5,
  },
  {
    id: "Farmhouse Project Malihabad",
    category: "Properties",
    mainHeading: "INVEST IN FARMHOUSE PROJECT, MALIHABAD",
    description:
      "Own a farmhouse in Malihabad near Lucknow, perfect for nature living, weekend homes, and future land appreciation.",
    location: "Malihabad, Lucknow, India",
    totalPrice: "12,200,000",
    return: "12% - 15%",
    img: card6,
  },
  {
    id: "Farm Villas Udaipur",
    category: "Properties",
    mainHeading: "INVEST IN FARM VILLAS, UDAIPUR",
    description:
      "Premium farm villas in Udaipur offering luxury living amidst nature with excellent tourism and investment value.",
    location: "Udaipur, Rajasthan, India",
    totalPrice: "8,500,000",
    return: "14% - 18%",
    img: card7,
  },
  {
    id: "City Gate LDA Approved",
    category: "Properties",
    mainHeading: "INVEST IN CITY GATE (LDA APPROVED), LUCKNOW",
    description:
      "Upcoming LDA-approved City Gate project in Lucknow ensuring legal security, modern planning, and high returns.",
    location: "Lucknow, India",
    totalPrice: "12,200,000",
    return: "12% - 15%",
    img: card8,
  },
  {
    id: "Gangotri Row Houses",
    category: "Properties",
    mainHeading: "GANGOTRI ROW HOUSES, VRINDAVAN (SOLD OUT)",
    description:
      "Fully sold-out premium row houses project in Vrindavan, Lucknow, showcasing strong demand and successful investment returns.",
    location: "Vrindavan, Lucknow, India",
    totalPrice: "8,500,000",
    return: "14% - 18%",
    img: card9,
  },
];

const S5Portfolio = () => {
  const sliderRef = useRef(null);
 const indexRef = useRef(1);

  const extendedData = [
    propertyData[propertyData.length - 1],
    ...propertyData,
    propertyData[0],
  ];

  // const slideLeft = () => {
  //   indexRef.current =
  //     indexRef.current === 0
  //       ? propertyData.length - 1
  //       : indexRef.current - 1;

  //   sliderRef.current.style.transform = `translateX(-${indexRef.current * 100
  //     }%)`;
  // };

  const slideLeft = () => {
  indexRef.current -= 1;

  sliderRef.current.style.transition = "transform 0.7s ease";
  sliderRef.current.style.transform = `translateX(-${indexRef.current * 100}%)`;

  if (indexRef.current === 0) {
    setTimeout(() => {
      sliderRef.current.style.transition = "none";
      indexRef.current = extendedData.length - 2;
      sliderRef.current.style.transform = `translateX(-${indexRef.current * 100}%)`;
    }, 700);
  }
};

  // const slideRight = () => {
  //   if (indexRef.current < propertyData.length - 1) {
  //     indexRef.current += 1;

  //     sliderRef.current.style.transform = `translateX(-${indexRef.current * 100
  //       }%)`;
  //   }
  // };

  const slideRight = () => {
  indexRef.current += 1;

  sliderRef.current.style.transition = "transform 0.7s ease";
  sliderRef.current.style.transform = `translateX(-${indexRef.current * 100}%)`;

  if (indexRef.current === extendedData.length - 1) {
    setTimeout(() => {
      sliderRef.current.style.transition = "none";
      indexRef.current = 1;
      sliderRef.current.style.transform = `translateX(-100%)`;
    }, 700);
  }
};

  useEffect(() => {
  sliderRef.current.style.transform = `translateX(-100%)`;

  const auto = setInterval(() => slideRight(), 4000);
  return () => clearInterval(auto);
}, []);

  // useEffect(() => {
  //   const auto = setInterval(() => {
  //     if (indexRef.current < propertyData.length - 1) {
  //       slideRight();
  //     }
  //   }, 4000);

  //   return () => clearInterval(auto);
  // }, []);

  return (
    <section className="w-full bg-[#F1F5F9CC] px-3 md:px-6 lg:px-8 xl:px-20 py-4 md:py-12 overflow-visible mb-3">

      {/* TOP */}
      <div className="text-left md:text-center mb-6 md:mb-8">
        <span className="bg-[#DCFCE7]  text-[#1A3C34] sm:px-4 px-2 py-1 font-[600]  rounded-full text-[10px] sm:text-xs tracking-widest font-[Poppins]">
          Leading Digital Real Estate Platform
        </span>

        <h2 className="mt-5 lg:mt-8 text-xl text-[#0F172A]  sm:text-2xl lg:text-3xl font-[400] droxen-font tracking-wide">
          Build a <span className="text-[#0082ED]">global</span> and diversified
          <br /> real estate portfolio
        </h2>
      </div>

      <div className="mb-5">
        <div className="relative inline-block">

          <div className="inline-flex items-center gap-2 border border-[#4ADD97] bg-[#85EEB31A] px-5 py-1 rounded-full relative">

            <img
              src={properties}
              className="absolute -top-5 -left-1 w-12 z-50"
            />

            <span className="pl-7 text-sm">
              {extendedData[indexRef.current].category}
            </span>

          </div>

        </div>
      </div>

      {/* SLIDER */}
      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex transition-all duration-700"
        >
          {extendedData.map((data, i) => (
            <div key={data.id} className="min-w-full">

              {/* HEADER */}
              <div>
                {/* Heading Row */}

                <div className="grid sm:grid-cols-[1.2fr_0.8fr_auto] md:grid-cols-[1.2fr_1fr_auto] items-center gap-3 sm:gap-6 mt-1">

                  {/* LEFT - HEADING */}
                  <h2 className=" text-lg sm:text-base md:text-xl lg:text-2xl droxen-font text-[#0F172A] leading-[1.4] max-w-full sm:max-w-[340px] lg:max-w-[400px]">
                    {data.mainHeading}
                  </h2>

                  {/* CENTER - DESCRIPTION */}
                  <p className="text-[#4B5563] text-base sm:text-sm lg:text-lg leading-[1.4] max-w-full sm:max-w-[240px] lg:max-w-[420px]">
                    {data.description}
                  </p>

                  {/* RIGHT - BUTTON + ARROWS */}
                  <div className="flex flex-col items-start sm:items-center gap-4 justify-end">

                    <button className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#0F172A] px-6 py-3 rounded-full text-sm lg:text-base shadow-[0px_8px_10px_-6px_#14532D33,0px_20px_25px_-5px_#14532D33] hover:bg-green-400 transition flex items-center gap-2">
                      Discover More <FaArrowRight />
                    </button>

                  </div>

                </div>
              </div>

              <div className=" mt-10">

                {/* ARROWS */}
                <div className="flex justify-end mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={slideLeft}
                      className="w-9 h-9 rounded-full bg-white border border-[#6FE0AA6B] shadow-[inset_0px_0px_13px_0px_#4ADD9740] flex items-center justify-center"
                    >
                      <FaArrowLeft />
                    </button>

                    <button
                      onClick={slideRight}
                      className="w-9 h-9 rounded-full bg-white border border-[#6FE0AA6B] shadow-[inset_0px_0px_13px_0px_#4ADD9740] flex items-center justify-center"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
                {/* CARD */}
                <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center mt-2">

                  {/* IMAGE */}
                  <div className="h-[320px] md:h-[480px] lg:h-[511px] border border-[#E2E8F0] rounded-2xl">
                    <img
                      src={data.img}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  {/* INFO CARD */}
                  <div className="bg-[#4ADD970F] border border-[#85EEB399] rounded-2xl p-3 sm:p-6 md:p-8 relative h-full flex flex-col justify-between">

                    <div className="absolute text-[#000000] xl:top-8 xl:right-8 lg:top-6 lg:right-6  top-4 right-4 text-base md:text-xl "><MdOutlineBookmarkBorder /></div>

                    <div>
                      <h4 className="text-xl lg:text-3xl text-[#0F172A] font-[600] mb-1">{data.id}</h4>
                      <p className="flex items-center gap-2 text-[#0F172A] text-sm sm:text-base font-[400] lg:text-lg mb-5 lg:mb-8">
                        <GrLocation className="text-lg" />
                        <span>{data.location}</span>
                      </p>

                      {/* FEATURES */}
                      <div className="flex gap-3 flex-wrap justify-between  mb-2">
                        <span className="bg-[#FFFFFF] px-6 py-2 rounded-full flex text-[#0F172A] items-center gap-1 text-sm">
                          <img src={bedsIcon} className="w-3" /> 4 Beds
                        </span>
                        <span className="bg-[#FFFFFF] px-6 py-2 rounded-full flex text-[#0F172A] items-center gap-1 text-sm">
                          <img src={bath} className="w-3" /> 3 Baths
                        </span>
                        <span className="bg-[#FFFFFF] px-6 py-2 rounded-full flex text-[#0F172A] items-center gap-1 text-sm">
                          <img src={sqft} className="w-3" /> 1868 sqft
                        </span>
                      </div>

                      {/* PRICE */}
                      <div className="flex justify-between items-center pt-5 mb-5">

                        <div>
                          <p className="text-xs font-[400] text-[#64748B] mb-1">PRICE</p>
                          <h3 className="text-sm xs:text-base sm:text-xl xl:text-3xl font-[400] text-[#000000]">
                            INR {data.totalPrice}
                          </h3>
                        </div>

                        <div className="bg-white px-10 py-1 rounded-full text-center border border-[#00C86952]">
                          <p className="text-[10px] sm:text-sm text-[#64748B] uppercase font-[400]">
                            Expected Return
                          </p>
                          <p className="text-[#14532D] font-[400] text-base sm:text-2xl lg:text-3xl">
                            {data.return}
                          </p>
                        </div>

                      </div>

                      {/* AGENT */}
                      <div className="flex  items-center justify-between bg-white  px-2 sm:px-4 py-1 sm:py-3 rounded-full mt-5 lg:mt-10 mb-5">

                        <div className="flex items-center gap-3">
                          <img
                            src={avtar}
                            className="sm:w-12 sm:h-12 w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-[400] text-[#0F172A">
                              Amelia Stephenson
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#64748B]">
                              Premier Agent • 12 years <br />exp.
                            </p>
                          </div>
                        </div>

                        <button className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000000] font-[400] px-2 py-1 sm:px-6 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm">
                          Send Enquiry
                        </button>

                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] shadow-[0px_20px_25px_0px_#14532D33] py-3 text-sm sm:text-base text-[#000000] rounded-full font-medium hover:bg-green-400 transition">
                      Request Property Brochure
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default S5Portfolio;





