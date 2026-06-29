// import { useNavigate } from "react-router-dom";
// import { AiOutlineHome } from "react-icons/ai";
// import { BiDollarCircle } from "react-icons/bi";
// import { PiFlaskBold } from "react-icons/pi";

// import { useEffect, useState } from "react";
// import { getReadymadeProperties } from "../Data/readymadeProperties";
// import { getTokenizedProperties } from "../Data/tokenizedProperties";
// import { getUnderConstructionProperties } from "../Data/UnderConstructionProperties";

// import { FiArrowUpRight } from "react-icons/fi";
// import { IoTrendingUpOutline } from "react-icons/io5";
// import { LuLock } from "react-icons/lu";
// import { IoLocationOutline } from "react-icons/io5";
// import { AiTwotoneCheckCircle } from "react-icons/ai";
// import { IoAnalyticsOutline } from "react-icons/io5";
// import { FiUsers } from "react-icons/fi";
// import { FaRegCircleCheck } from "react-icons/fa6";
// import { FaMapMarkerAlt } from "react-icons/fa";
// const TABS = [
//   { key: "readymade", label: "Readymade Project", des: "Fixed rental income", icon: <AiOutlineHome /> },
//   { key: "tokenized", label: "OneTimeBuy Project", des: "Blockchain ownership", icon: <BiDollarCircle /> },
//   { key: "construction", label: "Under Construction", des: "Secured income during build", icon: <PiFlaskBold /> },
// ];

// const STATS_BY_TAB = {
//   construction: [
//     { label: "Total Properties", value: "248", sub: "Available for investment", bg: "bg-[#CCFFE5]" },
//     { label: "Avg. APR", value: "11.2%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
//     { label: "Total Invested", value: "24.5M", sub: "Platform wide", bg: "bg-[#BBADFF]" },
//     { label: "Avg APR", value: "112%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
//   ],
// };

// export default function Investments() {
//   const [activeTab, setActiveTab] = useState("construction");

//   const activeStats = STATS_BY_TAB[activeTab] || [];
//   const [construction, setConstruction] = useState([]);
//   const [loading, setLoading] = useState({ construction: true });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadConstruction = async () => {
//       try {
//         const data = await getUnderConstructionProperties();
//         setConstruction(data || []);
//       } catch (e) {
//         setConstruction([]);
//       } finally {
//         setLoading({ construction: false });
//       }
//     };
//     loadConstruction();
//   }, []);

//   const filtered = construction; // only construction properties
//   const isLoading = loading.construction;

//   return (
//     <div className="space-y-8 dmfont">
//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#101828] droxen-font">
//             Investment
//           </h2>
//           <p className="text-[16px] text-[#4A5565] mt-2 gued-font">
//             Explore investment opportunities in real estate
//           </p>
//         </div>

//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <div className="flex items-center bg-[#EEF2F6] px-4 py-2 rounded-full w-full md:w-[350px]">
//             <svg className="w-5 h-5 text-[#6B7280] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
//             </svg>
//             <input type="text" placeholder="Search Properties" className="bg-transparent outline-none w-full text-[#6B7280]" />
//           </div>

//           <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E2E8F0] cursor-pointer">
//             <svg className="w-5 h-5 text-[#475467]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 gued-font">
//         {activeStats.map((stat, i) => (
//           <div key={i} className={`${stat.bg} text-black rounded-xl p-6`}>
//             <p className="text-m font-Regular pb-2">{stat.label}</p>
//             <h3 className="text-3xl font-SemiBold pb-2">{stat.value}</h3>
//             <p className="text-sm font-Regular">{stat.sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* ================= PROPERTY GRID ================= */}
//       {isLoading ? (
//         <div className="text-center py-20">
//           <p className="text-lg text-[#4A5565]">Loading investment opportunities...</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-20">
//           <p className="text-lg text-[#4A5565]">No properties available at the moment</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filtered.map((p) => (
//             <div key={p.id} className="bg-[#FFFFFF] rounded-2xl shadow border border-[#E5E7EB] overflow-hidden">
//               <div className="relative">
//                 <img src={p.images?.[0] || p.image} alt={p.title} className="h-[256px] w-full object-cover" />
//                 <span className="absolute top-3 left-3 bg-[#4BDD96E5] text-black text-xs px-3 py-1 rounded-full">For Sale</span>
//                 <span className="absolute top-3 right-3 bg-[#FFFFFFF2] text-[#101828] text-xs px-3 py-1 rounded-full">
//                   {p.risklevel || "Medium Risk"}
//                 </span>
//                 <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-1">
//                   <div className="bg-[#0F172A99] flex gap-2 p-2 rounded-xl"><FaMapMarkerAlt className="text-white" /><p className="text-white font-medium text-xs">{p.location || "No Location"}</p></div>
//                 </div>
//               </div>
//                   <h3 className="text-black text-left pl-5 font-normal capitalize text-xl">{p.title || "No Title"}</h3>

//               <div className="p-5 space-y-5">
//                 {/* <div className="bg-gradient-to-br from-[#4bdd962b] to-[#4bdd961e] border border-[#FFEDD4] rounded-xl p-4">
//                   <div className="flex justify-between items-center mb-1">
//                     <div>
//                       <p className="text-sm font-medium text-[#101828]">Construction Progress</p>
//                       <p className="text-xs text-[#4A5565]">{p.constructionprogress || "N/A"}</p>
//                     </div>
//                     <p className="text-[#4bdd96] font-bold text-2xl">{p.overallprogress ?? 0}%</p>
//                   </div>
//                   <div className="h-2.5 bg-[#FFFFFF] border border-[#FFEDD4] rounded-full mt-2 overflow-hidden">
//                     <div
//                       className="h-2.5 bg-gradient-to-r from-[#FF6900] to-[#FE9A00] rounded-full transition-all duration-500"
//                       style={{ width: `${p.overallprogress ?? 0}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between font-normal text-xs text-[#4A5565] mt-2">
//                     <span>Started: {p.Started || "N/A"}</span>
//                     <span>Expected: {p.sidebar?.completion || "N/A"}</span>
//                   </div>
//                 </div> */}

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-[#6A7282] uppercase">Total Valuation</p>
//                     <p className="text-[#00A63E] font-semibold text-lg">45,600</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#6A7282] uppercase">total Investors</p>
//                     <p className="font-semibold text-lg text-[#101828]">170</p>
//                   </div>
//                 </div>
//                  <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-[#6A7282] uppercase">Total area</p>
//                     <p className="text-[#00A63E] font-semibold text-lg">2,450 sqft</p>
//                     {/* <p className="text-[#00A63E] font-semibold text-lg">{p.sidebar?.expectedROI || "N/A"}</p> */}
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#6A7282]  uppercase">Per soft price</p>
//                     {/* <p className="font-semibold text-lg text-[#101828]">₹{p.sidebar?.minInv || 0}</p> */}
//                     <p className="font-semibold text-lg text-[#101828]">$1,734</p>
//                   </div>
//                 </div>
// <div className="flex justify-between text-black">
//   <p>Funding Progress</p>
//   <p>90%</p>
// </div><div className="h-2.5 bg-[#4bdd96ef] border border-[#FFEDD4] rounded-full mt-2 overflow-hidden">
//                     <div
//                       className="h-2.5 bg-[linear-gradient(to_right,#4bdd96e5_90%,white_90%)] rounded-full transition-all duration-500"
                      
//                     />
//                   </div>
//                 <button
//                   onClick={() => navigate(`/user/property-investments/construction/${p.id}`)}
//                   className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4bdd96e5] to-[#4bdd96e5] text-black flex items-center justify-center gap-2 gued-font"
//                 >
//                   View Progress & Invest Now
//                   <FiArrowUpRight className="text-lg" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// // import { getUnderConstructionProperties } from "../Data/UnderConstructionProperties";

// import propertiesData from "../Data/dummyProperties";
// import { FiArrowUpRight } from "react-icons/fi";
// import { FaMapMarkerAlt } from "react-icons/fa";

// const STATS_BY_TAB = {
//   construction: [
//     { label: "Total Properties", value: "248", sub: "Available for investment", bg: "bg-[#CCFFE5]" },
//     { label: "Avg. APR", value: "11.2%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
//     { label: "Total Invested", value: "24.5M", sub: "Platform wide", bg: "bg-[#BBADFF]" },
//     { label: "Avg APR", value: "112%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
//   ],
// };

// const getButtonText = (type) => {
//   if (type === "SQFT Investment") return "Invest Now";
//   if (type === "Fractional Buy") return "Buy Now";
//   if (type === "One Time Buy") return "Send Enquiry";
//   return "View Details";
// };

// export default function Investments() {
//   const activeStats = STATS_BY_TAB["construction"];

//   const [construction, setConstruction] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadConstruction = async () => {
//       try {
//         // âŒ BACKEND TEMP DISABLED
//         /*
//         const data = await getUnderConstructionProperties();
//         if (data && data.length > 0) {
//           setConstruction(data);
//           return;
//         }
//         */

//         // âœ… DUMMY DATA
//         setConstruction(propertiesData);

//       } catch {
//         setConstruction(propertiesData);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadConstruction();
//   }, []);

//   return (
//     <div className="space-y-8 dmfont px-3 sm:px-4 md:px-6 lg:px-8">

//       {/* HEADER */}
//       <div>
//         <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#101828]">
//           Investment
//         </h2>
//         <p className="text-[16px] text-[#4A5565] mt-2">
//           Explore investment opportunities in real estate
//         </p>
//       </div>

//       {/* STATS */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {activeStats.map((stat, i) => (
//           <div key={i} className={`${stat.bg} text-black rounded-xl p-6`}>
//             <p className="text-m pb-2">{stat.label}</p>
//             <h3 className="text-3xl pb-2">{stat.value}</h3>
//             <p className="text-sm">{stat.sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* GRID */}
//       {loading ? (
//         <div className="text-center py-20">Loading...</div>
//       ) : (
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

//           {construction.map((p) => {
//             const totalUnits = p.availableUnits + p.soldUnits;
//             const percent = totalUnits > 0
//               ? Math.round((p.soldUnits / totalUnits) * 100)
//               : 0;

//             return (
//               <div key={p.id} className="bg-white rounded-2xl shadow border overflow-hidden w-full">

//                 {/* IMAGE */}
//                 <div className="relative">
//                   <img
//                     src={p.images?.main?.[0]}
//                     alt={p.title}
//                     className="h-[220px] w-full object-cover"
//                   />

//                   <div className="absolute bottom-0 left-0 right-0 p-4">
//                     <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-2 w-fit">
//                       <FaMapMarkerAlt />
//                       {p.specifications?.location}
//                     </div>
//                   </div>
//                 </div>

//                 {/* TITLE */}
//                 <h3 className="px-5 pt-4 text-lg text-black font-semibold">
//                   {p.title}
//                 </h3>

//                 <div className="p-5 space-y-4">

//                   {/* ROW 1 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Total Valuation</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         {p.totalValuation}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Investors</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         {p.specifications?.totalInvestors ?? "â€”"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* ROW 2 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Area</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         {p.specifications?.totalArea}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Price / sqft</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         ${p.pricePerSqft ?? "â€”"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* FUNDING PROGRESS (ORIGINAL STYLE RESTORED) */}
//                   <div>
//                     <div className="flex justify-between text-xs font-medium text-black mb-1">
//                       <span>Funding Progress</span>
//                       <span>{percent}%</span>
//                     </div>

//                     <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gradient-to-r from-[#4BDD96] to-[#3DB97D]"
//                         style={{ width: `${percent}%` }}
//                       />
//                     </div>
//                   </div>
//                   {/* BUTTON */}
//                   <button
//                     onClick={() =>
//                       navigate(`/user/property-investments/construction/${p.id}`, {
//                         state: { property: p }
//                       })
//                     }
//                     className="w-full py-3 rounded-xl bg-green-500 text-black flex items-center justify-center gap-2"
//                   >
//                     {getButtonText(p.type)}
//                     <FiArrowUpRight />
//                   </button>

//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


// import { useNavigate } from "react-router-dom";
// import { AiOutlineHome } from "react-icons/ai";
// import { BiDollarCircle } from "react-icons/bi";
// import { PiFlaskBold } from "react-icons/pi";

// import { useEffect, useState } from "react";
// import { getReadymadeProperties } from "../Data/readymadeProperties";
// import { getTokenizedProperties } from "../Data/tokenizedProperties";
// import { getUnderConstructionProperties } from "../Data/UnderConstructionProperties";

// import { FiArrowUpRight } from "react-icons/fi";
// import { IoTrendingUpOutline } from "react-icons/io5";
// import { LuLock } from "react-icons/lu";
// import { IoLocationOutline } from "react-icons/io5";
// import { AiTwotoneCheckCircle } from "react-icons/ai";
// import { IoAnalyticsOutline } from "react-icons/io5";
// import { FiUsers } from "react-icons/fi";
// import { FaRegCircleCheck } from "react-icons/fa6";
// import { FaMapMarkerAlt } from "react-icons/fa";
// const TABS = [
//   { key: "readymade", label: "Readymade Project", des: "Fixed rental income", icon: <AiOutlineHome /> },
//   { key: "tokenized", label: "OneTimeBuy Project", des: "Blockchain ownership", icon: <BiDollarCircle /> },
//   { key: "construction", label: "Under Construction", des: "Secured income during build", icon: <PiFlaskBold /> },
// ];

// const STATS_BY_TAB = {
//   construction: [
//     { label: "Total Properties", value: "248", sub: "Available for investment", bg: "bg-[#CCFFE5]" },
//     { label: "Avg. APR", value: "11.2%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
//     { label: "Total Invested", value: "24.5M", sub: "Platform wide", bg: "bg-[#BBADFF]" },
//     { label: "Avg APR", value: "112%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
//   ],
// };

// export default function Investments() {
//   const [activeTab, setActiveTab] = useState("construction");

//   const activeStats = STATS_BY_TAB[activeTab] || [];
//   const [construction, setConstruction] = useState([]);
//   const [loading, setLoading] = useState({ construction: true });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadConstruction = async () => {
//       try {
//         const data = await getUnderConstructionProperties();
//         setConstruction(data || []);
//       } catch (e) {
//         setConstruction([]);
//       } finally {
//         setLoading({ construction: false });
//       }
//     };
//     loadConstruction();
//   }, []);

//   const filtered = construction; // only construction properties
//   const isLoading = loading.construction;

//   return (
//     <div className="space-y-8 dmfont">
//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#101828] droxen-font">
//             Investment
//           </h2>
//           <p className="text-[16px] text-[#4A5565] mt-2 gued-font">
//             Explore investment opportunities in real estate
//           </p>
//         </div>

//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <div className="flex items-center bg-[#EEF2F6] px-4 py-2 rounded-full w-full md:w-[350px]">
//             <svg className="w-5 h-5 text-[#6B7280] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
//             </svg>
//             <input type="text" placeholder="Search Properties" className="bg-transparent outline-none w-full text-[#6B7280]" />
//           </div>

//           <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E2E8F0] cursor-pointer">
//             <svg className="w-5 h-5 text-[#475467]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 gued-font">
//         {activeStats.map((stat, i) => (
//           <div key={i} className={`${stat.bg} text-black rounded-xl p-6`}>
//             <p className="text-m font-Regular pb-2">{stat.label}</p>
//             <h3 className="text-3xl font-SemiBold pb-2">{stat.value}</h3>
//             <p className="text-sm font-Regular">{stat.sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* ================= PROPERTY GRID ================= */}
//       {isLoading ? (
//         <div className="text-center py-20">
//           <p className="text-lg text-[#4A5565]">Loading investment opportunities...</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-20">
//           <p className="text-lg text-[#4A5565]">No properties available at the moment</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filtered.map((p) => (
//             <div key={p.id} className="bg-[#FFFFFF] rounded-2xl shadow border border-[#E5E7EB] overflow-hidden">
//               <div className="relative">
//                 <img src={p.images?.[0] || p.image} alt={p.title} className="h-[256px] w-full object-cover" />
//                 <span className="absolute top-3 left-3 bg-[#4BDD96E5] text-black text-xs px-3 py-1 rounded-full">For Sale</span>
//                 <span className="absolute top-3 right-3 bg-[#FFFFFFF2] text-[#101828] text-xs px-3 py-1 rounded-full">
//                   {p.risklevel || "Medium Risk"}
//                 </span>
//                 <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-1">
//                   <div className="bg-[#0F172A99] flex gap-2 p-2 rounded-xl"><FaMapMarkerAlt className="text-white" /><p className="text-white font-medium text-xs">{p.location || "No Location"}</p></div>
//                 </div>
//               </div>
//                   <h3 className="text-black text-left pl-5 font-normal capitalize text-xl">{p.title || "No Title"}</h3>

//               <div className="p-5 space-y-5">
//                 {/* <div className="bg-gradient-to-br from-[#4bdd962b] to-[#4bdd961e] border border-[#FFEDD4] rounded-xl p-4">
//                   <div className="flex justify-between items-center mb-1">
//                     <div>
//                       <p className="text-sm font-medium text-[#101828]">Construction Progress</p>
//                       <p className="text-xs text-[#4A5565]">{p.constructionprogress || "N/A"}</p>
//                     </div>
//                     <p className="text-[#4bdd96] font-bold text-2xl">{p.overallprogress ?? 0}%</p>
//                   </div>
//                   <div className="h-2.5 bg-[#FFFFFF] border border-[#FFEDD4] rounded-full mt-2 overflow-hidden">
//                     <div
//                       className="h-2.5 bg-gradient-to-r from-[#FF6900] to-[#FE9A00] rounded-full transition-all duration-500"
//                       style={{ width: `${p.overallprogress ?? 0}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between font-normal text-xs text-[#4A5565] mt-2">
//                     <span>Started: {p.Started || "N/A"}</span>
//                     <span>Expected: {p.sidebar?.completion || "N/A"}</span>
//                   </div>
//                 </div> */}

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-[#6A7282] uppercase">Total Valuation</p>
//                     <p className="text-[#00A63E] font-semibold text-lg">45,600</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#6A7282] uppercase">total Investors</p>
//                     <p className="font-semibold text-lg text-[#101828]">170</p>
//                   </div>
//                 </div>
//                  <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-[#6A7282] uppercase">Total area</p>
//                     <p className="text-[#00A63E] font-semibold text-lg">2,450 sqft</p>
//                     {/* <p className="text-[#00A63E] font-semibold text-lg">{p.sidebar?.expectedROI || "N/A"}</p> */}
//                   </div>
//                   <div>
//                     <p className="text-sm text-[#6A7282]  uppercase">Per soft price</p>
//                     {/* <p className="font-semibold text-lg text-[#101828]">₹{p.sidebar?.minInv || 0}</p> */}
//                     <p className="font-semibold text-lg text-[#101828]">$1,734</p>
//                   </div>
//                 </div>
// <div className="flex justify-between text-black">
//   <p>Funding Progress</p>
//   <p>90%</p>
// </div><div className="h-2.5 bg-[#4bdd96ef] border border-[#FFEDD4] rounded-full mt-2 overflow-hidden">
//                     <div
//                       className="h-2.5 bg-[linear-gradient(to_right,#4bdd96e5_90%,white_90%)] rounded-full transition-all duration-500"
                      
//                     />
//                   </div>
//                 <button
//                   onClick={() => navigate(`/user/property-investments/construction/${p.id}`)}
//                   className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4bdd96e5] to-[#4bdd96e5] text-black flex items-center justify-center gap-2 gued-font"
//                 >
//                   View Progress & Invest Now
//                   <FiArrowUpRight className="text-lg" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// // import { getUnderConstructionProperties } from "../Data/UnderConstructionProperties";

// import propertiesData from "../Data/dummyProperties";
// import { FiArrowUpRight } from "react-icons/fi";
// import { FaMapMarkerAlt } from "react-icons/fa";

// const STATS_BY_TAB = {
//   construction: [
//     { label: "Total Properties", value: "248", sub: "Available for investment", bg: "bg-[#CCFFE5]" },
//     { label: "Avg. APR", value: "11.2%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
//     { label: "Total Invested", value: "24.5M", sub: "Platform wide", bg: "bg-[#BBADFF]" },
//     { label: "Avg APR", value: "112%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
//   ],
// };

// const getButtonText = (type) => {
//   if (type === "SQFT Investment") return "Invest Now";
//   if (type === "Fractional Buy") return "Buy Now";
//   if (type === "One Time Buy") return "Send Enquiry";
//   return "View Details";
// };

// export default function Investments() {
//   const activeStats = STATS_BY_TAB["construction"];

//   const [construction, setConstruction] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadConstruction = async () => {
//       try {
//         // âŒ BACKEND TEMP DISABLED
//         /*
//         const data = await getUnderConstructionProperties();
//         if (data && data.length > 0) {
//           setConstruction(data);
//           return;
//         }
//         */

//         // âœ… DUMMY DATA
//         setConstruction(propertiesData);

//       } catch {
//         setConstruction(propertiesData);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadConstruction();
//   }, []);

//   return (
//     <div className="space-y-8 dmfont px-3 sm:px-4 md:px-6 lg:px-8">

//       {/* HEADER */}
//       <div>
//         <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#101828]">
//           Investment
//         </h2>
//         <p className="text-[16px] text-[#4A5565] mt-2">
//           Explore investment opportunities in real estate
//         </p>
//       </div>

//       {/* STATS */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {activeStats.map((stat, i) => (
//           <div key={i} className={`${stat.bg} text-black rounded-xl p-6`}>
//             <p className="text-m pb-2">{stat.label}</p>
//             <h3 className="text-3xl pb-2">{stat.value}</h3>
//             <p className="text-sm">{stat.sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* GRID */}
//       {loading ? (
//         <div className="text-center py-20">Loading...</div>
//       ) : (
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

//           {construction.map((p) => {
//             const totalUnits = p.availableUnits + p.soldUnits;
//             const percent = totalUnits > 0
//               ? Math.round((p.soldUnits / totalUnits) * 100)
//               : 0;

//             return (
//               <div key={p.id} className="bg-white rounded-2xl shadow border overflow-hidden w-full">

//                 {/* IMAGE */}
//                 <div className="relative">
//                   <img
//                     src={p.images?.main?.[0]}
//                     alt={p.title}
//                     className="h-[220px] w-full object-cover"
//                   />

//                   <div className="absolute bottom-0 left-0 right-0 p-4">
//                     <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-2 w-fit">
//                       <FaMapMarkerAlt />
//                       {p.specifications?.location}
//                     </div>
//                   </div>
//                 </div>

//                 {/* TITLE */}
//                 <h3 className="px-5 pt-4 text-lg text-black font-semibold">
//                   {p.title}
//                 </h3>

//                 <div className="p-5 space-y-4">

//                   {/* ROW 1 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Total Valuation</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         {p.totalValuation}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Investors</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         {p.specifications?.totalInvestors ?? "â€”"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* ROW 2 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Area</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         {p.specifications?.totalArea}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-xs text-gray-500 uppercase">Price / sqft</p>
//                       <p className="text-[#0082ED] font-semibold text-lg">
//                         ${p.pricePerSqft ?? "â€”"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* FUNDING PROGRESS (ORIGINAL STYLE RESTORED) */}
//                   <div>
//                     <div className="flex justify-between text-xs font-medium text-black mb-1">
//                       <span>Funding Progress</span>
//                       <span>{percent}%</span>
//                     </div>

//                     <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gradient-to-r from-[#4BDD96] to-[#3DB97D]"
//                         style={{ width: `${percent}%` }}
//                       />
//                     </div>
//                   </div>
//                   {/* BUTTON */}
//                   <button
//                     onClick={() =>
//                       navigate(`/user/property-investments/construction/${p.id}`, {
//                         state: { property: p }
//                       })
//                     }
//                     className="w-full py-3 rounded-xl bg-green-500 text-black flex items-center justify-center gap-2"
//                   >
//                     {getButtonText(p.type)}
//                     <FiArrowUpRight />
//                   </button>

//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { PiFlaskBold } from "react-icons/pi";
import { getPropertyInvestments } from "../Service/investmentApi";

/* TABS */
const TABS = [
  { key: "all", label: "All" },
  { key: "readymade", label: "Per SQFT Investment", icon:<AiOutlineHome/> },
  { key: "tokenized", label: "One Time Buy", icon:<BiDollarCircle/> },
  { key: "construction", label: "Fractional Buy", icon:<PiFlaskBold/> },
];

/* TYPE MAP */
const TYPE_MAP = {
  readymade: "SQFT Investment",
  tokenized: "One Time Buy",
  construction: "Fractional Buy",
};

/* STATS */
const STATS_BY_TAB = {
  all: [
    { label: "Total Properties", value: "0", sub: "Available for investment", bg: "bg-[#CCFFE5]" },
    { label: "Avg. APR", value: "0%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
    { label: "Total Invested", value: "0", sub: "Platform wide", bg: "bg-[#BBADFF]" },
    { label: "Avg. Rental Percent", value: "0%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
  ],
  readymade: [
    { label: "Total Properties", value: "0", sub: "Per SQFT Investment", bg: "bg-[#CCFFE5]" },
    { label: "Avg. APR", value: "0%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
    { label: "Total Invested", value: "0", sub: "Platform wide", bg: "bg-[#BBADFF]" },
    { label: "Avg. Rental Percent", value: "0%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
  ],
  tokenized: [
    { label: "Total Properties", value: "0", sub: "One Time Buy", bg: "bg-[#CCFFE5]" },
    { label: "Avg. APR", value: "0%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
    { label: "Total Invested", value: "0", sub: "Platform wide", bg: "bg-[#BBADFF]" },
    { label: "Avg. Rental Percent", value: "0%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
  ],
  construction: [
    { label: "Total Properties", value: "0", sub: "Fractional Buy", bg: "bg-[#CCFFE5]" },
    { label: "Avg. APR", value: "0%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
    { label: "Total Invested", value: "0", sub: "Platform wide", bg: "bg-[#BBADFF]" },
    { label: "Avg. Rental Percent", value: "0%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
  ],
};

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const toSafeNumber = (value) => {
      if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[, ]/g, "")
      .replace(/[$â‚¹â‚¬Â£]/g, "")
      .replace(/%/g, "");

    if (!normalized) return 0;

    const suffixMatch = normalized.match(/^(-?\d*\.?\d+)(k|m|b|cr|crore|l|lac|lakh)?$/);
    if (suffixMatch) {
      const base = Number(suffixMatch[1]);
      const suffix = suffixMatch[2];

      if (!Number.isFinite(base)) return 0;

      const multipliers = {
        k: 1e3,
        m: 1e6,
        b: 1e9,
        cr: 1e7,
        crore: 1e7,
        l: 1e5,
        lac: 1e5,
        lakh: 1e5,
      };

      return base * (multipliers[suffix] || 1);
    }

    const parsed = Number(normalized.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const formatPercent = (value) => {
  const normalized = toSafeNumber(value);
  const formatted = normalized.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted}%`;
};

const formatCompactNumber = (value) => {
  const normalized = toSafeNumber(value);
  if (normalized <= 0) return "0";
  return compactNumberFormatter.format(normalized);
};

const getAverageFromProperties = (properties, selector) => {
  const values = properties
    .map((property) => toSafeNumber(selector(property)))
    .filter((value) => value > 0);

  if (values.length === 0) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
};

const getInvestedAmount = (property = {}) => {
  const directInvested = toSafeNumber(
    property.totalInvested ??
      property.total_invested ??
      property.investedAmount ??
      property.invested_amount
  );

  if (directInvested > 0) return directInvested;

  const raisedAmount = toSafeNumber(property?.sidebar?.raised ?? property?.raised);
  if (raisedAmount > 0) return raisedAmount;

  const totalSlots = toSafeNumber(
    property?.totalSlots ??
      property?.total_slots ??
      property?.pricing?.totalSlots
  );
  const availableSlots = toSafeNumber(
    property?.availableSlots ??
      property?.available_slots ??
      property?.pricing?.availableSlots
  );
  const soldUnits = toSafeNumber(property.soldUnits ?? property.sold_units);
  const pricePerSlot = toSafeNumber(
    property?.pricing?.pricePerSlot ??
      property?.pricePerSlot ??
      property?.price_per_slot
  );

  const soldSlots = totalSlots > 0 ? Math.max(totalSlots - availableSlots, 0) : 0;
  if (soldSlots > 0 && pricePerSlot > 0) {
    return soldSlots * pricePerSlot;
  }

  if (soldUnits > 0 && pricePerSlot > 0) {
    return soldUnits * pricePerSlot;
  }

  return 0;
};

const getButtonText = (type) => {
  if (type === "SQFT Investment") return "Invest Now";
  if (type === "Fractional Buy") return "Buy Now";
  if (type === "One Time Buy") return "Send Enquiry";
  return "View Details";
};

export default function Investments() {

  const [activeTab, setActiveTab] = useState("all");
  const [allProperties, setAllProperties] = useState([]);
  const [construction, setConstruction] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadProperties = async () => {
      try {
        const data = await getPropertyInvestments();
        if (mounted) {
          setAllProperties(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setAllProperties([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = [];
    if (activeTab === "all") {
      filtered = [...allProperties].sort((a, b) =>
        String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
      );
    } else {
      filtered = allProperties.filter(
        (p) => p.type === TYPE_MAP[activeTab]
      );
    }

    setConstruction(filtered);
  }, [activeTab, allProperties]);

  const activeStats = useMemo(() => {
    const baseStats = STATS_BY_TAB[activeTab] || [];
    if (baseStats.length === 0) return [];

    const totalProperties = construction.length;
    const avgApr = getAverageFromProperties(
      construction,
      (property) => property?.aprMax ?? property?.apr_max
    );
    const avgRentalPercent = getAverageFromProperties(
      construction,
      (property) =>
        property?.monthlyReturn ??
        property?.rental_percentage ??
        property?.rental_Percentage
    );
    const totalInvested = construction.reduce(
      (sum, property) => sum + getInvestedAmount(property),
      0
    );

    return baseStats.map((stat, index) => {
      if (index === 0) return { ...stat, value: String(totalProperties) };
      if (index === 1) return { ...stat, value: formatPercent(avgApr) };
      if (index === 2) return { ...stat, value: formatCompactNumber(totalInvested) };
      if (index === 3) return { ...stat, value: formatPercent(avgRentalPercent) };
      return { ...stat };
    });
  }, [activeTab, construction]);

  return (
    <div className="space-y-8 dmfont px-3 sm:px-4 md:px-6 lg:px-8">

      {/* HEADER */}
      <div>
        <h2 className="text-[18px] font-semibold droxen-font uppercase tracking-[1px] text-[#101828]">
          Investment
        </h2>
        <p className="text-[16px] text-[#4A5565] mt-2">
          Explore investment opportunities in real estate
        </p>
      </div>

      {/* TABS */}
      {/* <div className="flex gap-4 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 border-b-2
              ${activeTab === tab.key ? "border-green-500 text-[#0082ED]" : "text-gray-500"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div> */}


<div className="overflow-x-auto scrollbar-hide">
  <div className="flex gap-3 min-w-max px-1">

    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300
          
          ${
            activeTab === tab.key
              ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200"
          }
        `}
      >
        {/* ICON */}
        <span className="text-lg">{tab.icon}</span>

        {/* LABEL */}
        <span className="text-sm font-medium">
          {tab.label}
        </span>
      </button>
    ))}

  </div>
</div>



      {/* STATS (UNCHANGED UI) */}
      <div className="max-w-7xl mx-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeStats.map((stat, i) => (
          <div key={i} className={`${stat.bg} text-black rounded-xl p-6`}>
            <p className="text-m pb-2">{stat.label}</p>
            <h3 className="text-3xl pb-2">{stat.value}</h3>
            <p className="text-sm">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* GRID */}
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {construction.map((p) => {
            const availableUnits = Number(p.availableUnits) || 0;
            const soldUnits = Number(p.soldUnits) || 0;
            const totalUnits = availableUnits + soldUnits;
            const percent = totalUnits > 0
              ? Math.round((soldUnits / totalUnits) * 100)
              : 0;

            return (
              <div key={p.id} className="bg-white rounded-2xl shadow border overflow-hidden w-full">

                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={p.images?.main?.[0]}
                    alt={p.title}
                    className="h-[220px] w-full object-cover"
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-2 w-fit">
                      <FaMapMarkerAlt />
                      {p.location?.address}
                    </div>
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="px-5 pt-4 text-lg text-black font-semibold">
                  {p.title}
                </h3>

                <div className="p-5 space-y-4">

                  {/* ROW 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Total Valuation</p>
                      <p className="text-[#0082ED] font-semibold text-lg">
                        {p.totalValuation}
                      </p>
                    </div>

                    {/* <div>
                      <p className="text-xs text-gray-500 uppercase">Investors</p>
                      <p className="text-[#0082ED] font-semibold text-lg">
                        {p.specifications?.totalInvestors ?? "-"}
                      </p>
                    </div> */}
                  </div>

                  {/* ROW 2 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Area</p>
                      <p className="text-[#0082ED] font-semibold text-lg">
                        {p.totalSqft}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase">Price / sqft</p>
                      <p className="text-[#0082ED] font-semibold text-lg">
                        {p.pricePerSqft ?? "-"}
                      </p>
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-black mb-1">
                      <span>Funding Progress</span>
                      <span>{percent}%</span>
                    </div>

                    <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4BDD96] to-[#3DB97D]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      navigate(`/user/property-investments/construction/${p.id}`, {
                        state: { property: p }
                      })
                    }
                    className="w-full py-3 rounded-[50px] bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black flex items-center justify-center gap-2"
                  >
                    {getButtonText(p.type)}
                    <FiArrowUpRight />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
