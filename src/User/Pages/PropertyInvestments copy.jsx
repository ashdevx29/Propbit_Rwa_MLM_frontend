import { useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { PiFlaskBold } from "react-icons/pi";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReadymadeProperties } from "../Data/readymadeProperties";
import { getTokenizedProperties } from "../Data/tokenizedProperties";
import { getUnderConstructionProperties } from "../Data/UnderConstructionProperties";

import { FiArrowUpRight } from "react-icons/fi";
import { IoTrendingUpOutline } from "react-icons/io5";
import { LuLock } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { IoAnalyticsOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

const TABS = [
  { key: "readymade", label: "Readymade Project", des: "Fixed rental income", icon: <AiOutlineHome /> },
  { key: "tokenized", label: "OneTimeBuy Project", des: "Blockchain ownership", icon: <BiDollarCircle /> },
  { key: "construction", label: "Under Construction", des: "Secured income during build", icon: <PiFlaskBold /> },
];

const STATS_BY_TAB = {
  construction: [
    { label: "Total Properties", value: "248", sub: "Available for investment", bg: "bg-[#CCFFE5]" },
    { label: "Avg. APR", value: "11.2%", sub: "Annual return rate", bg: "bg-[#94D8FF]" },
    { label: "Total Invested", value: "24.5M", sub: "Platform wide", bg: "bg-[#BBADFF]" },
    { label: "Avg APR", value: "112%", sub: "Verified users", bg: "bg-[#FFE3BF]" },
  ],
};

export default function Investments() {
  const [activeTab, setActiveTab] = useState("construction");

  const activeStats = STATS_BY_TAB[activeTab] || [];
  // const [construction, setConstruction] = useState([]);
  // const [loading, setLoading] = useState({ construction: true });
  const {
  data: construction = [],
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["underConstructionProperties"],
  queryFn: getUnderConstructionProperties,
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000,
});

  const navigate = useNavigate();

  // useEffect(() => {
  //   const loadConstruction = async () => {
  //     try {
  //       const data = await getUnderConstructionProperties();
  //       setConstruction(data || []);
  //     } catch (e) {
  //       setConstruction([]);
  //     } finally {
  //       setLoading({ construction: false });
  //     }
  //   };
  //   loadConstruction();
  // }, []);

  // const filtered = construction; // only construction properties
  // const isLoading = loading.construction;
  const filtered = construction;
  console.log("FINAL DATA:", construction);
  console.log(filtered)
  return (
    <div className="space-y-8 dmfont">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#101828] droxen-font">
            Investment
          </h2>
          <p className="text-[16px] text-[#4A5565] mt-2 gued-font">
            Explore investment opportunities in real estate
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-[#EEF2F6] px-4 py-2 rounded-full w-full md:w-[350px]">
            <svg className="w-5 h-5 text-[#6B7280] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
            <input type="text" placeholder="Search Properties" className="bg-transparent outline-none w-full text-[#6B7280]" />
          </div>

          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E2E8F0] cursor-pointer">
            <svg className="w-5 h-5 text-[#475467]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 gued-font">
        {activeStats.map((stat, i) => (
          <div key={i} className={`${stat.bg} text-black rounded-xl p-6`}>
            <p className="text-m font-Regular pb-2">{stat.label}</p>
            <h3 className="text-3xl font-SemiBold pb-2">{stat.value}</h3>
            <p className="text-sm font-Regular">{stat.sub}</p>
          </div>
        ))}
      </div>

{isError && (
  <div className="text-center py-10 text-red-500">
    {error?.message || "Something went wrong"}
  </div>
)}
      {/* ================= PROPERTY GRID ================= */}
      {/* {isLoading ? (
        <div className="text-center py-20">
          <p className="text-lg text-[#4A5565]">Loading investment opportunities...</p>
        </div>
      ) : filtered.length === 0 ? ( */}
      {isLoading ? (
  <div className="text-center py-20">
    <p className="text-lg text-[#4A5565]">
      Loading investment opportunities...
    </p>
  </div>
) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-[#4A5565]">No properties available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-[#FFFFFF] rounded-2xl shadow border border-[#E5E7EB] overflow-hidden">
              <div className="relative">
                <img src={p.images?.[0] || p.image} alt={p.title} className="h-[256px] w-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#4BDD96E5] text-black text-xs px-3 py-1 rounded-full">For Sale</span>
                <span className="absolute top-3 right-3 bg-[#FFFFFFF2] text-[#101828] text-xs px-3 py-1 rounded-full">
                  {p.risklevel || "Medium Risk"}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-1">
                  <div className="bg-[#0F172A99] flex gap-2 p-2 rounded-xl"><FaMapMarkerAlt className="text-white" /><p className="text-white font-medium text-xs">{p.location || "No Location"}</p></div>
                </div>
              </div>
                  <h3 className="text-black text-left pl-5 font-normal capitalize text-xl">{p.title || "No Title"}</h3>


       
              <div className="p-5 space-y-5">
                {/* <div className="bg-gradient-to-br from-[#4bdd962b] to-[#4bdd961e] border border-[#FFEDD4] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-sm font-medium text-[#101828]">Construction Progress</p>
                      <p className="text-xs text-[#4A5565]">{p.constructionprogress || "N/A"}</p>
                    </div>
                    <p className="text-[#4bdd96] font-bold text-2xl">{p.overallprogress ?? 0}%</p>
                  </div>
                  <div className="h-2.5 bg-[#FFFFFF] border border-[#FFEDD4] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-2.5 bg-gradient-to-r from-[#FF6900] to-[#FE9A00] rounded-full transition-all duration-500"
                      style={{ width: `${p.overallprogress ?? 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-normal text-xs text-[#4A5565] mt-2">
                    <span>Started: {p.Started || "N/A"}</span>
                    <span>Expected: {p.sidebar?.completion || "N/A"}</span>
                  </div>
                </div> */}
                <div
  className="h-2.5 bg-[linear-gradient(to_right,#4bdd96e5_0%,#4bdd96e5_var(--progress),white_var(--progress))] rounded-full transition-all duration-500"
  style={{ "--progress": `${p.sidebar?.funprogress || 0}%` }}
/>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6A7282] uppercase">Total Valuation</p>
                    {/* <p className="text-[#00A63E] font-semibold text-lg">45,600</p> */}
                    <p className="text-[#00A63E] font-semibold text-lg">
  {p.sidebar?.totalValue || 0}
</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6A7282] uppercase">total Investors</p>
                    {/* <p className="font-semibold text-lg text-[#101828]">170</p> */}
                    <p className="font-semibold text-lg text-[#101828]">
  {p.sidebar?.investors || 0}
</p>
                  </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6A7282] uppercase">Total area</p>
                    {/* <p className="text-[#00A63E] font-semibold text-lg">2,450 sqft</p> */}
                    <p className="text-[#00A63E] font-semibold text-lg">
  {p.sidebar?.totalArea || 0} sqft
</p>
                    {/* <p className="text-[#00A63E] font-semibold text-lg">{p.sidebar?.expectedROI || "N/A"}</p> */}
                  </div>
                  <div>
                    <p className="text-sm text-[#6A7282]  uppercase">Per soft price</p>
                    {/* <p className="font-semibold text-lg text-[#101828]">${p.sidebar?.minInv || 0}</p> */}
                    {/* <p className="font-semibold text-lg text-[#101828]">$1,734</p> */}
                    <p className="font-semibold text-lg text-[#101828]">
  ${p.sidebar?.pricePerSqft || 0}
</p>
                  </div>
                </div>
<div className="flex justify-between text-black">
  <p>Funding Progress</p>
  {/* <p>90%</p> */}
  <p>{p.sidebar?.funprogress || 0}%</p>
</div>
<div className="h-2.5 bg-[#4bdd96ef] border border-[#FFEDD4] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-2.5 bg-[linear-gradient(to_right,#4bdd96e5_90%,white_90%)] rounded-full transition-all duration-500"
                      
                    />
                  </div>
                <button
                  onClick={() => navigate(`/user/property-investments/construction/${p.id}`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4bdd96e5] to-[#4bdd96e5] text-black flex items-center justify-center gap-2 gued-font"
                >
                  View Progress & Invest Now
                  <FiArrowUpRight className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}