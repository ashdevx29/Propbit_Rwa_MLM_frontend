import { useState, useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";
import { appConfig } from "../../../../config/appConfig.js";

import {
  FaHeart,
  FaShareAlt,
  FaBed,
  FaBath,
  FaExpandArrowsAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { GrDocumentText } from "react-icons/gr";
import { HiDownload } from "react-icons/hi";
import { CiShoppingCart } from "react-icons/ci";

const STAT_CONFIG = [
  { key: "beds", label: "Bedrooms", icon: <FaBed />, color: "text-blue-600" },
  { key: "baths", label: "Bathrooms", icon: <FaBath />, color: "text-purple-600" },
  { key: "area", label: "Total Area", icon: <FaExpandArrowsAlt />, color: "text-[#0082ED]" },
  { key: "listed", label: "Listed", icon: <FaCalendarAlt />, color: "text-orange-600" },
];







export default function ReadymadeLeft({ property, activeTab, setActiveTab }) {

  // const [activeTab, setActiveTab] = useState("About Property");
  const financialRef = useRef(null);

  // const [activeImage, setActiveImage] = useState(property?.image || "");
  const [selectedSlots, setSelectedSlots] = useState(0); // user selected slots
  const [animating, setAnimating] = useState(false);

  const mobileGalleryRef = useRef(null);

  if (!property) {
    return (
      <div className="bg-white rounded-2xl border p-6 text-center text-gray-500">
        Property details are loading...
      </div>
    );
  }

  const images =
    Array.isArray(property?.gallery) && property.gallery.length > 0
      ? property.gallery
      : property?.image
        ? [property.image]
        : [];

  const totalImages = images.length;

  const [activeIndex, setActiveIndex] = useState(0);


  const { data: dashboardData } = useQuery({
    queryKey: ["dashboardData"], // same key as Dashboard page
    queryFn: async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const response = await fetch(`${appConfig.baseURL}/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // const MIN_INVEST = 5;
  const MIN_INVEST = property?.minInvestment ?? 0;
  // const walletBalance = property?.walletBalance || 500;
  const walletBalance = dashboardData?.wallets?.depositWallet
    ? Number(
      dashboardData.wallets.depositWallet
        .replace("$", "")
        .replace(/,/g, "")
    )
    : 0;

  const [priceValue, setPriceValue] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [showDropdown, setShowDropdown] = useState(false);

  const [percent, setPercent] = useState(0);

  const currencyOptions = ["USDT"];

  const numericAmount = Number(totalValue) || 0;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTotalValue(value);

    const calcPercent =
      walletBalance > 0 ? (value / walletBalance) * 100 : 0;

    setPercent(Math.min(100, Math.max(0, calcPercent)));
  };

  const handleSliderClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = (clickX / rect.width) * 100;

    const finalPercent = Math.min(100, Math.max(0, newPercent));
    setPercent(finalPercent);

    const calculatedAmount = (walletBalance * finalPercent) / 100;
    setTotalValue(calculatedAmount.toFixed(2));
  };







  useEffect(() => {
    if (!totalImages || totalImages <= 4) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev + 1 >= totalImages ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [totalImages]);




  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "document.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };



  // Calculate filled slots
  const totalSlots = property.totalSlots || 100;
  const availableTokens = property.availableTokens || 0;
  const availableSlots = Math.floor(availableTokens / (property.tokensPerSlot || 100));
  const filledPercentage = totalSlots > 0 ? ((totalSlots - availableSlots) / totalSlots) * 100 : 0;


  const visibleImages = [];

  if (totalImages > 0) {
    for (let i = 0; i < Math.min(4, totalImages); i++) {
      visibleImages.push(
        images[(activeIndex + i) % totalImages]
      );
    }
  }




  return (
    <div className="bg-white rounded-2xl border p-3 md:p-6 space-y-6 shadow-sm">
      {/* ===================== GALLERY ===================== */}
      <div className="grid grid-cols-12 gap-4">
        <div className="hidden md:block col-span-2 space-y-4">
          {/* {property.gallery?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumbnail ${i + 1}`}
              onClick={() => {
                if (img === activeImage) return;
                setAnimating(true);
                setTimeout(() => {
                  setActiveImage(img);
                  setAnimating(false);
                }, 200);
              }}
              className={`w-full h-[82px] object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${activeImage === img ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                }`}
            />
          ))} */}
          {visibleImages.map((img, index) => {
            const realIndex = (activeIndex + index) % totalImages;

            return (
              <img
                key={realIndex}
                src={img}
                alt={`Thumbnail ${realIndex + 1}`}
                onClick={() => setActiveIndex(realIndex)}
                className={`w-full h-[82px] object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${index === 0
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
                  }`}
              />
            );
          })}

        </div>

        <div className="col-span-12 md:col-span-10 relative overflow-hidden rounded-2xl shadow-lg">
          <img
            key={activeIndex}
            src={images[activeIndex] || property.image}

            // key={activeImage}
            // src={activeImage || property.image}
            alt={property.title}
            className={`w-full h-[260px] md:h-[420px] object-cover rounded-2xl transition-all duration-700 ease-in-out ${animating ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
          />

          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow">
              {property.risk}
            </span>
            <div className="flex gap-2">
              <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow hover:bg-white">
                <FaHeart className="text-lg" />
              </button>
              <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow hover:bg-white">
                <FaShareAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile thumbnails */}
      <div className="md:hidden overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 pb-2" ref={mobileGalleryRef}>
          {/* {property.gallery?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Mobile ${i + 1}`}
              onClick={() => {
                setAnimating(true);
                setTimeout(() => {
                  setActiveImage(img);
                  setAnimating(false);
                }, 200);
              }}
              className={`flex-shrink-0 w-[110px] h-[85px] object-cover rounded-lg cursor-pointer border-2 transition-all ${activeImage === img ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
            />
          ))} */}
          {visibleImages.map((img, index) => {
            const realIndex = (activeIndex + index) % totalImages;

            return (
              <img
                key={realIndex}
                src={img}
                alt={`Mobile ${realIndex + 1}`}
                onClick={() => setActiveIndex(realIndex)}
                className={`flex-shrink-0 w-[110px] h-[85px] object-cover rounded-lg cursor-pointer border-2 ${index === 0
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200"
                  }`}
              />
            );
          })}

        </div>
      </div>

      {/* ===================== TITLE & LOCATION ===================== */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {property.title || "Property Title"}
        </h1>
        <p className="flex items-center gap-2 text-gray-600 text-base md:text-lg">
          <MdLocationOn className="text-red-500" />
          {property.location || "Location not available"}
        </p>
      </div>

      {/* ===================== STATS ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CONFIG.map((item) => (
          <div
            key={item.key}
            className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${item.color} bg-opacity-10`}>
              <span className="text-3xl">{item.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {property.stats?.[item.key] ?? property[item.key] ?? "—"}

              {/* {property[item.key] ?? "—"} */}
            </p>
            <p className="text-sm text-gray-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* ===================== TABS ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
        {["About Property", "Financial Details", "Documents", "Location"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-center font-medium rounded-xl transition-all duration-300 border
              ${activeTab === tab
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===================== ABOUT PROPERTY ===================== */}
      {activeTab === "About Property" && (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description || "No description available for this property."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Amenities & Features</h2>
            {property.amenities?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3"
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed for this property.</p>
            )}
          </div>
        </div>
      )}

      {/* ===================== FINANCIAL DETAILS WITH SLOTS ===================== */}
      {/* {activeTab === "Financial Details" && (
        <div className="space-y-10"> */}
      {activeTab === "Financial Details" && (
        <div ref={financialRef} className="space-y-10">

          <h2 className="text-2xl font-semibold text-gray-900">Investment Metrics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <p className="text-sm text-blue-700 font-medium uppercase tracking-wide mb-1">
                Annual Yield
              </p>
              <p className="text-3xl font-bold text-blue-700">
                {property?.financials?.metrics?.annualYield ?? "—"}%
              </p>
              <p className="text-sm text-gray-600 mt-2">Expected return</p>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
              <p className="text-sm text-green-700 font-medium uppercase tracking-wide mb-1">
                Rental Income
              </p>
              <p className="text-3xl font-bold text-green-700">
                {property?.financials?.metrics?.rentalIncome ?? "—"}%
              </p>
              <p className="text-sm text-gray-600 mt-2">Of investment</p>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 text-center">
              <p className="text-sm text-purple-700 font-medium uppercase tracking-wide mb-1">
                Value Growth
              </p>
              <p className="text-3xl font-bold text-purple-700">
                {property?.financials?.metrics?.valueGrowth ?? "—"}%
              </p>
              <p className="text-sm text-gray-600 mt-2">Expected annually</p>
            </div>
          </div>


          {/* ===================== PROPERTY SCORE BREAKDOWN ===================== */}
          {property?.financials?.breakdown?.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Property Score Breakdown
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-gradient-to-br p-3 rounded-md from-[#EEF2FF] to-[#F5FAFF]">
                {property.financials.breakdown.map((item, index) => {
                  const percent = item.max > 0 ? (item.value / item.max) * 100 : 0;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-700 font-medium">
                        <span>{item.label}</span>
                        <span>
                          {item.value}/{item.max}
                        </span>
                      </div>

                      <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percent}%`,
                            background:
                              "linear-gradient(90deg, #6390FF 0%, #11006E 100%)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}




          <div className="mt-12 bg-white rounded-3xl border border-gray-200 shadow-md p-8 space-y-8">

            {/* HEADER */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                Invest Now
              </h3>
            </div>

            {/* PRICE ROW */}
            <div className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded-xl px-6 py-5">

              <span className="text-gray-800 text-lg font-medium">
                Price
              </span>

              <span className="text-2xl font-bold text-blue-600">
                {property?.pricePerSlot
                  ? `${property.pricePerSlot.toLocaleString()} ${selectedCurrency}`
                  : "N/A"}
              </span>

            </div>

            {/* TOTAL ROW */}
            <div className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded-xl px-6 py-5">

              <span className="text-gray-800 text-lg font-medium">
                Total
              </span>

              <div className="flex items-center gap-3">

                <input
                  type="number"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  placeholder={`amount`}
                  // placeholder={`Min $${MIN_INVEST}`}
                  className="w-32 bg-white border border-gray-400 rounded-lg px-3 py-2 text-right text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-white border border-gray-400 px-3 py-2 rounded-lg text-md font-semibold text-gray-900 hover:border-blue-500 transition"
                  >
                    {selectedCurrency} ▾
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white border  text-black border-gray-200 rounded-xl shadow-lg w-28 z-50">
                      {currencyOptions.map((currency) => (
                        <div
                          key={currency}
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {currency}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* SLIDER */}
            <div>
              <div
                onClick={handleSliderClick}
                className="relative h-4 bg-gray-300 rounded-full cursor-pointer"
              >
                <div
                  className="absolute left-0 top-0 h-4 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />

                <div
                  className="absolute top-1/2 w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow-md transform -translate-y-1/2 transition-all duration-300"
                  style={{ left: `calc(${percent}% - 10px)` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* BALANCE INFO */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-sm">

              <div className="flex justify-between text-gray-900">
                <span className="text-gray-800 text-lg font-medium">Available Balance</span>
                <span className="font-semibold text-gray-900 text-lg ">
                  {walletBalance} {selectedCurrency}
                </span>
              </div>

              <div className="flex justify-between text-gray-900">
                <span className="text-gray-800 text-lg font-medium">Max Buy</span>
                <span className="font-semibold text-gray-900 text-lg ">
                  {walletBalance} {selectedCurrency}
                </span>
              </div>

            </div>

            {/* CTA BUTTON */}
            <button
              disabled={numericAmount < MIN_INVEST}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300
      ${numericAmount >= MIN_INVEST
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {numericAmount >= MIN_INVEST
                ? "Buy Property"
                : `Min $${MIN_INVEST} Required`}
            </button>

          </div>


          {/* <div className="space-y-8 mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-200">



            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Invest Now
              </h3>

            </div>


            <div className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-4 bg-gray-50">
              <span className="text-gray-600 text-sm font-medium">
                Price
              </span>

              <span className="text-right text-lg font-semibold text-gray-900">
                {property?.pricePerSlot
                  ? `${property.pricePerSlot.toLocaleString()} ${selectedCurrency}`
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-4 bg-gray-50">

              <span className="text-gray-600 text-sm font-medium">
                Total
              </span>

              <div className="flex items-center gap-3">

                <input
                  type="number"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  placeholder={`Min ${MIN_INVEST}`}
                  className="bg-transparent outline-none text-right text-lg font-semibold text-gray-900 w-28 placeholder:text-gray-400"
                />

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 transition"
                  >
                    {selectedCurrency} ▾
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white border text-gray-700 border-gray-200 rounded-xl shadow-lg w-28 z-50">
                      {currencyOptions.map((currency) => (
                        <div
                          key={currency}
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {currency}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div
                onClick={handleSliderClick}
                className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
              >
                <div
                  className="absolute left-0 top-0 h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />

                <div
                  className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow transform -translate-y-1/2 transition-all duration-300"
                  style={{ left: `calc(${percent}% - 8px)` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>



            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Available Balance</span>
                <span className="font-medium text-gray-900">
                  {walletBalance} {selectedCurrency}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Max Buy</span>
                <span className="font-medium text-gray-900">
                  {walletBalance} {selectedCurrency}
                </span>
              </div>
            </div>

            <button
              disabled={numericAmount < MIN_INVEST}
              className={`w-full py-3 rounded-xl font-semibold transition-all
                  ${numericAmount >= MIN_INVEST
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {numericAmount >= MIN_INVEST
                ? "Buy Property"
                : `Min ${MIN_INVEST} Required`}
            </button>

          </div> */}


        </div>
      )}

      {/* ===================== DOCUMENTS & LOCATION TABS (same as before) ===================== */}
      {activeTab === "Documents" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Legal Documents</h2>
          {property.documents?.length > 0 ? (
            <div className="space-y-4">
              {property.documents.map((doc, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 rounded-xl p-4 border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <GrDocumentText className="text-2xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-500">{doc.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.link, doc.name)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <HiDownload /> Download
                  </button>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No documents available.</p>
          )}
        </div>
      )}

      {activeTab === "Location" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Location</h2>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden border shadow">
            <iframe
              title="Property Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(property.location || "Bhopal")}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}






