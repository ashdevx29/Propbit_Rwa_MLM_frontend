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

export default function PerSqftInvestmentModal({ property, onClose }) {
  const [submitting, setSubmitting] = useState(false);

  const metrics = useMemo(() => {
    const totalValuation = toNumber(property?.totalValuation);
    const totalArea = Math.round(toNumber(property?.totalSqft));

    // ✅ Direct backend value
    const availableArea = Math.round(toNumber(property?.availableSqft));

    const soldArea = Math.max(totalArea - availableArea, 0);

    const pricePerSqft =
      toNumber(property?.pricePerSqft) ||
      toNumber(property?.pricing?.pricePerSqft) ||
      (totalArea > 0 ? totalValuation / totalArea : 0);

    return {
      totalArea,
      availableArea,
      soldArea,
      pricePerSqft,
    };
  }, [property]);

  const step = metrics.availableArea >= 10 ? 10 : 1;

  const defaultSqft =
    metrics.availableArea <= 0
      ? 0
      : Math.min(
          metrics.availableArea,
          metrics.availableArea >= 100 ? 100 : Math.max(step, metrics.availableArea)
        );

  const [sqft, setSqft] = useState(defaultSqft);
  const [sqftInput, setSqftInput] = useState(String(defaultSqft));

  useEffect(() => {
    setSqft(defaultSqft);
    setSqftInput(String(defaultSqft));
  }, [defaultSqft, property?.id]);

  useEffect(() => {
    setSqftInput(String(sqft));
  }, [sqft]);

  const increase = () => {
    if (metrics.availableArea <= 0) return;
    setSqft((prev) => Math.min(prev + step, metrics.availableArea));
  };

  const decrease = () => {
    if (metrics.availableArea <= 0) return;
    setSqft((prev) => Math.max(prev - step, 1));
  };

  const isSelectionDisabled = metrics.availableArea <= 0;
  const minSelectable = metrics.availableArea > 0 ? 1 : 0;

  const handleSqftInputChange = (event) => {
    if (isSelectionDisabled) return;
    const rawValue = event.target.value;
    const sanitized = rawValue.replace(/\D/g, "");

    if (sanitized === "") {
      setSqftInput("");
      setSqft(0);
      return;
    }

    const nextValue = Math.min(
      Math.max(Number.parseInt(sanitized, 10), 1),
      metrics.availableArea
    );

    setSqft(nextValue);
    setSqftInput(String(nextValue));
  };

  const handleSqftInputBlur = () => {
    if (isSelectionDisabled) return;
    if (!sqftInput) {
      const fallback = Math.min(Math.max(sqft || 1, 1), metrics.availableArea);
      setSqft(fallback);
      setSqftInput(String(fallback));
    }
  };

  const totalAmount = sqft * metrics.pricePerSqft;

  const ownership = metrics.totalArea
    ? ((sqft / metrics.totalArea) * 100).toFixed(2)
    : "0.00";

  const progress = metrics.totalArea
    ? ((metrics.soldArea / metrics.totalArea) * 100).toFixed(0)
    : "0";

  const progressAfterInvestment = metrics.totalArea
    ? (((metrics.soldArea + sqft) / metrics.totalArea) * 100).toFixed(0)
    : "0";

  const handleInvestNow = async () => {
    const propertyId = property?.backendId || property?.id;
    if (!propertyId) {
      toast.error("Investment failed: invalid property details.");
      return;
    }

    if (!sqft || Number.isNaN(Number(sqft)) || Number(sqft) <= 0) {
      toast.error("Investment failed: invalid square footage selection.");
      return;
    }

    const payload = {
      propertyId,
      investment_type: "PER_SQFT_INVESTMENT",
      sqft,
    };

    try {
      setSubmitting(true);

      const res = await submitInvestment(payload);

      console.log("Investment Success:", res);
      toast.success(
        res?.data?.message || "Investment successful. Added to your account."
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
    <div className="inset-0 flex items-center justify-center z-50 p-3 sm:p-4 dmfont">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
        
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-normal text-gray-800">
            Per SQFT Investment - {property?.title || property?.name || "Property"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Select square footage and invest in fractional ownership
          </p>
        </div>

        {/* Property Info */}
        <div className="bg-[#F8FAFC] rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-black mb-3">Property Area Details</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-[11px]">TOTAL AREA</p>
              <p className="font-semibold text-black">
                {metrics.totalArea.toLocaleString("en-IN")} sqft
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-[11px]">AVAILABLE SQFT</p>
              <p className="font-semibold text-[#0082ED]">
                {metrics.availableArea.toLocaleString("en-IN")} sqft
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-[11px]">PER SQFT PRICE</p>
              <p className="font-semibold text-black">
                {formatCurrency(metrics.pricePerSqft)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] text-gray-500 mb-1">Investment Progress</p>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-right text-[#4BDD96] mt-1">{progress}%</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[14px] font-semibold text-gray-700 mb-2">Select Square Footage</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={decrease}
              disabled={isSelectionDisabled || sqft <= minSelectable}
              className="w-10 h-10 border rounded-xl text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>

            <input
              type="text"
              inputMode="numeric"
              value={sqftInput}
              onChange={handleSqftInputChange}
              onBlur={handleSqftInputBlur}
              disabled={isSelectionDisabled}
              className="flex-1 border rounded-xl py-2 text-center text-black font-medium outline-none disabled:opacity-50"
            />

            <button
              type="button"
              onClick={increase}
              disabled={isSelectionDisabled || sqft >= metrics.availableArea}
              className="w-10 h-10 border rounded-xl text-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Available: {metrics.availableArea} sqft | Selected: {sqft} sqft
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 mb-5">
          <p className="text-xs text-center text-gray-500 mb-3">Your Investment Visualization</p>

          <div className="w-full h-14 bg-[#E2E8F0] rounded-xl overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-b from-[#4BDD96] to-[#3DB97D] rounded-[10px]"
              style={{ width: `${Math.min(Number(ownership), 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[#0F172A] text-xs font-medium">
              {ownership}% Ownership
            </div>
          </div>
        </div>

        <div className="bg-[#F0FDF4] border border-[#4BDD96] rounded-xl p-4 mb-5 text-sm">
          <p className="font-bold text-black mb-3">Investment Breakdown</p>

          <div className="flex justify-between mb-1">
            <span className="text-black">Per SQFT Price</span>
            <span className="text-black">{formatCurrency(metrics.pricePerSqft)}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-black">Selected SQFT</span>
            <span className="text-black">{sqft} sqft</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-black">Ownership Percentage</span>
            <span className="text-[#4BDD96]">{ownership}%</span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-black">Progress After Investment</span>
            <span className="text-[#4BDD96]">{progressAfterInvestment}%</span>
          </div>

          <hr className="my-2 border-[#4bdd96]" />

          <div className="flex justify-between font-bold text-base">
            <span className="text-black">Total Investment Amount</span>
            <span className="text-black">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border rounded-full py-3 text-gray-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleInvestNow}
            disabled={isSelectionDisabled || sqft <= 0 || submitting}
            className="flex-1 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black rounded-full py-3 hover:bg-[#3db37a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Invest Now
          </button>
        </div>
      </div>
    </div>
  );
}
