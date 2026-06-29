import { useEffect, useMemo, useRef, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import BuyNow from "../../PropertyUtils/BuyNow";
import InvestNow from "../../PropertyUtils/InvestNow";
import SendQuery from "../../PropertyUtils/SendQuery";
import PropertyMap from "./PropertyMap";

export default function UnderConstructionLeft({ property, showForm, setShowForm }) {
  const images = useMemo(() => {
    const mainImages = property?.images?.main;
    if (Array.isArray(mainImages) && mainImages.length > 0) {
      return mainImages.filter(Boolean);
    }

    if (Array.isArray(property?.images) && property.images.length > 0) {
      return property.images.filter(Boolean);
    }

    return [];
  }, [property]);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef(null);
  const showThumbSliderControls = images.length > 5;

  useEffect(() => {
    setActiveIndex(0);
    if (thumbsRef.current) {
      thumbsRef.current.scrollLeft = 0;
    }
  }, [property?.id, images.length]);

  useEffect(() => {
    if (activeIndex >= images.length && images.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, images.length]);

  const scrollThumbnails = (direction) => {
    const container = thumbsRef.current;
    if (!container) return;

    const scrollAmount = Math.max(container.clientWidth * 0.7, 160);
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">

      {/* ================= IMAGE SECTION ================= */}
      <div className="bg-white rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="relative rounded-2xl overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[activeIndex]}
              alt={`${property?.title || "Property"} preview`}
              className="w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px] object-cover"
            />
          ) : (
            <div className="w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px] bg-[#EEF2F6] text-[#4A5565] flex items-center justify-center text-sm sm:text-base">
              No property images available
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 sm:px-3 py-1"
              >
                &#8249;
              </button>

              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 sm:px-3 py-1"
              >
                &#8250;
              </button>
            </>
          )}
        </div>

        <div className="relative">
          {showThumbSliderControls && (
            <button
              type="button"
              onClick={() => scrollThumbnails("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/90 shadow border border-[#E5E7EB] text-[#101828] flex items-center justify-center"
              aria-label="Scroll thumbnails left"
            >
              &#8249;
            </button>
          )}

          {showThumbSliderControls && (
            <button
              type="button"
              onClick={() => scrollThumbnails("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/90 shadow border border-[#E5E7EB] text-[#101828] flex items-center justify-center"
              aria-label="Scroll thumbnails right"
            >
              &#8250;
            </button>
          )}

          <div
            ref={thumbsRef}
            className={`flex gap-2 pb-1 scroll-smooth ${
              showThumbSliderControls ? "overflow-x-auto px-9" : "overflow-x-auto"
            }`}
          >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${property?.title || "Property"} thumbnail ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`w-16 h-12 sm:w-20 sm:h-14 shrink-0 object-cover rounded-lg cursor-pointer border-2 ${
                activeIndex === i ? "border-[#00A63E]" : "border-transparent"
              }`}
            />
          ))}
          </div>
        </div>
      </div>

      {/* Switch content below image */}
      {!showForm ? (
        <>
          {/* ================= DESCRIPTION ================= */}
          <div>
            <h3 className="font-semibold text-[#101828] text-lg mb-2">
              Property Description
            </h3>
            <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* ================= KEY HIGHLIGHTS ================= */}
          <div>
            <h3 className="font-semibold text-[#101828] text-lg mb-3">
              Key Highlights
            </h3>

            <div className="grid grid-cols-2 max-[500px]:grid-cols-1 gap-2 sm:gap-3">
              {(property?.keyHighlights || []).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#4A5565]">
                  <FaRegCircleCheck className="text-[#00A63E] mt-1" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* ================= SPECIFICATIONS ================= */}
          <div>
            <h3 className="font-semibold text-[#101828] text-lg mb-3">
              Specifications
            </h3>

            <div className="bg-[#F9FAFB] rounded-xl p-3 sm:p-4 text-sm divide-y">

              <Row label="Total Area" value={property.specifications?.totalArea} />
              <Row label="Property Type" value={property.specifications?.propertyType} />
              <Row label="Location" value={property.location?.address} />
              {/* <Row label="Total Investors" value={property.specifications?.totalInvestors} /> */}
              <Row label="Parking Spaces" value={property.specifications?.parkingSpaces} />
              <Row label="Listing Type" value={property.specifications?.listingType} />

            </div>
          </div>
          {/* ================= AMENITIES ================= */}
          <div>
            <h3 className="font-semibold text-[#101828] text-lg mb-3">
              Amenities
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 max-[500px]:grid-cols-1 gap-2">
              {(property?.amenities || []).map((a, i) => (
                <div
                  key={i}
                  className="bg-[#EEF2F6] text-[#364153] text-sm px-3 py-2 rounded-lg text-center break-words"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
          {/* ================= LOCATION MAP ================= */}
{property?.location?.lat && property?.location?.lng && (
  <div>
    <h3 className="font-semibold text-[#101828] text-lg mb-3">
      Location
    </h3>

    <PropertyMap
      lat={property.location.lat}
      lng={property.location.lng}
      address={property.location.address}
    />

    <p className="text-sm text-[#4A5565] mt-2">
      {property.location.address}
    </p>
  </div>
)}
        </>
      ) : (
            <>
              {/* ================= DYNAMIC FORM ================= */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-3 sm:space-y-4">

                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-[#00A63E] font-medium"
                >
                  {"< Back to Property"}
                </button>

                {/* Form switching logic */}
                {(() => {
                  const type = (property?.type || "").toLowerCase();

                  if (type === "sqft investment") {
                    return <InvestNow property={property} onClose={() => setShowForm(false)} />;
                  }

                  if (type === "fractional buy") {
                    return <BuyNow property={property} onClose={() => setShowForm(false)} />;
                  }

                  if (type === "one time buy") {
                    return <SendQuery property={property} onClose={() => setShowForm(false)} />;
                  }

                  // fallback (optional)
                  return (
                    <div className="text-red-500 text-sm">
                      No form available for this property type
                    </div>
                  );
                })()}
              </div>
            </>
          )}
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-1">
    
    <span className="text-[#6A7282]">
      {label}
    </span>

    <span className="font-semibold text-[#101828]">
      {value}
    </span>

  </div>
);

