import React from "react";
import { useParams } from "react-router-dom";

import Header from "../Directives/Header.jsx"
import Footer from "../Directives/Footer.jsx"
import TopStats from "../Components/TopStats.jsx"
import { useEffect, useState } from "react";


import { featuredBlogs, blogs } from "./blogData";



const BlogDetails = () => {

    const { slug } = useParams();

    // slug create
    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-");
    };

    // heading id create
    const createId = (text) => {
        return text.toLowerCase().replace(/\s+/g, "-");
    };

    // find blog
    const allBlogs = [...featuredBlogs, ...blogs];

    const blog = allBlogs.find(
        (b) => createSlug(b.title) === slug
    );

    const [activeId, setActiveId] = useState(null);

    // TOC state
    const [headings, setHeadings] = useState([]);



    // get headings
    useEffect(() => {
        if (!blog) return;

        const content = document.getElementById("blog-content");
        if (!content) return;

        const elements = content.querySelectorAll("h3");

        const headingData = Array.from(elements).map((el) => ({
            id: el.id,
            text: el.innerText,
        }));

        setHeadings(headingData);
    }, [blog]);

    // scroll function
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            setActiveId(id); // ✅ yaha missing tha
        }
    };

    // blog not found
    if (!blog) {
        return (
            <div className="p-10 text-center">
                Blog not found
            </div>
        );
    }

    return (
        <div className="w-full">

            <TopStats />
            <Header />
            <div className="min-h-screen px-3 sm:px-5 lg:px-20 py-8">

                <div className="grid lg:grid-cols-3 gap-10">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2">

                        {/* Category */}
                        <span className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#FFFFFF] font-[400] text-xs px-3 py-1 rounded-full">
                            {blog.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-[400] text-[#0F172A] mt-5 mb-5">
                            {blog.title}
                        </h1>

                        {/* Author */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img
                                    src={blog.authorImg}
                                    className="w-14 h-14 rounded-full"
                                />
                                <div>
                                    <p className="text-sm md:text-base text-[#0F172A] font-[400]">{blog.author}</p>
                                    <p className="text-xs md:text-sm font-[400]  text-[#64748B]">{blog.role}</p>
                                </div>
                            </div>

                            <div className="text-xs md:text-sm font-[400]  text-right">
                                <p className="text-[#64748B]">{blog.date}</p>
                                <p className="text-[#94A3B8]">{blog.read}</p>
                            </div>
                        </div>

                        {/* Image */}
                        <img
                            src={blog.image}
                            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl mb-6"
                        />

                        {/* Content */}
                        <div id="blog-content" className="text-[#4B5563] text-sm md:text-lg font-[400] leading-relaxed space-y-4 md:space-y-6">
                            <p>
                                TThe real estate sector has demonstrated remarkable resilience with a 15% growth in property values across major metropolitan areas. Industry experts attribute this surge to improved economic indicators and investor confidence. This unprecedented growth marks a significant turning point for the market, which has been recovering steadily from previous downturns.
                            </p>

                            <h3 id={createId("Market Dynamics and Key Drivers")}
                                className="font-[400] text-xl md:text-3xl text-[#0F172A]">
                                Market Dynamics and Key Drivers
                            </h3>

                            <p>
                                Several factors have contributed to this robust market performance. Low interest rates, combined with increased demand for quality housing, have created a perfect storm for property value appreciation. Urban centers like Bangalore, Mumbai, and Hyderabad have seen the most significant gains, with some localities experiencing price increases of up to 20%.
                                <br /> <br />
                                The commercial real estate segment has also shown strong recovery, particularly in the technology and co-working space sectors. As companies adapt to hybrid work models, the demand for flexible office spaces has increased substantially, driving investment in this segment.

                            </p>

                            <h3 id={createId("Investment Opportunities")}
                                className="font-[400] text-xl md:text-3xl text-[#0F172A]">
                                Investment Opportunities
                            </h3>

                            <p>
                                For investors looking to capitalize on this growth, fractional ownership models have emerged as an attractive option. These investment vehicles allow individuals to own a portion of premium properties that would otherwise be out of reach, providing exposure to high-value real estate with lower capital requirements.
                            </p>

                            <p className="bg-[#F0FDF4] p-4 border-l-4 border-[#4BDD96] pl-4 rounded-tr-xl rounded-br-xl text-[#0F172A] md:text-lg text-sm font-[400]">
                                "The current market conditions present a unique opportunity for both first-time and seasoned investors. The combination of strong fundamentals and innovative investment models is democratizing real estate investment." - Sarah Johnson, Senior Market Analyst
                            </p>

                            <p>
                                Sustainability has also become a key consideration for investors. Green-certified buildings and eco-friendly developments are commanding premium prices, reflecting growing awareness of environmental impact and long-term value preservation.
                            </p>

                            <h3 id={createId("Looking Ahead")}
                                className="font-[400] text-xl md:text-3xl text-[#0F172A]">
                                Looking Ahead
                            </h3>

                            <p>
                                Market analysts predict continued growth throughout 2026, albeit at a more moderate pace. Investors are advised to conduct thorough due diligence and consider diversifying their portfolios across different property types and locations to maximize returns while managing risk effectively.
                                <br /> <br />
                                The integration of technology in property management and investment platforms has made real estate more accessible than ever. Digital platforms offering fractional ownership, transparent pricing, and detailed analytics are transforming how people invest in property.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">

                        {/* Author Card */}
                        <div className="bg-white border border-[#E2E8F0] p-4 md:p-8 rounded-3xl shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
                            <div className="flex items-center gap-4 mb-3">
                                <img
                                    src={blog.authorImg}
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <p className="text-[#0F172A] text-sm md:text-base font-[400]">{blog.author}</p>
                                    <p className="text-xs md:text-sm text-[#64748B]">{blog.role}</p>
                                </div>
                            </div>

                            <p className="text-sm md:text-lg font-[400] text-[#64748B] mb-4">
                                Expert real estate analyst with over 10 years of experience in market research and investment strategy.
                            </p>

                            <button className="w-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] font-[400] text-sm md:text-lg text-white py-2 sm:py-3 rounded-full">
                                Follow
                            </button>
                        </div>

                        {/* table of content  */}
                        <div className="bg-white border border-[#E2E8F0] p-4 md:p-8 rounded-3xl shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
                            <h3 className="font-[400] text-base sm:text-lg md:text-xl text-[#0F172A] mb-3">
                                Table of Contents
                            </h3>

                            <ul className="text-sm sm:text-base font-[400] text-[#64748B] space-y-3">
                                {headings.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`cursor-pointer transition hover:text-[#4BDD96] ${activeId === item.id ? "text-[#4BDD96]" : ""
                                            }`}
                                    >
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-[linear-gradient(135deg,_#4BDD96_0%,_#4ADA94_9.09%,_#48D691_18.18%,_#47D38F_27.27%,_#46D08D_36.36%,_#45CC8B_45.45%,_#43C988_54.55%,_#42C686_63.64%,_#41C384_72.73%,_#40BF81_81.82%,_#3EBC7F_90.91%,_#3DB97D_100%)] p-4 md:p-8 rounded-3xl text-white">

                            <h4 className="font-[400] text-base sm:text-lg md:text-xl mb-2">
                                Subscribe to Newsletter
                            </h4>

                            <p className="text-sm md:text-base font-[400] mb-5">
                                Get the latest real estate insights delivered to your inbox weekly.
                            </p>

                            {/* Input Field */}
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full mb-4 px-4 py-3 rounded-xl bg-transparent  placeholder-[#0F172A80] text-white outline-none focus:border-white"
                            />

                            {/* Button */}
                            <button className="bg-white text-sm md:text-lg text-[#4BDD96] w-full py-3 rounded-2xl font-[500]">
                                Subscribe
                            </button>

                        </div>
                        {/* <div className="bg-[linear-gradient(135deg,_#4BDD96_0%,_#4ADA94_9.09%,_#48D691_18.18%,_#47D38F_27.27%,_#46D08D_36.36%,_#45CC8B_45.45%,_#43C988_54.55%,_#42C686_63.64%,_#41C384_72.73%,_#40BF81_81.82%,_#3EBC7F_90.91%,_#3DB97D_100%)] p-4 md:p-8 rounded-3xl text-white">
                            <h4 className="font-[400] text-base sm:text-lg md:text-xl mb-2">
                                Subscribe to Newsletter
                            </h4>
                            <p className="text-sm md:text-base font-[400] mb-4">
                                Get the latest real estate insights delivered to your inbox weekly.
                            </p>

                            <button className="bg-white text-sm md:text-md  text-[#4BDD96] w-full py-2 rounded-2xl">
                                Subscribe
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* Related Articles */}
                <div className="mt-16">
                    <h2 className="text-2xl md:text-3xl font-[#0F172A] font-[400] mb-8">
                        Related Articles
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        {blogs.slice(0, 3).map((item) => (
                            <div key={item.id} className="cursor-pointer group bg-[#FFFFFF]  rounded-2xl border  border-[#E2E8F0]">

                                {/* Image Wrapper */}
                                <div className="relative overflow-hidden rounded-2xl">

                                    <img
                                        src={item.image}
                                        className="w-full h-[200px] object-cover transition duration-300 group-hover:scale-105"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/30"></div>

                                    {/* Category Tag */}
                                    <span className="absolute top-3 left-3 bg-[#94D8FF] backdrop-blur-md text-[#0F172A] text-xs md:text-sm px-3 py-1 rounded-full">
                                        {item.category || "Property Guide"}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="mt-1 p-6 space-y-2">

                                    {/* Title */}
                                    <h3 className="text-lg md:text-xl font-[500] text-[#0F172A] leading-snug">
                                        {item.title}
                                    </h3>

                                    {/* Description (optional) */}
                                    <p className="text-sm md:text-base text-[#64748B] line-clamp-2">
                                        {item.description }
                                    </p>

                                    {/* Footer */}
                                    <div className="flex justify-between text-sm text-[#94A3B8]">
                                        <span>{item.author}</span>
                                        <span>{item.read}</span>
                                    </div>
                                </div>

                            </div>
                        ))}

                        {/* {blogs.slice(0, 3).map((item) => (
                            <div key={item.id} className="cursor-pointer">
                                <img
                                    src={item.image}
                                    className="w-full h-[240px] rounded-xl object-cover"
                                />
                                <p className="text-sm mt-2">{item.title}</p>
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
            <Footer />


        </div>
    );
};

export default BlogDetails;