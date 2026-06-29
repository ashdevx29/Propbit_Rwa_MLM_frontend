import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import avtar from "../../assetsPage/assets/S3WhyChoose/avtarone.png";
import avtarone from "../../assetsPage/assets/S3WhyChoose/avtartwo.png";
import avtartwo from "../../assetsPage/assets/S3WhyChoose/avtarthree.png";
import avtarthree from "../../assetsPage/assets/S3WhyChoose/avtarfour.png";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { BiSolidQuoteRight } from "react-icons/bi";

const testimonials = [
  {
    text: "The platform makes real estate investing simple and accessible. The transparency and structured documentation gave me confidence from day one.",
    name: "Ayesha K.",
    location: "Mumbai, India",
    image: avtar,
  },
  {
    text: "I love how easy it is to diversify investments. Everything is clearly explained and the process is extremely smooth.",
    name: "Daniel M.",
    location: "London",
    image: avtarone,
  },
  {
    text: "Finally a platform where real estate feels accessible to everyone. The experience has been transparent and reliable.",
    name: "Priya S.",
    location: "Mumbai",
    image: avtartwo,
  },
  {
    text: "Professional team and excellent communication. The dashboard makes tracking investments very easy.",
    name: "Michael T.",
    location: "Dubai",
    image: avtarthree,
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FAFFFD] w-full py-8 sm:py-16 md:py-20 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20">

      {/* Badge */}
      <div className="text-center mb-3 sm:mb-4">
        <span className="bg-[#DCFCE7] text-[#1A3C34] px-4 sm:px-5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
          Success Stories
        </span>
      </div>

      {/* Heading */}
      <h2 className="max-w-[600px] mx-auto text-center text-xl text-[#0F172A]  sm:text-2xl lg:text-3xl font-[400] droxen-font mb-10 sm:mb-12 lg:mb-16 leading-tight">
        HEAR FROM OUR GLOBAL{" "}
        <span className="text-[#0082ED]">INVESTORS</span>
      </h2>

      {/* Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center border-b border-gray-300 pb-8 sm:pb-10 lg:pb-12">

        {/* LEFT */}
        <div className="text-center lg:text-left">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.2] font-[700] text-[#1A1A1A] max-w-[570px]">
            Trusted by Over 5,000+ Investors
          </h3>

          {/* Stepper */}
          <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <span
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-[3px] w-[20px] sm:w-[28px] rounded-full cursor-pointer transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] border border-[#85EEB31A]"
                    : "bg-white border border-[#6F6B62]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >

              {/* Quote */}
              <p className="text-sm md:text-base lg:text-lg  text-[#4B5563] relative text-center lg:text-left">

                {/* Quote Icon */}
                <span className="hidden lg:block text-xl bg-[#E6FDFF] text-[#0082ED] absolute -left-6 -top-5">
                  <BiSolidQuoteLeft />
                </span>

                {testimonials[activeIndex].text}

                <span className="hidden lg:inline text-xl bg-[#E6FDFF] text-[#0082ED] ml-4">
                 <BiSolidQuoteRight />
                </span>
              </p>

              {/* Author */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-6 lg:mt-12">
                <img
                  src={testimonials[activeIndex].image}
                  alt="user"
                  className="w-[32px] h-[32px] sm:w-[45px] sm:h-[45px] rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-[400] text-[#212121] text-sm sm:text-lg">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-xs font-[400] sm:text-base text-[#8B8989]">
                    {testimonials[activeIndex].location}
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}


