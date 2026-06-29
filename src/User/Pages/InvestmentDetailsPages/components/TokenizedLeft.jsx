import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoLocationOutline, IoTrendingUpOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { CiHeart, CiShare2 } from "react-icons/ci";
import { FiShield } from "react-icons/fi";
import { FiLink } from "react-icons/fi";
import { LuBed } from "react-icons/lu";
import { LuBath } from "react-icons/lu";
import { CgArrowsExpandRight } from "react-icons/cg";
import { GoDotFill } from "react-icons/go";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { SlBasket } from "react-icons/sl";
import { IoAnalyticsOutline } from "react-icons/io5";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import axios from "axios";
import { appConfig } from "../../../../config/appConfig";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "buy", label: "Buy Properties" },
  { key: "marketplace", label: "Token Marketplace" },
  { key: "documents", label: "Documents" },
];

export default function TokenizedLeft({ property }) {
  const location = useLocation();
  const buyTabRef = useRef(null);
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || "overview"
  );

  useEffect(() => {
    if (location.state?.tab === "buy") {
      setActiveTab("buy");

      setTimeout(() => {
        buyTabRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [location.state]);



  const [isBuying, setIsBuying] = useState(false);


  const [tokensToBuy, setTokensToBuy] = useState(10);
  const [transferTokens, setTransferTokens] = useState(10);
  const [transferWallet, setTransferWallet] = useState("");

  const tokenPrice = property.tokenPrice;
  const available = property.avaitoken;
  const totalInvestment = tokensToBuy * tokenPrice;

  const navigate = useNavigate();
  const images = Array.isArray(property?.images) && property.images.length > 0
    ? property.images
    : property?.image
      ? [property.image]
      : [];

  const totalImages = images.length;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
  if (!totalImages || totalImages <= 4) return;

  const interval = setInterval(() => {
    setActiveIndex((prev) =>
      prev + 1 >= totalImages ? 0 : prev + 1
    );
  }, 3000);

  return () => clearInterval(interval);
}, [totalImages]);


  // const [activeImage, setActiveImage] = useState(
  //   property.images?.[0] || property.image
  // );

  const handleBuyTokens = async () => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      toast.warning("Please login to continue and buy Properties");
      return;
    }

    try {
      setIsBuying(true); // 👈 START LOADER

      const payload = {
        propertyId: property.backendId,
        amount_usd: totalInvestment,
        investment_type: "TOKENIZED",
      };

      await axios.post(
        `${appConfig.baseURL}/user/properties/invest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Tokens purchased successfully. Investment added to your account."
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Unable to complete the purchase. Please try again later."
      );
    } finally {
      setIsBuying(false); // 👈 STOP LOADER
    }
  };


  const handleTransferTokens = async () => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      toast.warning("Please login to transfer tokens");
      return;
    }

    if (!transferWallet) {
      toast.error("Please enter a valid wallet address");
      return;
    }

    try {
      const payload = {
        propertyId: property.backendId,
        toWallet: transferWallet,
        tokens: transferTokens,
      };

      const res = await axios.post(
        `${appConfig.baseURL}/user/properties/transfer-tokens`, // Adjust endpoint as per your API
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Tokens transferred successfully");

      setTransferWallet("");
      setTransferTokens(10);

    } catch (error) {
      console.error(
        "Transfer Token Error:",
        error?.response?.status,
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to complete the transfer. Please try again later."
      );
    }
  };


  const visibleImages = [];

  if (totalImages > 0) {
    for (let i = 0; i < Math.min(4, totalImages); i++) {
      visibleImages.push(
        images[(activeIndex + i) % totalImages]
      );
    }
  }




  return (
    <div className="space-y-6">

      <div
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 cursor-pointer 
                  text-[#4A5565] text-md font-semibold 
                  hover:text-[#101828] transition"
      >
        <FaArrowLeft className="text-lg" />
        <span>Back to Tokenized Properties</span>
      </div>

      {/* IMAGE */}
      <div className="
  flex flex-col sm:flex-row
  gap-4
  bg-white rounded-lg p-4
">

        {/* LEFT THUMBNAILS */}
        <div
          className="
            flex flex-row sm:flex-col
            gap-3
            order-2 sm:order-1
            overflow-x-auto sm:overflow-visible
            scrollbar-hide
          "
        >

          {visibleImages.map((img, index) => {
            const realIndex = (activeIndex + index) % totalImages;

            return (
              <button
                key={realIndex}
                onClick={() => setActiveIndex(realIndex)}
                className={`w-20 h-16 sm:w-24 sm:h-20
        shrink-0
        rounded-xl overflow-hidden
        border-2 transition
        ${index === 0
                    ? "border-[#2460F5]"
                    : "border-transparent"
                  }`}
              >
                <img
                  src={img}
                  alt="thumbnail"
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </button>
            );
          })}


          {/* {property.images?.length > 0 &&
          property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`
                  w-20 h-16 sm:w-24 sm:h-20
                  shrink-0
                  rounded-xl overflow-hidden
                  border-2 transition
                  ${activeImage === img ? "border-[#2460F5]" : "border-transparent"}
                `}
              >
                <img
                  src={img}
                  alt="thumbnail"
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </button>
            ))} */}




        </div>

        {/* FEATURE IMAGE */}
        <div className="
    relative
    rounded-3xl overflow-hidden
    flex-1
    order-1 sm:order-2
  ">
          <img
            src={images[activeIndex] || "/placeholder.jpg"}
            // src={activeImage}
            alt={property.title}
            className="
              w-full
              h-[240px] sm:h-[356px]
              object-cover
              transition-all duration-300
            "
          />

          {/* BADGES */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <IoTrendingUpOutline /> +{property.growth}%
            </span>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              {property.chain}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center 
                   bg-white rounded-full shadow 
                   hover:bg-gray-100 transition"
            >
              <CiHeart className="text-lg text-[#101828]" />
            </button>

            <button
              className="w-9 h-9 flex items-center justify-center 
                   bg-white rounded-full shadow 
                   hover:bg-gray-100 transition"
            >
              <CiShare2 className="text-lg text-[#101828]" />
            </button>
          </div>
        </div>

      </div>


      {/* TITLE */}
      <div>
        <h2 className="text-4xl font-semibold text-[#000] mb-1">
          {property.title}
        </h2>
        <p className="flex items-center gap-2 text-[#000000E5] font-medium text-lg">
          <IoLocationOutline className="text-xl" />
          <span>{property.location}</span>
        </p>

      </div>

      <div className="sm:p-4 p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB]">

        <div className="bg-white border-b border-[#E5E7EB]">


          <div className="grid grid-cols-2 sm:flex sm:gap-6 px-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium text-left
        ${activeTab === tab.key
                    ? "sm:border-b-2 sm:border-[#2460F5] text-[#155DFC]"
                    : "text-[#4A5565]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>



        </div>

        {activeTab === "overview" && (
          <div className="space-y-6 p-4">

            {/* ABOUT */}
            <div className="">
              <h3 className="font-semibold text-xl text-[#101828] mb-1">About This Property</h3>
              <p className="text-sm text-[#4A5565] text-md font-normal leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* BLOCKCHAIN INFO */}
            <div className="bg-gradient-to-br from-[#F5F6FF] to-[#EFF6FF] border border-[#F3E8FF] rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-xl text-[#101828] mb-1">Blockchain Information</h3>
              <InfoRow label="Network" value={property.network} />
              <InfoRow
                label="Smart Contract"
                value={
                  <span className="inline-flex items-center gap-2 text-[#2460F5] cursor-pointer hover:underline">
                    <span className="text-[#155DFC] text-sm">{property.token_address}</span>
                    <FiLink className="text-xl text-[#6A7282]" />
                  </span>
                }
              />

              <InfoRow
                label="Total Supply"
                value={property.totalSupply}
              />
              <InfoRow
                label="Transferable"
                value={
                  <span className="flex items-center gap-1 text-[#00A63E]">
                    <FiShield /> {property.transferable}
                  </span>
                }
              />
            </div>

            {/* PROPERTY DETAILS */}
            <div className="py-2">
              <h3 className="font-semibold text-xl text-[#101828] mb-4">Property Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#F9FAFB] rounded-xl p-4 text-[#4A5565]">

                  <p className="flex items-center gap-1 text-sm mb-1 gap-2 ">
                    <LuBed className="text-sm" />
                    <span>Bedrooms</span>
                  </p>
                  <p className="font-semibold text-2xl text-[#101828]">{property.beds}</p>
                </div>

                <div className="bg-[#F9FAFB] rounded-xl p-4 text-[#4A5565]">
                  <p className="flex items-center text-sm mb-1 gap-2 ">
                    <LuBath className="text-sm" />
                    <span>Bathrooms</span>
                  </p>
                  <p className="font-semibold text-2xl text-[#101828]">{property.baths}</p>
                </div>
                <div className="bg-[#F9FAFB] rounded-xl p-4 text-[#4A5565]">
                  <p className="flex items-center text-sm mb-1 gap-2 ">
                    <CgArrowsExpandRight className="text-sm" />
                    <span>Area</span>
                  </p>
                  <p className="font-semibold text-2xl text-[#101828]">{property.area}</p>
                </div>
              </div>
            </div>

            {/* TOKEN PRICE HISTORY */}
            <div className="">
              <h3 className="font-semibold text-xl text-[#101828] mb-4">Token Price History</h3>
              <div className="bg-[#F3FAFF] rounded-2xl p-5 space-y-6">

                {/* TOP STATS */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-[#6A7282] mb-1">
                      Current Token Price
                    </p>
                    <p className="text-3xl font-semibold text-[#101828]">
                      ${property.tokenPrice}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#6A7282] mb-1">
                      Since Launch
                    </p>
                    <p className="text-sm font-semibold text-[#0082ED]">
                      +{property.growth}%
                    </p>
                  </div>
                </div>

                {/* CHART PLACEHOLDER */}
                <div className="h-32 rounded-xl flex items-end justify-between px-4 pb-3 text-xs text-[#6A7282]">
                  {["8", "9", "10", "11", "12", "13"].map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>

              </div>
            </div>


          </div>
        )}



        {activeTab === "buy" && (
          <div ref={buyTabRef} className="p-4 space-y-6">

            {/* ================= PURCHASE TOKENS ================= */}
            <div className="rounded-2xl bg-gradient-to-br from-[#F5FBFF] to-[#EFF6FF] p-4">

              <p className="text-xl font-semibold text-[#101828] mb-3">
                Purchase Tokens
              </p>

              {/* Number of Tokens */}
              <div className="mb-4">
                <p className="text-sm text-[#364153] font-medium mb-2">
                  Number of Tokens
                </p>

                <input
                  type="text"
                  inputMode="numeric"
                  value={tokensToBuy}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v) && v >= 0 && v <= available) {
                      setTokensToBuy(v);
                    }
                  }}
                  className="
                        w-full h-[44px]
                        rounded-xl
                        border border-[#E5E7EB]
                        px-4 py-2
                        text-2xl text-[#101828]
                        font-bold
                        outline-none my-3
                      "
                />

                <p className="text-sm font-medium text-[#4A5565] mt-1">
                  Available tokens: {property.avaitoken}
                </p>
              </div>

              {/* SUMMARY BOX */}
              <div className="bg-white rounded-xl px-1 sm:px-4 py-3 text-sm font-medium space-y-2">

                <div className="flex justify-between mb-3">
                  <span className="text-[#4A5565]">Token Price</span>
                  <span className="font-bold text-base sm:text-xl text-[#101828]">
                    ${tokenPrice}
                  </span>

                </div>

                <div className="flex justify-between  mb-3">
                  <span className="text-[#4A5565]">Tokens to Buy</span>
                  <span className="font-bold text-base sm:text-xl text-[#155DFC]">
                    {tokensToBuy}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-[#4A5565]">Total Investment</span>
                  <span className="font-bold text-base sm:text-xl text-[#00A63E]">
                    ${totalInvestment}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-[#4A5565]">Current Value</span>
                  <span className="font-bold text-base sm:text-xl text-[#16A34A]">
                    ${totalInvestment}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-[#4A5565]">Potential Gain</span>
                  <span className="font-bold text-base sm:text-xl text-[#16A34A]">
                    +$0 (0.0%)
                  </span>
                </div>

              </div>

              {/* BUY BUTTON */}
              <button
                disabled={tokensToBuy <= 0 || isBuying}
                onClick={handleBuyTokens}
                className={`
                  mt-4 w-full h-[44px]
                  flex items-center justify-center gap-2
                  rounded-xl
                  bg-gradient-to-r from-[#2460F5] to-[#3B1DDA]
                  shadow-[0px_4px_6px_-4px_rgba(70,110,255,0.3),_0px_10px_15px_-3px_rgba(70,104,255,0.3)]
                  text-white text-sm font-semibold
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:brightness-110
                `}
              >
                {isBuying ? (
                  <>
                    {/* Loader */}
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <SlBasket className="text-lg" />
                    <span>Buy Properties – ${totalInvestment}</span>
                  </>
                )}
              </button>



            </div>

            {/* ================= TRANSFER TOKENS ================= */}
            <div className="rounded-2xl border border-[#DBEAFE] bg-gradient-to-br from-[#EFF6FF] to-[#ECFEFF] p-4">

              <p className="text-xl font-semibold text-[#101828] mb-3">
                Transfer Tokens
              </p>

              {/* Wallet */}
              <div className="mb-4">
                <p className="text-sm text-medium text-[#364153] mb-1">
                  Recipient Wallet Address
                </p>

                <input
                  value={transferWallet}
                  onChange={(e) => setTransferWallet(e.target.value)}
                  placeholder="0x..."
                  className="
                        w-full h-[44px]
                        rounded-xl
                        border border-[#E5E7EB]
                        px-4
                        text-sm
                        text-[#101828]
                        outline-none
                      "
                />
              </div>

              {/* Tokens */}
              <div className="mb-4">
                <p className="text-sm text-medium text-[#364153] mb-1">
                  Number of Tokens
                </p>

                <input
                  type="text"
                  inputMode="numeric"
                  value={transferTokens}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v) && v >= 0) {
                      setTransferTokens(v);
                    }
                  }}
                  className="
                        w-full h-[44px]
                        rounded-xl
                        border border-[#E5E7EB]
                        px-4
                        text-sm
                        text-[#101828]
                        outline-none
                      "
                />
              </div>

              <button
                disabled={!transferWallet || transferTokens <= 0}
                onClick={handleTransferTokens}
                className={`
                      w-full h-[44px]
                      flex items-center justify-center gap-2
                      rounded-xl
                      bg-gradient-to-r from-[#2460F5] to-[#3B1DDA]
                      text-white text-sm font-semibold
                      transition-all duration-200
                      hover:brightness-110
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
              >
                <PiPaperPlaneTilt className="text-lg" />
                <span>Transfer {transferTokens} Tokens</span>
              </button>


            </div>

          </div>
        )}




        {activeTab === "marketplace" && (
          <div className="p-4 space-y-6">

            {/* ================= LIST TOKENS ================= */}
            <div className="bg-gradient-to-br from-[#E6EEFF] to-[rgba(218,230,255,0.29)] border border-[#FFEDD4] rounded-2xl p-5 space-y-4">
              <h3 className="text-xl font-semibold text-[#101828]">
                List Tokens for Sale
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-[#364153] mb-1 block">
                    Number of Tokens
                  </p>
                  <input
                    defaultValue="10"
                    className="w-full rounded-xl border font-medium border-[#E5E7EB] bg-[#F3F7FF] text-[#101828]  px-4 py-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#364153]  mb-1 block">
                    Price per Token ($)
                  </p>
                  <input
                    defaultValue={property.tokenPrice}
                    className="w-full rounded-xl border font-medium border-[#E5E7EB] bg-[#F3F7FF] text-[#101828] px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-md font-medium text-[#4A5565]">
                  Total Sale Value
                </span>
                <span className="font-bold text-2xl text-[#F54900]">
                  ${property.tokenPrice * 10}
                </span>
              </div>

              <button className="
                    w-full h-[44px]
                    rounded-xl
                    bg-gradient-to-r from-[#2460F5] to-[#3B1DDA]
                    text-white text-md font-semibold
                    shadow
                  ">
                $&nbsp; List Tokens for Sale
              </button>
            </div>

            {/* ================= BUY FROM HOLDERS ================= */}
            <div>
              <h3 className="text-xl font-semibold text-[#101828] mb-3">
                Buy from Other Holders
              </h3>

              <div className="space-y-3">
                {property.marketplace?.listings?.map((l, i) => (
                  <div
                    key={i}
                    className="
                              bg-white
                              border border-[#E5E7EB]
                              rounded-2xl
                              px-5 py-4
                              flex flex-col sm:flex-row
                              gap-4
                              sm:items-center
                            "
                  >
                    {/* LEFT CONTENT */}
                    <div className="flex flex-col gap-4 flex-1">

                      {/* TOP : Avatar + Address */}
                      <div className="flex items-center gap-4">
                        <div className="
                                  w-10 h-10 shrink-0
                                  rounded-full
                                  bg-gradient-to-r from-[#2460F5] to-[#3B1DDA]
                                  text-white text-sm font-semibold
                                  flex items-center justify-center
                                ">
                          {l.seller.slice(2, 4).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#101828] leading-tight">
                            {l.seller}
                          </p>
                          <p className="text-xs text-[#6A7282] mt-0.5">
                            1 hour ago
                          </p>
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="
                                grid grid-cols-1 sm:grid-cols-3
                                gap-4
                              ">
                        <div>
                          <p className="text-xs text-[#6A7282] mb-1">Tokens</p>
                          <p className="text-sm font-semibold text-[#101828]">
                            {l.tokens}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#6A7282] mb-1">Price/Token</p>
                          <p className="text-sm font-semibold text-[#2460F5]">
                            ${l.price}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#6A7282] mb-1">Total Price</p>
                          <p className="text-sm font-semibold text-[#101828]">
                            ${(l.tokens * l.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BUY BUTTON */}
                    <div className="sm:self-center w-full sm:w-auto">
                      <button
                        className="
                                  w-full sm:w-auto
                                  px-6 py-3
                                  rounded-xl
                                  bg-gradient-to-r from-[#2460F5] to-[#3B1DDA]
                                  text-white text-sm font-medium
                                  hover:brightness-110
                                  transition
                                "
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )) || (
                    <p className="text-center text-[#4A5565]">No listings available yet.</p>
                  )}
              </div>

              {/* ================= LIQUIDITY ================= */}
              <div className="mt-4 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] border border-[#E5E7EB] rounded-xl p-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#2460F5] to-[#3B1DDA] text-white flex items-center justify-center">
                  <IoAnalyticsOutline className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#101828]">
                    Liquidity Pool
                  </p>
                  <p className="text-xs text-[#6A7282]">
                    Coming soon – Instant token swaps with enhanced liquidity
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}



        {activeTab === "documents" && (
          <div className="p-4 space-y-4">
            <p className="text-md font-medium text-[#4A5565]">
              Access all important documents including blockchain contracts, property deeds, and valuation reports.
            </p>

            {property.documents.length > 0 ? (
              property.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-4 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#2460F5] to-[#3B1DDA] flex items-center justify-center">
                      <IoDocumentText className="text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#101828]">
                        {doc.name}
                      </p>
                      <p className="text-xs text-[#6A7282]">
                        {doc.type}
                      </p>
                    </div>
                  </div>

                  {/* VIEW BUTTON */}
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                  inline-flex items-center gap-2
                  text-sm px-3 py-1.5
                  rounded-lg
                  bg-[#F3F4F6]
                  text-[#364153] font-medium
                  hover:bg-[#EEF4FF]
                  transition
                "
                  >
                    <span>View</span>
                    <FaArrowUpRightFromSquare className="text-xs" />
                  </a>

                </div>
              ))
            ) : (
              <p className="text-center text-[#4A5565]">No documents available.</p>
            )}
          </div>
        )}





      </div>

    </div>
  );
}



/* ===== Reusable ===== */

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-md">
    <span className="font-normal text-[#4A5565]">
      {label}
    </span>

    <span className="font-bold text-md text-[#101828] break-all sm:text-right">
      {value}
    </span>
  </div>
);