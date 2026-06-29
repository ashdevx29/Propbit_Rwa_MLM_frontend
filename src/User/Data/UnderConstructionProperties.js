import axios from "axios";
import { appConfig } from "../../config/appConfig";

export const getUnderConstructionProperties = async () => {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  if (!token) {
    console.error("❌ authToken not found (user not logged in)");
    return [];
  }

  try {
    const res = await axios.get(
      `${appConfig.baseURL}/user/properties/listed`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res?.data?.data) return [];

    return res.data.data
      .filter(p => p.category === "FRACTIONAL_BUY")
      .map(p => {
         console.log("FULL PROPERTY DATA 👉", p);
        // Derive fields based on the JSON structure, using nested where available
        const totalValue = p.sidebar?.totalValue || `$${parseInt(p.total_value_usd || 0).toLocaleString()}M`;
        const minInv = p.sidebar?.minInv || p.mininvest || 0;
        const expectedROI = p.sidebar?.expectedROI || p.growth || `${p.apr_min || 0}–${p.apr_max || 0}%`;
        const duration = p.sidebar?.duration || "N/A";
        const completion = p.sidebar?.completion || p.expectedCompletion || "N/A";
        const progress = Number(p.sidebar?.progress || p.overallprogress || 0);
        const funprogress = Number(p.sidebar?.funprogress || 0);
        const investors = p.sidebar?.investors || p.tokenHolders || 0;
        const raised = p.sidebar?.raised || `$${parseInt(p.volume || 0).toLocaleString()}M`;
        //add akshay
        const totalArea = p.totalSqft || p.sidebar?.totalSqft || 0;
const pricePerSqft = p.pricePerSqft || p.sidebar?.pricePerSqft || 0;
        const tabs = p.tabs || {
          overview: {
            about: p.description || p.overview?.about || "",
            details: {
              beds: p.beds || 0,
              baths: p.baths || 0,
              area: p.area || "N/A",
            },
            team: p.tabs?.overview?.team || [],
            amenities: p.overview?.amenities || p.amenities || [],
          },
          milestones: p.milestones || p.tabs?.milestones || [],
          calculator: {
            minInvestment: p.tabs?.calculator?.minInvestment || `$${p.mininvest || 0}`,
            expectedReturn: p.tabs?.calculator?.expectedReturn || p.growth || "",
            lockIn: p.tabs?.calculator?.lockIn || p.sidebar?.duration || "N/A",
          },
          documents: p.documents || p.tabs?.documents || [],
        };

        const financials = p.financials || {           // agar backend "financials" object bhej raha hai
          metrics: {
            annualYield: p.annualYield || p.annual_yield || p.expected_annual_return || "—",
            rentalIncome: p.rentalIncome || p.rental_yield || p.monthly_income_rate || "—",
            valueGrowth: p.valueGrowth || p.capital_growth || p.appreciation_rate || "—",
          },
          breakdown: p.breakdown || p.score_breakdown || p.property_scores || [],  // array expected
        };

        // Slots / Tokenization fields (backend ke field names ke hisaab se adjust karo)
        const pricePerSlot = Number(p.pricePerSlot || p.price_per_slot || p.slot_price || 0);
        const tokensPerSlot = Number(p.tokensPerSlot || p.tokens_per_slot || 1000);
        const tokenValue = Number(p.tokenValue || p.token_value || p.current_token_price || 0);
        const totalSlots = Number(p.totalSlots || p.total_slots || p.max_slots || 50);
        const availableSlots = Number(p.availableSlots || p.available_slots || p.remaining_slots || 0);



        return {
          /* ================= BASIC ================= */
          id: p.property_id,
          slug: p.slug,
          category: p.category,
          
          title: p.title,
          location: p.location,

          financials,
          pricePerSlot,
          tokensPerSlot,
          tokenValue,
          totalSlots,
          availableSlots,

          // financials: {
          //   metrics: { annualYield: "18-22", rentalIncome: "7-9", valueGrowth: "8-12" },
          //   breakdown: [
          //     { label: "Location", value: 9, max: 10 },
          //     { label: "Developer", value: 8.5, max: 10 },

          //   ]
          // },
          // pricePerSlot: 5000,
          // tokensPerSlot: 1000,
          // tokenValue: 5.2,
          // totalSlots: 2000,
          // availableSlots: 1420,

          construction: p.construction || p.construction_stage || "Under Construction",
          projectCompletion: p.projectCompletion || p.construction_stage || "Under Construction",
          risk: p.risk_level || p.risk || "Medium Risk",
          risklevel: p.status || "AVAILABLE",
          // risklevel: p.risk_level || p.risk || "Medium Risk",

          expectedCompletion: p.expectedCompletion || p.sidebar?.completion || "N/A",
          Started: p.Started || "N/A",
          structure: p.structure || p.construction_stage || "N/A",

          images: p.images || [],
          exit: p.exit || p.exit_option || "Withdraw after completion",

          overallprogress: Number(p.overallprogress || p.sidebar?.progress || 0),


          sidebar: {
            totalValue,
            totalArea,      
            pricePerSqft,
            minInv,
            expectedROI,
            duration,
            completion,
            progress,
            funprogress,
            investors,
            raised,
          },

          minInvestment: Number(
            String(p.mininvest || p.sidebar?.minInv || 0)
              .replace("$", "")
              .replace(/,/g, "")
          ),

          /* ================= TABS ================= */
          tabs,

          /* ================= KEY FEATURES ================= */
          keyFeatures: p.keyFeatures || [],

          /* ================= BENEFITS ================= */
          // benefits: p.benefits || [],

          /* ================= DOCUMENTS ================= */
          documents: p.documents || tabs.documents || [],

          /* ================= RISK ================= */
          // risktitle: p.risktitle || "Risk Disclosure",
          // riskk:
          //   p.riskk ||
          //   p.risk ||
          //   "Construction projects carry inherent risks including delays and market fluctuations.",
        };
      });
  } catch (error) {
    console.error(
      "❌ Fractional_Buy fetch failed:",
      error?.response?.status,
      error?.message
    );
    return [];
  }
};




// import img1 from "../../assets/userImages/images/2.jpg";
// import img2 from "../../assets/userImages/images/2.jpg";
// import img3 from "../../assets/userImages/images/2.jpg";
// import img4 from "../../assets/userImages/images/2.jpg";


// import doc1 from "../../assets/userImages/dummypdf.pdf";
// import doc2 from "../../assets/userImages/dummypdf.pdf";
// import doc3 from "../../assets/userImages/dummypdf.pdf";
// import doc4 from "../../assets/userImages/dummypdf.pdf";
// import doc5 from "../../assets/userImages/dummypdf.pdf";
// import doc6 from "../../assets/userImages/dummypdf.pdf";

// import { LuBuilding2 } from "react-icons/lu";
// import { FiUser } from "react-icons/fi";


// export const UNDER_CONSTRUCTION_PROPERTIES = [
//   {
//     id: 3,
//     category: "construction",
//     slug: "skyline-towers-downtown",
//     title: "Skyline Towers Downtown",
//     location: "USA, Washington, Seattle, 1400 5th Avenue",
//   construction: "Under Construction",
//   risk: "Medium-Low Risk",
//     expectedCompletion: "Dec 2026",
//       Started: "Jan 2025",
//       structure:"Foundation & Structure",
//     images: [img1, img2, img3, img4],
//     exit: "Withdraw after completion",
//     overallprogress: 33,
//     projectCompletion: "Under Construction",

//     risklevel: "Medium Risk",
//     /* ================= SIDEBAR ================= */
//     sidebar: {
//       totalValue: "$5.00M",
//       minInv: "10,000",
//       expectedROI: "2.3%",
//       duration: "24 months",
//       completion: "Dec 2026",
//       progress: 38,
//       funprogress: 65,
//       investors: 187,
//       raised: "$3.25M",
//     },

//     /* ================= TABS ================= */
//     tabs: {
//       overview: {
//         about:
//           "Premium residential tower in the heart of downtown Seattle featuring modern design and luxury amenities. This under-construction property offers secured monthly returns during the development phase with an option to exit upon completion or convert to a readymade investment property.",

//         details: {
//           beds: 3,
//           baths: 2,
//           area: "180m²",
//         },

//        team: [
//   {
//     role: "Developer",
//     name: "Prime Developments LLC",
//     color: "bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]",
//     bgcolor: "#155DFC",
//     icon: LuBuilding2,
//   },
//   {
//     role: "Architect",
//     name: "Modern Architecture Studio",
//     color: "bg-gradient-to-r from-[#FAF5FF] to-[#F3E8FF]",
//     bgcolor: "#9810FA",
//     icon: FiUser,
//   },
//   {
//     role: "Contractor",
//     name: "BuildRight Construction",
//     color: "bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD4]",
//     bgcolor: "#F54900",
//     icon: LuBuilding2,
//   },
// ],


//         amenities: [
//           "Rooftop Pool",
//           "Fitness Center",
//           "Concierge Service",
//           "Underground Parking",
//           "Smart Home System",
//           "Co-working Space",
//           "Garden Terrace",
//           "Security 24/7",
//         ],
//       },

//       milestones: [
//         {
//           label: "Site Preparation",
//           status: "Completed",
//           desc: "Land clearing, excavation, and site setup",
//           target: "Feb 2025",
//           progress: 100,
//         },
//         {
//           label: "Foundation Work",
//           status: "Completed",
//           desc: "Foundation laying and basement construction",
//           target: "Apr 2025",
//           progress: 100,
//         },
//         {
//           label: "Structural Framework",
//           status: "In Progress",
//           desc: "Main building structure and floor construction",
//           target: "sep 2025",
//           progress: 60,
//         },
//         {
//           label: "Exterior Work",
//           status: "Pending",
//           desc: "Facade, windows, and external finishing",
//           target: "Feb 2026",
//           progress: 0,
//         },
//         {
//           label: "Interior Build-out",
//           status: "Pending",
//           desc: "Interior walls, flooring, and fixtures",
//           target: "Jun 2026",
//           progress: 0,
//         },
//         {
//           label: "MEP Installation",
//           status: "Pending",
//           desc: "Mechanical, electrical, and plumbing systems",
//           target: "sep 2026",
//           progress: 0,
//         },
//         {
//           label: "Final Finishing",
//           status: "Pending",
//           desc: "Painting, fixtures, and final touches",
//           target: "Nov 2026",
//           progress: 0,
//         },
//         {
//           label: "Project Completion",
//           status: "Pending",
//           desc: "Final inspection and handover",
//           target: "Dec 2026",
//           progress: 0,
//         },
//       ],

//       calculator: {
//         minInvestment: "$5,000",
//         expectedReturn: "12–15%",
//         lockIn: "24 months",
//       },

//       documents: [
//         "Land Ownership Deed",
//         "Construction Permit",
//         "Environmental Clearance",
//         "Project Blueprint",
//       ],
//     },

//     /* ================= KEY FEATURES (DATA DRIVEN) ================= */
//     keyFeatures: [
//       {
//         icon: "shield",
//         title: "Secured Monthly Income",
//         desc: "2.5% returns during construction",
//         bg: "bg-[#DCFCE7]",
//         color: "text-[#00A63E]",
//       },
//       {
//         icon: "check",
//         title: "Exit Option",
//         desc: "Withdraw after completion",
//         bg: "bg-[#DCFCE7]",
//         color: "text-[#155DFC]",
//       },
//       {
//         icon: "building",
//         title: "Conversion Available",
//         desc: "Convert to ready project post-completion",
//         bg: "bg-[#F3E8FF]",
//         color: "text-[#9810FA]",
//       },
//       {
//         icon: "users",
//         title: "Active Investors",
//         desc: "Join 187 investors",
//         bg: "bg-[#FFEDD4]",
//         color: "text-[#F54900]",
//       },

//       {
//         monincome: "2.5%"
//       },
//     ],

//     /* ================= INVESTMENT BENEFITS ================= */
// benefits: [
//   {
//     icon: "income",
//     title: "Secured Monthly Income",
//     desc: "Receive 2.5% monthly returns during construction period",
//     bg: "bg-gradient-to-r from-[#ECFDF5] to-[#E6FFFA]",
//     iconBg: "bg-[#16A34A]",
//     iconColor: "text-white",
//   },
//   {
//     icon: "exit",
//     title: "Exit Option Available",
//     desc: "Withdraw your investment after project completion",
//     bg: "bg-gradient-to-r from-[#EFF6FF] to-[#E0F2FE]",
//     iconBg: "bg-[#2563EB]",
//     iconColor: "text-white",
//   },
//   {
//     icon: "conversion",
//     title: "Conversion to Ready Project",
//     desc: "Convert to readymade project with rental income after completion",
//     bg: "bg-gradient-to-r from-[#F5F3FF] to-[#FDF4FF]",
//     iconBg: "bg-[#7C3AED]",
//     iconColor: "text-white",
//   },
// ],



//     documents: [
//           {
//             name: "Construction Permit",
//             type: "PDF Document",
//             link: doc1,
//           },
//           {
//             name: "Project Blueprint",
//             type: "Smart Contract",
//             link: doc2,
//           },
//           {
//             name: "Developer License",
//             type: "PDF Document",
//             link: doc3,
//           },
//           {
//             name: "Financial Projections",
//             type: "Excel Document",
//             link: doc4,
//           },
//           {
//             name: "Risk Disclosure",
//             type: "PDF Document",
//             link: doc5,
//           },
//           {
//             name: "Construction Timeline",
//             type: "PDF Document",
//             link: doc6,
//           },
//         ],

//       risk:
//       "This is a medium risk construction project. Returns are subject to project completion and may be affected by construction delays or market conditions.",

//       risktitle: "Risk Disclosure",

//     riskk:
//       "Construction projects carry inherent risks including delays, cost overruns, and market fluctuations. Monthly income is secured but subject to project completion. Please review all documents carefully before investing.",
//   },
// ];
