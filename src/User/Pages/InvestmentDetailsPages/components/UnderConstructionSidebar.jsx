import { useNavigate } from "react-router-dom";
// import { SlBasket } from "react-icons/sl";
// import { IoTimeOutline, IoWarningOutline } from "react-icons/io5";
// import { FiShield, FiUsers } from "react-icons/fi";
// import { FaRegCircleCheck } from "react-icons/fa6";
// import { LuBuilding2 } from "react-icons/lu";
// import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";


// const ICONS = {
//   shield: <FiShield />,
//   check: <FaRegCircleCheck />,
//   building: <LuBuilding2 />,
//   users: <FiUsers />,
// };


// export default function UnderConstructionSidebar({ property }) {
//   const s = property.sidebar;
//   const navigate = useNavigate();

//   return (
//     <div className="space-y-4 sticky top-24">

//       {/* ================= MAIN CARD ================= */}
//       <div className="bg-gradient-to-br from-[rgba(255,105,0,0.08)] to-[rgba(225,113,0,0.08)] rounded-2xl p-5 space-y-4">

//         <div>
//           <p className="text-sm text-black">Total Project Value</p>
//           <p className="text-3xl font-bold text-black">${s.totalValue}</p>
//           <p className="text-sm text-black mt-1">
//             Min. Investment: ${s.minInv}
//           </p>
//         </div>

//         <StatRow label="Monthly Income" value={s.expectedROI} />
//         <StatRow label="Project Duration" value={s.duration} />
//         <StatRow label="Completion Date" value={s.completion} />
//         <StatRow label="Progress" value={`${s.progress}%`} />

//         {/* FUNDING */}
//         <div>
//           <div className="flex justify-between text-xs font-medium text-black mb-1">
//             <span>Funding Progress</span>
//             <span>{s.funprogress}%</span>
//           </div>

//           <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-[#F54900] to-[#FF9D59]"
//               style={{ width: `${s.funprogress}%` }}
//             />
//           </div>

//           <div className="flex justify-between text-xs text-black mt-1">
//             <span>{s.raised} raised</span>
//             <span>{s.investors} investors</span>
//           </div>
//         </div>

//         <button 
//           onClick={() =>
//             navigate(`/user/property-investments/construction/${property.id}`, {
//               state: { tab: "calculator" }
//             })
//           }
        
//         className="w-full h-[55px] rounded-xl bg-gradient-to-r from-[#F54900] to-[#FF9D59] text-white font-semibold flex items-center justify-center gap-2">
//           <SlBasket className="text-xl" />
//           Invest Now
//         </button>

//         <button className="w-full h-[55px] rounded-xl border bg-white text-black font-medium flex items-center justify-center gap-2">
//           <IoTimeOutline className="text-xl" />
//           View Progress
//         </button>
//       </div>

//       {/* ================= KEY FEATURES ================= */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
//         <h4 className="font-semibold text-[#101828] text-lg">Key Features</h4>

//         {property.keyFeatures.map((f, i) => (
//           <div key={i} className="flex items-start gap-3">
//             <div className={`w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#155DFC]`}>
//               {/* {ICONS[f.icon]} */}
//               <IoCheckmarkDoneCircleSharp size={24}  />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-[#101828]">{f.title}</p>
//               <p className="text-xs text-[#4A5565]">{f.desc}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= RISK ================= */}
//       <div className="bg-[#FEFCE8] border border-[#FFF085] rounded-2xl p-4 flex gap-3">
//         <IoWarningOutline className="text-[#D08700] text-xl shrink-0 mt-0.5" />
//         <p className="text-sm text-[#4A5565]">
//           <strong className="text-lg text-[#101828]">Investment Risk</strong><br />
//           {property.risk}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ===== Helper ===== */
// const StatRow = ({ label, value }) => (
//   <div className="flex justify-between text-sm">
//     <span className="text-black">{label}</span>
//     <span className="font-semibold text-black">{value}</span>
//   </div>
// );
export default function UnderConstructionSidebar({ property, setShowForm }) {
  const navigate = useNavigate();
  const totalUnits = (property?.availableUnits || 0) + (property?.soldUnits || 0);
  const percent = totalUnits > 0
    ? Math.round((property.soldUnits / totalUnits) * 100)
    : 0;
  const annualReturnsValue =
    Number(property?.aprMax) ||
    Number(property?.aprMin) ||
    Number(property?.apr_max) ||
    Number(property?.apr_min) ||
    0;
  const monthlyReturnsValue =
    Number(property?.monthlyReturn) ||
    Number(property?.rental_percentage) ||
    (annualReturnsValue > 0 ? Number((annualReturnsValue / 12).toFixed(2)) : 0);
  const threeYearProjectedValue =
    Number(property?.projected3Year) ||
    (annualReturnsValue > 0 ? Number((annualReturnsValue * 3).toFixed(1)) : 0);
  const fiveYearProjectedValue =
    Number(property?.projected5Year) ||
    (annualReturnsValue > 0 ? Number((annualReturnsValue * 5).toFixed(1)) : 0);

  const annualReturns = annualReturnsValue > 0 ? `${annualReturnsValue}%` : "12%";
  const monthlyReturns = monthlyReturnsValue > 0 ? `${monthlyReturnsValue}%` : "1.2%";
  const threeYearProjected = threeYearProjectedValue > 0 ? `${threeYearProjectedValue}%` : "36%";
  const fiveYearProjected = fiveYearProjectedValue > 0 ? `${fiveYearProjectedValue}%` : "60%";

  return (
    <div className="w-full max-w-full h-full space-y-4">

      {/* ================= INVESTMENT SUMMARY ================= */}
      <div className="bg-gradient-to-br from-[#4BDD96] to-[#3DB97D] rounded-2xl p-4 sm:p-6 text-white shadow-md">

        <h3 className="text-base sm:text-lg font-semibold mb-4">Investment Summary</h3>

        <div className="mb-4">
          <p className="text-sm opacity-80">Total Property Value</p>
          <p className="text-xl sm:text-2xl font-bold break-words">
            {property?.totalValuation ?? "N/A"}
          </p>
        </div>

        <div className="border-t border-white/30 my-3"></div>

        <div className="mb-4">
          <p className="text-sm opacity-80">Per SQFT Cost</p>
          <p className="text-lg sm:text-xl font-semibold break-words">
            {property?.pricePerSqft ?? "N/A"}
          </p>
        </div>

        <div className="border-t border-white/30 my-3"></div>

        <div className="mb-4">
          <div className="flex justify-between gap-2 text-sm mb-1">
            <span>Funding Progress</span>
            <span>{percent}%</span>
          </div>

          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-xs sm:text-sm mt-1 opacity-90">
            {property?.soldUnits || 0} sold / {property?.availableUnits || 0} available
          </p>
        </div>

        {/* 🔥 UPDATED BUTTON */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 h-11 sm:h-[45px] rounded-full bg-white text-[#4BDD96] font-semibold transition-transform duration-150 active:scale-[0.98]"
        >
          Start Investing
        </button>
      </div>

      {/* ================= ESTIMATED RETURNS ================= */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-sm">
        <h4 className="font-semibold text-base sm:text-lg text-[#101828] mb-4">
          Estimated Returns
        </h4>

        <div className="space-y-2 text-sm">
          <StatRow label="Annual Returns" value={annualReturns} green />
          <StatRow label="Monthly Returns" value={monthlyReturns} green />

          <div className="border-t my-2"></div>

          <StatRow label="3 Year Projected" value={threeYearProjected} />
          <StatRow label="5 Year Projected" value={fiveYearProjected} />
        </div>

        <p className="text-xs text-gray-400 mt-3">
          * Returns are estimated and not guaranteed. Actual returns may vary based on market conditions.
        </p>
      </div>

      {/* ================= ENQUIRY ================= */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 text-center shadow-sm">
        <h4 className="font-semibold text-base sm:text-lg text-[#101828] mb-2">
          Need More Information?
        </h4>

        <p className="text-sm text-gray-500 mb-4">
          Our investment advisors are here to help you make the right decision.
        </p>
        <button
          type="button"
          onClick={() => navigate("/user/support")}
          className="w-full h-11 sm:h-[45px] rounded-full border border-[#00BC61] text-[#00BC61] font-medium"
        >
          Send Enquiry
        </button>
      </div>
    </div>
  );
}

/* ===== Helper ===== */
const StatRow = ({ label, value, green }) => (
  <div className="flex items-start justify-between gap-3 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${green ? "text-[#0082ED]" : "text-[#101828]"}`}>
      {value}
    </span>
  </div>
);
