import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";

export default function ReadymadeSidebar({ property, setActiveTab }) {

  // Safety: if no property → show loading/fallback UI
  if (!property) {
    return (
      <div className="sticky top-24 bg-white border rounded-2xl p-5 text-center">
        <p className="text-gray-500">Property details are loading...</p>
      </div>
    );
  }

  const [amount, setAmount] = useState(property?.defaultInvestment || 1000);

  const [lockPeriod, setLockPeriod] = useState("");

  // ================= CALCULATIONS =================
  const tokenPrice = property?.tokenPrice || 0;

  // kitne share milenge
  const shares = tokenPrice ? Math.floor(amount / tokenPrice) : 0;

  // default investment se per share income nikalna
  const baseShares =
    tokenPrice && property?.defaultInvestment
      ? Math.floor(property.defaultInvestment / tokenPrice)
      : 1;

  const incomePerShareMonthly =
    baseShares ? (property?.monthlyIncome || 0) / baseShares : 0;

  const incomePerShareAnnual =
    baseShares ? (property?.annualIncome || 0) / baseShares : 0;

  // final income
  const monthly = shares * incomePerShareMonthly;
  const annual = shares * incomePerShareAnnual;



  return (
    <div className="sticky top-24 bg-white border rounded-2xl p-5 space-y-5">
      {/* ================= SUMMARY ================= */}
      <div className="space-y-2">
        <span className="text-gray-500 text-m block mb-2">Property Value</span>
        <span className="text-[#101828] text-lg font-semibold block">
          ${property?.propertyValue?.toLocaleString() || "N/A"}
        </span>

        <div className="flex justify-between text-m">
          <span className="text-gray-500">Property Price</span>
          <span className="text-[#101828] font-semibold">
            ${property?.tokenPrice || "N/A"}
          </span>
        </div>

        <div className="flex justify-between text-m">
          <span className="text-gray-500">Min. Investment</span>
          <span className="text-[#101828] font-semibold">
            ${property?.minInvestment?.toLocaleString() || "N/A"}
          </span>
        </div>

        <div className="flex justify-between text-m">
          <span className="text-gray-500">Available Properties</span>
          <span className="font-semibold text-[#0082ED]">
            {property?.availableTokens?.toLocaleString() || 0} properties
          </span>
        </div>
      </div>

      <hr />

      {/* ================= CALCULATOR ================= */}
      <div className="space-y-3 p-5 bg-[linear-gradient(135deg,_#EFF6FF_0%,_#FAF5FF_100%)]">
        <h3 className="font-semibold text-lg text-[#101828]">
          Investment Calculator
        </h3>

        <div>
          <label className="text-s text-[#364153] block mb-1">
            Investment Amount (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={property?.minInvestment || 0}
            className="w-full px-3 py-3 text-[#0A0A0A] rounded-[14px] border-[1.54px] border-[#E5E7EB] outline-none"
          />

          {/* <div className="w-full px-3 py-3 text-[#0A0A0A] rounded-[14px] border-[1.54px] border-[#E5E7EB]">
            {amount?.toLocaleString() || "—"}
          </div> */}
        </div>

        <div>
          <label className="text-s text-[#364153] block mb-1">
            Lock-in Period (Optional)
          </label>
          <select
            value={lockPeriod}
            onChange={(e) => setLockPeriod(e.target.value)}
            className="w-full px-3 py-3 text-[#0A0A0A] rounded-[14px] border-[1.54px] border-[#E5E7EB] outline-none"
          >
            <option value="">Select period</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>

          {/* <div className="w-full px-3 py-3 text-[#0A0A0A] rounded-[14px] border-[1.54px] border-[#E5E7EB]">
            — 
          </div> */}
        </div>

        <div className="text-m space-y-3">
          <div className="flex justify-between">
            <span className="text-[#364153]">Shares to buy</span>
            <span className="font-semibold text-[#101828]">
              {shares}

            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#364153]">Monthly income</span>
            <span className="text-[#0082ED]">
              ${monthly.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#364153]">Annual income</span>
            <span className="text-[#0082ED]">
              ${annual.toLocaleString()}

            </span>
          </div>

          <div className="flex justify-between font-semibold !mt-4">
            <span className="text-[#364153] font-[600]">Total Value</span>
            <span className="text-[#101828]">
              ${amount?.toLocaleString() || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= RISK ================= */}
      <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <FontAwesomeIcon
          icon={faShield}
          className="text-yellow-600 text-4xl mt-1"
        />

        <div>
          <span className="text-[#364153] text-sm block">Risk Assessment</span>
          <p className="text-yellow-700 text-base mt-1">
            {property?.risk || property?.riskLevel || "Not specified"}
          </p>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <button
        onClick={() => setActiveTab("Financial Details")}
        className="w-full py-4 mt-6 rounded-xl bg-blue-600 text-white shadow-[0px_4px_6px_-4px_#155DFC4D,0px_10px_15px_-3px_#155DFC4D]"
      >
        Buy Properties Now
      </button>


      <button
        className="w-full py-4 mt-6 rounded-xl text-[#364153] border border-gray-300"
      >
        Sell Owned Share
      </button>

      {/* ================= PARTNER ================= */}
      <div className="text-sm pt-2">
        <p className="text-[#6A7282] mb-3">Property Partner</p>
        <p className="font-semibold text-[#101828] flex items-center gap-1">
          {property?.partner?.name || "Not specified"}
          {property?.partner?.verified && (
            <span className="text-[#0082ED] text-xs">✔ Verified Provider</span>
          )}
        </p>
      </div>
    </div>
  );
}











