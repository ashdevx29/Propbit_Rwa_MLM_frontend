// import { useEffect, useMemo, useState } from "react";
// import { submitInvestment } from "../../Service/investmentApi";

// const toNumber = (value) => {
//   if (typeof value === "number" && Number.isFinite(value)) return value;
//   if (typeof value === "string") {
//     const cleaned = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
//     const parsed = Number.parseFloat(cleaned);
//     return Number.isFinite(parsed) ? parsed : 0;
//   }
//   return 0;
// };

// const formatCurrency = (value) =>
//   `Rs ${Number(value || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   })}`;

// export default function FractionalBuyModal({ property, onClose }) {
//   const owners = Array.isArray(property?.owners) ? property.owners : [];
//   const [submitting, setSubmitting] = useState(false);

//   const metrics = useMemo(() => {
//     const totalSlotsFromPricing = Math.round(toNumber(property?.totalSlots));
//     const availableFromPricing = Math.round(toNumber(property?.availableSlots));
//     const availableUnits = Math.round(toNumber(property?.availableUnits));
//     const soldUnits = Math.round(toNumber(property?.soldUnits));

//     let totalSlots = totalSlotsFromPricing;
//     if (!totalSlots) totalSlots = availableUnits + soldUnits;
//     if (!totalSlots) totalSlots = availableFromPricing;

//     const availableSlotsRaw = availableFromPricing || availableUnits;
//     const availableSlots = totalSlots
//       ? Math.min(Math.max(availableSlotsRaw, 0), totalSlots)
//       : Math.max(availableSlotsRaw, 0);
//     const soldSlots = Math.max(totalSlots - availableSlots, 0);

//     const totalValuation = toNumber(property?.totalValuation);
//     const perSlotPrice =
//       toNumber(property?.pricePerSlot) ||
//       (totalSlots > 0 ? totalValuation / totalSlots : 0);

//     return {
//       totalSlots,
//       availableSlots,
//       soldSlots,
//       totalValuation,
//       perSlotPrice,
//     };
//   }, [property]);

//   const [slots, setSlots] = useState(1);
//   const [slotInput, setSlotInput] = useState("1");

//   useEffect(() => {
//     if (metrics.availableSlots <= 0) {
//       setSlots(0);
//       setSlotInput("0");
//       return;
//     }
//     setSlots((prev) => {
//       const next = Math.min(Math.max(prev, 1), metrics.availableSlots);
//       setSlotInput(String(next));
//       return next;
//     });
//   }, [metrics.availableSlots]);

//   useEffect(() => {
//     setSlotInput(String(slots));
//   }, [slots]);

//   const increase = () => {
//     if (metrics.availableSlots <= 0) return;
//     setSlots((prev) => Math.min(prev + 1, metrics.availableSlots));
//   };

//   const decrease = () => {
//     if (metrics.availableSlots <= 0) return;
//     setSlots((prev) => Math.max(prev - 1, 1));
//   };

//   const handleSlotInputChange = (event) => {
//     if (isSlotSelectionDisabled) return;
//     const rawValue = event.target.value;
//     const sanitized = rawValue.replace(/\D/g, "");

//     if (sanitized === "") {
//       setSlotInput("");
//       return;
//     }

//     const nextValue = Math.min(
//       Math.max(Number.parseInt(sanitized, 10), 1),
//       metrics.availableSlots
//     );
//     setSlots(nextValue);
//     setSlotInput(String(nextValue));
//   };

//   const handleSlotInputBlur = () => {
//     if (isSlotSelectionDisabled) return;
//     if (!slotInput) {
//       const fallback = Math.min(Math.max(slots || 1, 1), metrics.availableSlots);
//       setSlots(fallback);
//       setSlotInput(String(fallback));
//     }
//   };

//   const ownership = metrics.totalSlots
//     ? ((slots / metrics.totalSlots) * 100).toFixed(2)
//     : "0.00";
//   const progress = metrics.totalSlots
//     ? ((metrics.soldSlots / metrics.totalSlots) * 100).toFixed(0)
//     : "0";
//   const progressAfterPurchase = metrics.totalSlots
//     ? (((metrics.soldSlots + slots) / metrics.totalSlots) * 100).toFixed(0)
//     : "0";
//   const totalAmount = slots * metrics.perSlotPrice;
//   const isSlotSelectionDisabled = metrics.availableSlots <= 0;

//   const handleBuyNow = async () => {
//     const propertyId = property?.backendId || property?.id;

//     if (!propertyId) {
//       alert("Invalid property");
//       return;
//     }

//     if (!slots || isNaN(slots) || slots <= 0) {
//       alert("Invalid slot selection");
//       return;
//     }

//     const payload = {
//       propertyId,
//       investment_type: "FRACTIONAL_BUY",
//       slots: Number(slots),
//     };
//     console.log("slots:", slots)
//     console.log("pricePerSlot:", metrics.perSlotPrice)
//     console.log("totalAmount:", totalAmount)
//     try {
//       setSubmitting(true);
//       await submitInvestment(payload);
//       alert("Investment successful 🎉");
//       onClose?.();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Investment failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="inset-0 dmfont flex items-center justify-center z-50 p-3 sm:p-4">
//       <div className="w-full max-w-2xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
//         <div className="mb-4">
//           <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//             Fractional Buy - {property?.title || property?.name || "Property"}
//           </h2>
//           <p className="text-sm text-gray-500">
//             Purchase fractional ownership through slot-based investment
//           </p>
//         </div>

//         <div className="bg-[#F8FAFC] rounded-xl p-4 mb-5">
//           <p className="text-sm font-semibold text-black mb-3">Property Details</p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-[#4B5563] text-[11px]">TOTAL SLOTS</p>
//               <p className="font-semibold text-black">{metrics.totalSlots} Slots</p>
//             </div>

//             <div>
//               <p className="text-[#4B5563] text-[11px]">AVAILABLE SLOTS</p>
//               <p className="font-semibold text-[#4BDD96]">
//                 {metrics.availableSlots} Slots
//               </p>
//             </div>

//             <div>
//               <p className="text-[#4B5563] text-[11px]">PER SLOT PRICE</p>
//               <p className="font-semibold text-black">
//                 {formatCurrency(metrics.perSlotPrice)}
//               </p>
//             </div>

//             <div>
//               <p className="text-[#4B5563] text-[11px]">TOTAL VALUATION</p>
//               <p className="font-semibold text-black">
//                 {formatCurrency(metrics.totalValuation)}
//               </p>
//             </div>
//           </div>

//           <div className="mt-4">
//             <p className="text-[11px] text-[#4B5563] mb-1">Funding Progress</p>
//             <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <p className="text-xs text-right text-[#4BDD96] mt-1">{progress}%</p>
//           </div>
//         </div>

//         <div className="mb-5">
//           <p className="text-[14px] font-medium text-black mb-2">Current Owners</p>

//           <div className="border rounded-xl overflow-x-auto text-sm">
//             <div className="grid grid-cols-3 bg-[#F8FAFC] p-2 font-semibold text-[12px] text-[#64748B]">
//               <span>Owner Name</span>
//               <span className="text-center">Slots</span>
//               <span className="text-right">Ownership %</span>
//             </div>

//             {owners.length === 0 && (
//               <div className="p-3 text-center text-[#64748B]">No owner data available</div>
//             )}

//             {owners.map((owner, index) => {
//               const ownerSlots = Math.round(toNumber(owner?.slots));
//               const ownerPercent = metrics.totalSlots
//                 ? ((ownerSlots / metrics.totalSlots) * 100).toFixed(1)
//                 : "0.0";

//               return (
//                 <div key={`${owner?.name || "owner"}-${index}`} className="grid grid-cols-3 p-2 border-t">
//                   <span>{owner?.name || "N/A"}</span>
//                   <span className="text-center">{ownerSlots}</span>
//                   <span className="text-right text-[#4BDD96]">{ownerPercent}%</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="mb-5">
//           <p className="text-sm font-medium text-gray-700 mb-2">Choose Number of Slots</p>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={decrease}
//               disabled={isSlotSelectionDisabled || slots <= 1}
//               className="w-10 h-10 border rounded-full text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               -
//             </button>

//             <input
//               type="text"
//               inputMode="numeric"
//               value={slotInput}
//               onChange={handleSlotInputChange}
//               onBlur={handleSlotInputBlur}
//               disabled={isSlotSelectionDisabled}
//               className="flex-1 border rounded-xl py-2 text-center text-black font-medium outline-none disabled:opacity-50"
//             />

//             <button
//               type="button"
//               onClick={increase}
//               disabled={isSlotSelectionDisabled || slots >= metrics.availableSlots}
//               className="w-10 h-10 border rounded-full text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               +
//             </button>
//           </div>

//           <p className="text-xs text-gray-500 mt-2 text-center">
//             Available: {metrics.availableSlots} slots | Selected: {slots} slots
//           </p>
//         </div>

//         <div className="bg-green-50 border border-[#4BDD96] rounded-xl p-4 mb-5 text-sm">
//           <div className="flex justify-between mb-1">
//             <span className="text-black">Per Slot Price</span>
//             <span className="text-black">{formatCurrency(metrics.perSlotPrice)}</span>
//           </div>

//           <div className="flex justify-between mb-1">
//             <span className="text-black">Number of Slots</span>
//             <span className="text-black">{slots}</span>
//           </div>

//           <div className="flex justify-between mb-1">
//             <span className="text-black">Ownership Percentage</span>
//             <span className="text-[#4BDD96]">{ownership}%</span>
//           </div>

//           <div className="flex justify-between mb-1">
//             <span className="text-black">Funding After Purchase</span>
//             <span className="text-[#4BDD96]">{progressAfterPurchase}%</span>
//           </div>

//           <hr className="my-2" />

//           <div className="flex justify-between font-semibold text-base">
//             <span className="text-black">Total Amount</span>
//             <span className="text-black">{formatCurrency(totalAmount)}</span>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 border rounded-full py-3 text-gray-600"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleBuyNow}
//             disabled={isSlotSelectionDisabled || slots <= 0 || submitting}
//             className="flex-1 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black rounded-full py-3 hover:bg-[#3db87c] disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { submitInvestment } from "../../Service/investmentApi";
import { toast } from "react-toastify";

const toNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const getFailureReason = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export default function FractionalBuyModal({ property, onClose }) {
  const owners = Array.isArray(property?.owners) ? property.owners : [];
  const [submitting, setSubmitting] = useState(false);

  const metrics = useMemo(() => {
    const totalSlotsFromPricing = Math.round(toNumber(property.totalSlots));
    const availableFromPricing = Math.round(toNumber(property.availableSlots));
    const availableUnits = Math.round(toNumber(property.availableUnits));
    const soldUnits = Math.round(toNumber(property.soldUnits));

    let totalSlots = totalSlotsFromPricing;
    if (!totalSlots) totalSlots = availableUnits + soldUnits;
    if (!totalSlots) totalSlots = availableFromPricing;

    const availableSlotsRaw = availableFromPricing || availableUnits;
    const availableSlots = totalSlots
      ? Math.min(Math.max(availableSlotsRaw, 0), totalSlots)
      : Math.max(availableSlotsRaw, 0);
    const soldSlots = Math.max(totalSlots - availableSlots, 0);

    const totalValuation = toNumber(property?.totalValuation);
    const perSlotPrice =
      toNumber(property?.pricePerSlot) ||
      (totalSlots > 0 ? totalValuation / totalSlots : 0);

    return {
      totalSlots,
      availableSlots,
      soldSlots,
      totalValuation,
      perSlotPrice,
    };
  }, [property]);

  const [slots, setSlots] = useState(1);
  const [slotInput, setSlotInput] = useState("1");

  useEffect(() => {
    if (metrics.availableSlots <= 0) {
      setSlots(0);
      setSlotInput("0");
      return;
    }
    setSlots((prev) => {
      const next = Math.min(Math.max(prev, 1), metrics.availableSlots);
      setSlotInput(String(next));
      return next;
    });
  }, [metrics.availableSlots]);

  useEffect(() => {
    setSlotInput(String(slots));
  }, [slots]);

  const increase = () => {
    if (metrics.availableSlots <= 0) return;
    setSlots((prev) => Math.min(prev + 1, metrics.availableSlots));
  };

  const decrease = () => {
    if (metrics.availableSlots <= 0) return;
    setSlots((prev) => Math.max(prev - 1, 1));
  };

  const handleSlotInputChange = (event) => {
    if (isSlotSelectionDisabled) return;
    const rawValue = event.target.value;
    const sanitized = rawValue.replace(/\D/g, "");

    if (sanitized === "") {
      setSlotInput("");
      return;
    }

    const nextValue = Math.min(
      Math.max(Number.parseInt(sanitized, 10), 1),
      metrics.availableSlots
    );
    setSlots(nextValue);
    setSlotInput(String(nextValue));
  };

  const handleSlotInputBlur = () => {
    if (isSlotSelectionDisabled) return;
    if (!slotInput) {
      const fallback = Math.min(Math.max(slots || 1, 1), metrics.availableSlots);
      setSlots(fallback);
      setSlotInput(String(fallback));
    }
  };

  const ownership = metrics.totalSlots
    ? ((slots / metrics.totalSlots) * 100).toFixed(2)
    : "0.00";
  const progress = metrics.totalSlots
    ? ((metrics.soldSlots / metrics.totalSlots) * 100).toFixed(0)
    : "0";
  const progressAfterPurchase = metrics.totalSlots
    ? (((metrics.soldSlots + slots) / metrics.totalSlots) * 100).toFixed(0)
    : "0";
  const totalAmount = slots * metrics.perSlotPrice;
  const isSlotSelectionDisabled = metrics.availableSlots <= 0;

  const handleBuyNow = async () => {
    const propertyId = property?.backendId || property?.id;
    if (!propertyId) {
      toast.error("Investment failed: invalid property details.");
      return;
    }

    if (!slots || Number.isNaN(Number(slots)) || Number(slots) <= 0) {
      toast.error("Investment failed: invalid slot selection.");
      return;
    }

    const payload = {
      propertyId,
      amount_usd: Number(totalAmount) || 0,
      investment_type: property?.category || "FRACTIONAL_BUY",
      slots,
    };

    try {
      setSubmitting(true);
      const response = await submitInvestment(payload);
      toast.success(
        response?.data?.message ||
          "Investment successful. Added to your account."
      );
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        getFailureReason(
          err,
          "Unable to complete investment. Please try again later."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inset-0 dmfont flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Fractional Buy - {property?.title || property?.name || "Property"}
          </h2>
          <p className="text-sm text-gray-500">
            Purchase fractional ownership through slot-based investment
          </p>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-black mb-3">Property Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#4B5563] text-[11px]">TOTAL SLOTS</p>
              <p className="font-semibold text-black">{metrics.totalSlots} Slots</p>
            </div>

            <div>
              <p className="text-[#4B5563] text-[11px]">AVAILABLE SLOTS</p>
              <p className="font-semibold text-[#4BDD96]">
                {metrics.availableSlots} Slots
              </p>
            </div>

            <div>
              <p className="text-[#4B5563] text-[11px]">PER SLOT PRICE</p>
              <p className="font-semibold text-black">
                {formatCurrency(metrics.perSlotPrice)}
              </p>
            </div>

            <div>
              <p className="text-[#4B5563] text-[11px]">TOTAL VALUATION</p>
              <p className="font-semibold text-black">
                {formatCurrency(metrics.totalValuation)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] text-[#4B5563] mb-1">Funding Progress</p>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-right text-[#4BDD96] mt-1">{progress}%</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[14px] font-medium text-black mb-2">Current Owners</p>

          <div className="border rounded-xl overflow-x-auto text-sm">
            <div className="grid grid-cols-3 bg-[#F8FAFC] p-2 font-semibold text-[12px] text-[#64748B]">
              <span>Owner Name</span>
              <span className="text-center">Slots</span>
              <span className="text-right">Ownership %</span>
            </div>

            {owners.length === 0 && (
              <div className="p-3 text-center text-[#64748B]">No owner data available</div>
            )}

            {owners.map((owner, index) => {
              const ownerSlots = Math.round(toNumber(owner?.slots));
              const ownerPercent = metrics.totalSlots
                ? ((ownerSlots / metrics.totalSlots) * 100).toFixed(1)
                : "0.0";

              return (
                <div key={`${owner?.name || "owner"}-${index}`} className="grid grid-cols-3 p-2 border-t">
                  <span>{owner?.name || "N/A"}</span>
                  <span className="text-center">{ownerSlots}</span>
                  <span className="text-right text-[#4BDD96]">{ownerPercent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Choose Number of Slots</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={decrease}
              disabled={isSlotSelectionDisabled || slots <= 1}
              className="w-10 h-10 border rounded-full text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>

            <input
              type="text"
              inputMode="numeric"
              value={slotInput}
              onChange={handleSlotInputChange}
              onBlur={handleSlotInputBlur}
              disabled={isSlotSelectionDisabled}
              className="flex-1 border rounded-xl py-2 text-center text-black font-medium outline-none disabled:opacity-50"
            />

            <button
              type="button"
              onClick={increase}
              disabled={isSlotSelectionDisabled || slots >= metrics.availableSlots}
              className="w-10 h-10 border rounded-full text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Available: {metrics.availableSlots} slots | Selected: {slots} slots
          </p>
        </div>

        <div className="bg-green-50 border border-[#4BDD96] rounded-xl p-4 mb-5 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-black">Per Slot Price</span>
            <span className="text-black">{formatCurrency(metrics.perSlotPrice)}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-black">Number of Slots</span>
            <span className="text-black">{slots}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-black">Ownership Percentage</span>
            <span className="text-[#4BDD96]">{ownership}%</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-black">Funding After Purchase</span>
            <span className="text-[#4BDD96]">{progressAfterPurchase}%</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-base">
            <span className="text-black">Total Amount</span>
            <span className="text-black">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border rounded-full py-3 text-gray-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isSlotSelectionDisabled || slots <= 0 || submitting}
            className="flex-1 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black rounded-full py-3 hover:bg-[#3db87c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
