import React, { useState } from "react";
import Header from "../Directives/Header.jsx"
import Footer from "../Directives/Footer.jsx"
import TopStats from "../Components/TopStats.jsx"
import { useNavigate } from "react-router-dom";
import { featuredBlogs, blogs } from "./blogData.js";

// import fea1 from "../assets/blog/fea1.jpg"
// import fea2 from "../assets/blog/fea2.jpg"

// import blog1 from "../assets/blog/blog1.jpg"
// import blog2 from "../assets/blog/blog2.jpg"
// import blog3 from "../assets/blog/blog3.jpg"
// import blog4 from "../assets/blog/blog4.jpg"
// import blog5 from "../assets/blog/blog5.jpg"
// import blog6 from "../assets/blog/blog6.jpg"



// import au1 from "../assets/blog/auther/fea1.jpg"
// import au2 from "../assets/blog/auther/fea2.jpg"

// import b1 from "../assets/blog/auther/b1.jpg"
// import b2 from "../assets/blog/auther/b2.jpg"
// import b3 from "../assets/blog/auther/b3.jpg"
// import b4 from "../assets/blog/auther/b4.jpg"
// import b5 from "../assets/blog/auther/b5.jpg"
// import b6 from "../assets/blog/auther/b6.jpg"


const tabs = [
    "All",
    "News",
    "Market Analysis",
    "Investment Tips",
    "Property Guide",
    "Trends",
];

// const featuredBlogs = [
//     {
//         id: 1,
//         category: "News",
//         title: "Real Estate Market Shows Strong Recovery in Q1 2026",
//         description:
//             "The real estate sector has demonstrated remarkable resilience with a 15% growth in property values across major metropolitan areas. Industry experts attribute this surge to ",
//         image: fea1,
//         author: "Sarah Johnson",
//         role: "Senior Market Analyst",
//         authorImg: au1,
//         date: "March 10, 2026",
//         read: "5 min read",
//     },
//     {
//         id: 2,
//         category: "Investment Tips",
//         title: "Top 10 Investment Strategies for Fractional Real Estate",
//         description:
//             "Discover proven strategies for maximizing returns in fractional property investments and building a diversified portfolio.",
//         image: fea2,
//         author: "Michael Chen",
//         role: "Investment Advisor",
//         authorImg: au2,
//         date: "March 12, 2026",
//         read: "6 min read",
//     },
// ];

// const blogs = [
//     {
//         id: 3,
//         category: "Trends",
//         title: "Commercial Real Estate Trends Shaping 2026",
//         description:
//             "Hybrid work models continue to reshape commercial real estate demand.",
//         image: blog1,
//         author: "Emily Rodriguez",
//         role: "Property Expert",
//         authorImg: b1,
//         date: "March 5, 2026",
//         read: "6 min read",
//     },
//     {
//         id: 4,
//         category: "Property Guide",
//         title: "Understanding REITs vs Direct Property Investment",
//         description:
//             "A comprehensive comparison of Real Estate Investment Trusts and direct property ownership.",
//         image: blog2,
//         author: "David Kumar",
//         role: "Financial Consultant",
//         authorImg: b2,
//         date: "March 3, 2026",
//         read: "10 min read",
//     },
//     {
//         id: 5,
//         category: "Market Analysis",
//         title: "Bangalore Property Market Analysis March 2026",
//         description:
//             "Deep dive into Bangalore’s property market performance.",
//         image: blog3,
//         author: "Priya Sharma",
//         role: "Analyst",
//         authorImg: b3,
//         date: "March 1, 2026",
//         read: "7 min read",
//     },
//     {
//         id: 6,
//         category: "News",
//         title: "Sustainable Housing: The Future of Real Estate",
//         description:
//             "Green housing trends are rapidly gaining traction.",
//         image: blog4,
//         author: "John Wilson",
//         role: "Eco Specialist",
//         authorImg: b4,
//         date: "February 28, 2026",
//         read: "8 min read",
//     },
//     {
//         id: 7,
//         category: "Investment Tips",
//         title: "First-Time Investor’s Guide to Property Markets",
//         description:
//             "Essential tips and strategies for beginners.",
//         image: blog5,
//         author: "Lisa Anderson",
//         role: "Wealth Coach",
//         authorImg: b5,
//         date: "February 25, 2026",
//         read: "9 min read",
//     },
//     {
//         id: 8,
//         category: "News",
//         title: "Mumbai Real Estate Reaches New Heights",
//         description:
//             "Mumbai’s real estate market continues to rise.",
//         image: blog6,
//         author: "Raj Sharma",
//         role: "Reporter",
//         authorImg: b6,
//         date: "February 20, 2026",
//         read: "4 min read",
//     },
// ];



const BlogPage = () => {
    const [activeTab, setActiveTab] = useState("All");



    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-");
    };


    const filteredBlogs =
        activeTab === "All"
            ? blogs
            : blogs.filter((b) => b.category === activeTab);

    const navigate = useNavigate();

    return (


        <div className="w-full">

            <TopStats />
            <Header />


            <div className="min-h-screen py-6 md:py-10 px-3 sm:px-5 lg:px-20">

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-8 md:mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm ${activeTab === tab
                                ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#FFFFFF] shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.1),0px_4px_6px_-1px_rgba(0,0,0,0.1)]"
                                : "bg-white text-[#64748B] border border-[#E2E8F0]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ALL TAB */}
                {activeTab === "All" && (
                    <>
                        {/* Featured */}
                        <h2 className=" text-2xl md:text-3xl font-[400] text-[#0F172A] mb-6  md:mb-10">
                            Featured Articles
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-10">
                            {featuredBlogs.map((blog) => (
                                <FeaturedCard
                                    key={blog.id}
                                    blog={blog}
                                    navigate={navigate}
                                    createSlug={createSlug}
                                />
                            ))}
                        </div>

                        {/* Latest */}
                        <h2 className="text-2xl md:text-3xl text-[#0F172A] font-[400] mb-6  md:mb-10">
                            Latest Articles
                        </h2>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBlogs.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    blog={blog}
                                    navigate={navigate}
                                    createSlug={createSlug}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* OTHER TABS */}
                {activeTab !== "All" && (
                    <>
                        <h2 className="text-2xl md:text-3xl text-[#0F172A] font-[400] mb-6 md:mb-10">
                            {activeTab}
                        </h2>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBlogs.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    blog={blog}
                                    navigate={navigate}
                                    createSlug={createSlug}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer />


        </div>
    );
};

export default BlogPage;





/* ================= COMPONENTS ================= */

// const FeaturedCard = ({ blog }) => (
//     <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">

const FeaturedCard = ({ blog, navigate, createSlug }) => (
    <div
        onClick={() => navigate(`/blog/${createSlug(blog.title)}`)}
        className="cursor-pointer bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
    >
        <div className="relative">
            <img src={blog.image} className="w-full h-[300px] object-cover" />
            <span className="absolute top-4 left-4 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-white text-xs px-4 py-1 rounded-full">
                {blog.category}
            </span>
        </div>

        <div className="p-6">
            <h2 className="text-xl sm:text-2xl font-[400] text-[#0F172A] mb-3">
                {blog.title}
            </h2>

            <p className="text-[#64748B] font-[400] text-sm md:text-base mb-4">
                {blog.description}
            </p>

            <div className="border-t border-[#E2E8F0] my-4"></div>

            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <img
                        src={blog.authorImg}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-xs md:text-sm text-[#0F172A] font-[400]">{blog.author}</p>
                        <p className="text-xs text-[#94A3B8]">
                            {blog.role}
                        </p>
                    </div>
                </div>

                <div className="text-[10px] md:text-xs  text-right">
                    <p className="text-[#64748B]">{blog.date}</p>
                    <p className="text-[#94A3B8]">{blog.read}</p>
                </div>
            </div>
        </div>
    </div>

);



// const BlogCard = ({ blog }) => (
//     <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
const BlogCard = ({ blog, navigate, createSlug }) => (
    <div
        onClick={() => navigate(`/blog/${createSlug(blog.title)}`)}
        className="cursor-pointer bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
    >
        <div className="relative">
            <img src={blog.image} className="w-full h-[220px] object-cover" />
            <span className="absolute top-3 left-3 bg-[#94D8FF] text-[#0F172A] text-xs px-3 py-1 rounded-full">
                {blog.category}
            </span>
        </div>

        <div className="p-4">
            <h3 className="text-[#0F172A] text-base md:text-lg font-[400] mb-2">
                {blog.title}
            </h3>

            <p className="text-[#64748B] text-xs sm:text-sm font-[400] mb-4 line-clamp-2">
                {blog.description}
            </p>

            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <img
                        src={blog.authorImg}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="">
                        <p className="text-xs sm:text-sm text-[#0F172A] font-[400]">{blog.author}</p>
                        <p className="text-[10px] sm:text-xs font-[400] text-[#94A3B8]">{blog.role}</p>
                    </div>
                </div>

                <div className="text-[10px] sm:text-xs font-[500] text-[#94A3B8] text-right">
                    <p>{blog.date}</p>
                    <p>{blog.read}</p>
                </div>
            </div>
        </div>
    </div>
);