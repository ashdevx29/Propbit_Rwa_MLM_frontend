import React from "react";
import Header from "../Directives/Header.jsx"
import Footer from "../Directives/Footer.jsx"
import TopStats from "../Components/TopStats.jsx"
import bgImg from "../assets/aboutpage/section-one-bg.jpg"
import { FiGlobe } from "react-icons/fi";
import sec2img from "../assets/aboutpage/sec2img.png"

import { LuShieldCheck } from "react-icons/lu";
import { LuNewspaper } from "react-icons/lu";
import { MdOutlineSchool } from "react-icons/md";
import { LuLeaf } from "react-icons/lu";


import { FiTarget, FiUsers } from "react-icons/fi";

import img1 from "../assets/aboutpage/card1.jpg";
import img2 from "../assets/aboutpage/card2.jpg";
import img3 from "../assets/aboutpage/card3.jpg";

import { FiAward } from "react-icons/fi";


const milestones = [
    {
        icon: <LuShieldCheck size={30} />,
        title: "ISO 9001:2008",
        desc: "Certified Quality Management",
        bg: "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]",
    },
    {
        icon: <LuNewspaper size={30} />,
        title: "Gangotri Express",
        desc: "Statewide Newspaper across UP",
        bg: "bg-[#94D8FF]",
    },
    {
        icon: <MdOutlineSchool size={30} />,
        title: "GRDS Scholarships",
        desc: "100% Financial Assistance",
        bg: "bg-[#FFE3BF]",
    },
    {
        icon: <LuLeaf size={30} />,
        title: "35% Green Areas",
        desc: "Sustainable Development",
        bg: "bg-[#BBADFF]",
    },
];

const timelineData = [
    {
        year: "2005",
        title: "Gangotri EXPRESS Founded",
        desc: "Launched statewide newspaper across Uttar Pradesh, strengthening community connections.",
        side: "right",
    },
    {
        year: "2014",
        title: "GGL Establishment",
        desc: "Gangotri Global Limited established in Lucknow with a vision to deliver quality real estate.",
        side: "left",
    },
    {
        year: "2018",
        title: "GRDS Scholarship Launch",
        desc: "Initiated scholarship programme providing 100% financial assistance for Engineering and Medical students.",
        side: "right",
    },
    {
        year: "2022",
        title: "International Expansion",
        desc: "Expanded operations to Dubai, establishing global presence.",
        side: "left",
    },
    {
        year: "2026",
        title: "Trusted Brand",
        desc: "Recognized as one of UP’s most trusted real estate brands with diverse portfolio.",
        side: "right",
    },
];

const data = [
    {
        img: img1,
        title: "Residential Townships",
        desc: "Premium residential communities designed for modern living with world-class amenities.",
    },
    {
        img: img2,
        title: "Commercial Complexes",
        desc: "Strategic commercial spaces built to drive business growth and success.",
    },
    {
        img: img3,
        title: "Hospitality Developments",
        desc: "Luxury hospitality projects combining comfort, elegance, and exceptional service.",
    },
];





const AboutPage = () => {


    return (

        <div className="w-full">

            <TopStats />
            <Header />

            {/* ================= HERO SECTION ================= */}

            <section className="relative  w-full py-16 overflow-hidden">

                {/* Background Image */}
                <img
                    src={bgImg}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#4BDD96_0%,#4ADA94_9.09%,#48D691_18.18%,#47D38F_27.27%,#46D08D_36.36%,#45CC8B_45.45%,#43C988_54.55%,#42C686_63.64%,#41C384_72.73%,#40BF81_81.82%,#3EBC7F_90.91%,#3DB97D_100%)] opacity-90"></div>

                {/* Content */}
                <div className="relative max-w-full mx-auto px-3 sm:px-5 lg:px-20">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#FFFFFF33] backdrop-blur-md px-4 py-2 rounded-full text-white font-[400] text-sm mb-6">
                        <FiGlobe />
                        India + Dubai
                    </div>

                    {/* Heading */}
                    <h2 className="text-white text-3xl md:text-5xl font-[400] mb-6">
                        Gangotri Global Limited
                    </h2>

                    {/* Description */}
                    <p className="text-white/90 max-w-[745px] text-sm sm:text-lg lg:text-xl font-[400] leading-relaxed mb-8">
                        Established in 2014 in Lucknow, Uttar Pradesh, with a singular purpose: to deliver quality real estate that exceeds customer expectations while upholding the highest standards of professional ethics and community development.
                    </p>

                    {/* Stats Cards */}
                    <div className="flex flex-wrap gap-6">

                        <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-41 text-white">
                            <h3 className="text-3xl  font-[300]">14+</h3>
                            <p className="text-sm mt-2 text-white/80">Years of Excellence</p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-41 text-white">
                            <h3 className="text-3xl font-[300]">2</h3>
                            <p className="text-sm mt-2 text-white/80">
                                Countries <br /> India • Dubai
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-41 text-white">
                            <h3 className="text-3xl font-[300]">1000+</h3>
                            <p className="text-sm mt-2 text-white/80">
                                Properties Delivered
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-41 text-white">
                            <h3 className="text-xl sm:text-3xl font-[400]">5000+</h3>
                            <p className="text-sm mt-2  text-white/80">
                                Happy Families
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            <section className="w-full  py-12">
                <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20 grid lg:grid-cols-[47%_47%] gap-6 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div>

                        {/* Tag */}
                        <span className="text-[#4BDD96] bg-[#F0FDF4] px-6 py-3 rounded-full text-xs font-[400]">
                            OUR STORY
                        </span>

                        {/* Heading */}
                        <h2 className="md:text-4xl text-2xl  text-[#0F172A] font-[400] mt-4 mb-4">
                            Beyond Bricks and Mortar
                        </h2>

                        {/* Paragraphs */}
                        <p className="text-[#4B5563] font-[400] text-sm sm:text-[16px] mb-2 lg:mb-5 leading-relaxed">
                            Over 14 years, GGL has grown from a Lucknow-based developer into
                            one of Uttar Pradesh's most recognised and trusted real estate
                            brands, with a portfolio spanning residential townships,
                            commercial complexes, and hospitality developments.
                        </p>

                        <p className="text-[#4B5563] font-[400] text-sm sm:text-[16px] mb-2 lg:mb-5 leading-relaxed">
                            Ganesha Global’s philosophy has always extended beyond bricks
                            and mortar. The founders of Ganesha EXPRESS in 2005 — a statewide
                            newspaper across UP — and the GRDS Scholarship Programme
                            providing 100% financial assistance for Engineering and Medical
                            students are testaments to GGL's enduring commitment to community
                            empowerment.
                        </p>

                        <p className="text-[#4B5563] font-[400] text-sm sm:text-[16px] mb-2 lg:mb-5 leading-relaxed">
                            We believe in creating spaces that don’t just provide shelter,
                            but foster communities, enable growth and contribute to a
                            sustainable future. Our commitment to maintaining 35% green
                            areas in all our developments reflects our dedication to
                            environmental responsibility.
                        </p>
                    </div>



                    {/* Right Image */}
                    <div className="w-full">
                        <img
                            src={sec2img}
                            className="rounded-2xl w-full sm:h-[600px]  lg:h-[600px] object-cover"
                            alt="about"
                        />
                    </div>


                </div>
            </section>

            <section className="w-full py-8 ">
                <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">

                    {/* Top Heading */}
                    <div className="text-center mb-12">
                        <span className="text-[#4BDD96] bg-[#F0FDF4] px-5 py-2 rounded-full text-xs font-medium">
                            ACHIEVEMENTS
                        </span>

                        <h2 className="text-2xl md:text-4xl font-[400] text-[#0F172A] mt-4">
                            Our Milestones
                        </h2>

                        <p className="text-[#64748B] mt-3 text-lg font-[400] md:text-base">
                            Recognized for excellence and committed to giving back to the community.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {milestones.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border border-[#E2E8F0] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] rounded-2xl p-8 text-center hover:shadow-md transition"
                            >
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full text-white ${item.bg}`}
                                >
                                    {item.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-[#0F172A] text-lg font-[400] mt-6">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[#64748B] text-sm font-[400] mt-1">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <section className="w-full py-8 ">
                <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">

                    {/* Top Heading */}
                    <div className="text-center mb-12">
                        <span className="text-[#4BDD96] bg-[#F0FDF4] px-5 py-2 rounded-full text-xs font-medium">
                            OUR PURPOSE
                        </span>

                        <h2 className="text-3xl md:text-4xl font-[400] text-[#0F172A] mt-4">
                            Vision & Mission
                        </h2>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Vision Card */}
                        <div className="relative p-6 md:p-10 rounded-3xl text-white overflow-hidden bg-[linear-gradient(135deg,#4BDD96_0%,#4ADA94_9.09%,#48D691_18.18%,#47D38F_27.27%,#46D08D_36.36%,#45CC8B_45.45%,#43C988_54.55%,#42C686_63.64%,#41C384_72.73%,#40BF81_81.82%,#3EBC7F_90.91%,#3DB97D_100%)]">

                            {/* Icon */}
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FFFFFF33] mb-6">
                                <FiTarget size={32} />
                            </div>

                            <p className="text-sm uppercase font-[400] tracking-wider text-[#FFFFFFCC] mb-2">
                                Vision
                            </p>

                            <h3 className="text-2xl md:text-3xl font-[400] mb-4">
                                Real Estate – For Everyone
                            </h3>

                            <p className="text-sm sm:text-[16px] font-[300]  text-white leading-relaxed ">
                                To become India’s most trusted Real estate investment platform –
                                making premium income-generating real estate accessible to every investor,
                                regardless of wealth or geography.
                            </p>

                            {/* Decorative Circle */}
                            <div className="absolute top-6 right-6 text-white/10 text-7xl">
                                <FiTarget />
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="relative p-8 md:p-10 rounded-3xl text-white overflow-hidden bg-[linear-gradient(135deg,#0F172A_0%,#11192C_12.5%,#131B2E_25%,#141E30_37.5%,#162032_50%,#182235_62.5%,#1A2437_75%,#1C2739_87.5%,#1E293B_100%)]">

                            {/* Icon */}
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FFFFFF33] mb-6">
                                <FiUsers size={32} />
                            </div>

                            <p className="text-sm uppercase font-[400] tracking-wider text-[#FFFFFFCC] mb-2">
                                Mission
                            </p>

                            <h3 className="text-2xl md:text-3xl font-[400] mb-4">
                                Build Wealth. Build Communities.
                            </h3>

                            <p className="text-sm sm:text-[16px] font-[300] text-white leading-relaxed">
                                To leverage Gangotri Global’s 11 years of expertise, community trust,
                                and existing portfolio—delivering a transparent regulatory-compliant platform
                                generating real passive income for retail HNI and NRI investors.
                            </p>

                            {/* <p className="text-sm sm:text-[16px] font-[300]  text-white leading-relaxed ">
                                To leverage Gangotri Global’s 11 years of expertise, community trust,
                                and existing portfolio—delivering a transparent SEBI-compliant platform
                                generating real passive income for retail HNI and NRI investors.
                            </p> */}

                            {/* Decorative Icon */}
                            <div className="absolute top-6 right-6 text-white/10 text-7xl">
                                <FiUsers />
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            <section className="w-full py-8">
                <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">

                    {/* Heading */}
                    <div className="text-center mb-10">
                        <span className="text-[#4BDD96] bg-[#F0FDF4] px-5 py-2 rounded-full text-xs font-medium">
                            OUR JOURNEY
                        </span>

                        <h2 className="text-2xl md:text-4xl font-[400] text-[#0F172A] mt-4">
                            Milestones Through The Years
                        </h2>
                    </div>

                    {/* Timeline */}
                    <div className="relative">

                        {/* Center Line */}
                        <div className="absolute left-4 sm:left-1/2 top-0 sm:-translate-x-1/2 w-[3px] h-full bg-[#E2E8F0]"></div>

                        {/* Items */}
                        <div className="space-y-16">
                            {timelineData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center ${item.side === "left" ? "justify-start" : "justify-end"
                                        }`}
                                >

                                    {/* Card */}
                                    <div
                                        className={`w-full sm:w-[45%] p-6 md:p-8 rounded-2xl border border-[#E2E8F0] 
                                        shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] bg-[linear-gradient(90deg,#FFFFFF_0%,#C7F7DC_43.75%,#FFFFFF_100%)] text-left  ml-10 sm:ml-0
                                        sm:${item.side === "left" ? "text-left" : "text-right"}`}
                                    >
                                        {/* Year */}
                                        <span className="inline-block mb-3 px-3 py-1 text-xs font-[400] text-[#FFFFFF] rounded-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]">
                                            {item.year}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-xl md:text-2xl font-[400] text-[#0F172A] mb-2">
                                            {item.title}
                                        </h3>

                                        {/* Desc */}
                                        <p className="text-sm text-[#64748B] leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-2 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 bg-[#22C55E] border-4 border-white rounded-full shadow"></div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            <section className="w-full py-8">
                <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">

                    {/* Header */}
                    <div className="text-center mb-6 md:mb-12">
                        <span className="inline-block bg-[#F0FDF4] text-[#4BDD96] px-5 py-2 rounded-full text-xs font-medium">
                            OUR PORTFOLIO
                        </span>

                        <h2 className="text-2xl md:text-4xl font-[400] text-[#0F172A] mt-4">
                            Diverse Real Estate Solutions
                        </h2>

                        <p className="text-[#64748B] mt-3 text-sm sm:text-lg">
                            From residential townships to commercial complexes and hospitality developments.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] 
                                shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] 
                                hover:shadow-lg transition duration-300"
                            >

                                {/* Image */}
                                <div className="relative h-[240px] overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt=""
                                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                                        <h3 className="text-white text-lg md:text-2xl font-[400]">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <p className="text-sm text-[#64748B] text-[400] leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>
            </section>

            <section className="w-full py-8 mb-4">
                <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">

                    {/* CTA Box */}
                    <div className="rounded-3xl px-6 md:px-12 py-12 md:py-16 text-center text-white 
        bg-[linear-gradient(135deg,#0F172A_0%,#11192C_12.5%,#131B2E_25%,#141E30_37.5%,#162032_50%,#182235_62.5%,#1A2437_75%,#1C2739_87.5%,#1E293B_100%)]">

                        {/* Icon */}
                        <div className="flex justify-center mb-4 md:mb-8">
                            <div className="w-16 h-16 flex items-center justify-center  text-[#4BDD96]">
                                <FiAward className="text-[36px] md:text-[64px]" />
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl md:text-4xl font-[400] text-[#FFFFFF] mb-4">
                            Join Us in Building the Future
                        </h2>

                        {/* Description */}
                        <p className="text-sm md:text-lg text-[#FFFFFFCC] max-w-[645px] mx-auto mb-5 md:mb-8 leading-relaxed">
                            Be part of India’s most trusted real estate investment platform.
                            Start building wealth and communities with Gangotri Global Limited.
                        </p>

                        {/* Button */}
                        <button className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-[#3ccf85] text-[#0F172A] px-6 md:px-8 py-3 rounded-3xl text-sm md:text-base font-medium transition">
                            Explore Investment Opportunities
                        </button>

                    </div>

                </div>
            </section>

            <Footer />


        </div>


    );
};

export default AboutPage;