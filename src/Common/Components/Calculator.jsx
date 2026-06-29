import React, { useState, useEffect } from "react";
import { HiPlus, HiMinusSm } from "react-icons/hi";
import { FaInfoCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../../Admin/Service/publicApi";
import { useNavigate } from "react-router-dom";

export default function UnistraCalculator() {
  const [qty, setQty] = useState(1);
  const [plan, setPlan] = useState("one");
  const [priceType, setPriceType] = useState("market");
  const [selectedProperty, setSelectedProperty] = useState(null);
   const navigate = useNavigate();

  // ✅ API FETCH
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-properties"],
    queryFn: () => publicApi.getPublicProperties(),
  });

  const properties = data?.data || [];

  // ✅ DEFAULT SELECT
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
  }, [properties, selectedProperty]);

  // ✅ PRICE FROM API
  const trade = Number(
    selectedProperty?.
total_value_usd || 0
  );

  

  // let multiplier = 1;
  // if (plan === "monthly") multiplier = 30;
  // if (plan === "yearly") multiplier = 365;

  const total = trade ;

  // ✅ LOADING
  if (isLoading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  // ✅ ERROR
  if (error) {
    return <div className="text-red-500 text-center py-10">Error loading data</div>;
  }

  return (
    <div className="bg-black text-white px-3 md:px-6 xl:px-20 py-6 sm:py-10 text-center relative overflow-hidden">

      {/* Ribbon */}
      <div className="absolute left-[-100px] bg-[#FD0D0D] text-white px-[90px] py-2 rotate-[-45deg] font-semibold text-sm sm:text-base lg:text-xl z-10">
        COMING SOON
      </div>

      {/* Tag */}
      <p className="bg-[#DCFCE7] text-[#1A3C34] inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6 uppercase">
        IT’S YOUR MONEY, GROW IT
      </p>

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl mb-8">
        Now you start saving with{" "}
        <span className="text-[#0082ED]">GGL Unitra</span>
      </h2>

      {/* PLAN TOGGLE */}
      <div className="inline-flex bg-white rounded-full p-1 mb-4">
        {["one"].map((item) => {
          const isActive = plan === item;
          return (
            <button
              key={item}
              onClick={() => setPlan(item)}
              className={`px-4 py-2 rounded-full text-sm ${
                isActive
                  ? "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black"
                  : "text-gray-500"
              }`}
            >
              {item === "one" ? "One Time" : item}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mt-[30px] max-w-[1300px] mx-auto">

        {/* LEFT */}
        <div className="border bg-[#111] rounded-2xl p-4 w-full xl:w-[75%] flex flex-col justify-between">

  {/* TOP CONTENT */}
  <div className="flex flex-col lg:flex-row gap-4">

    {/* INPUT CARD */}
    <div className="bg-white rounded-2xl p-5 w-full lg:w-[55%] text-black flex flex-col justify-center min-h-[260px]">

  <div>
    <p className="text-sm mb-4">SQFT Quantity</p>

    {/* MARKET PRICE */}
    <div
      onClick={() => setPriceType("market")}
      className={`p-3 rounded-lg border mb-3 cursor-pointer ${
        priceType === "market" ? "bg-green-100 border-green-400" : ""
      }`}
    >
      <p>Market Price</p>
      <h4>₹{trade.toFixed(2)}</h4>
    </div>
  </div>

</div>

    {/* TOTAL CARD */}
   <div className="bg-white rounded-2xl p-6 w-full lg:w-[45%] text-black flex flex-col justify-center min-h-[260px]">

  <div>
    <p>Total Amount Payable*</p>
    <h2 className="text-2xl font-bold mt-2">₹{total.toFixed(2)}</h2>

    <div className="mt-5 space-y-3">
      <div className="flex justify-between">
        <span>Trade Value</span>
        <span>₹{trade.toFixed(2)}</span>
      </div>
    </div>
  </div>

</div>

  </div>

  {/* FOOTER */}
  <div className="flex justify-between items-center mt-6">
    <button 
      onClick={() => navigate("/user/signup")}
      className="border border-green-400 text-green-400 px-4 py-2 rounded-full"
    >
      Know More
    </button>

    <button
      onClick={() => navigate("/user/signup")}
      className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] px-6 py-2 rounded-full text-white flex items-center gap-1"
    >
      Buy Now <MdKeyboardArrowRight />
    </button>
  </div>

</div>

        {/* RIGHT */}
        <div className="border bg-[#111] rounded-2xl p-4 w-full xl:w-[25%]">

          <div className="bg-gray-100 rounded-xl p-4">

            <h3 className="text-black mb-4 font-semibold">
              Related Opportunities
            </h3>

            <div className="space-y-4 max-h-[320px] overflow-y-auto">

              {properties.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedProperty(item)}
                  className={`flex gap-3 cursor-pointer p-2 rounded ${
                    selectedProperty?._id === item._id
                      ? "bg-green-200"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    className="w-12 h-12 rounded object-cover"
                  />

                  <div>
                    <h4 className="text-sm font-semibold text-black">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#0082ED]">
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}