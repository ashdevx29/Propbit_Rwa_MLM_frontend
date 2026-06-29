import axios from "axios";
import { appConfig } from "../../config/appConfig";


export const getReadymadeProperties = async () => {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  if (!token) {
    console.error("❌ authToken not found");
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
      .filter((p) => p.category === "PER_SQFT_INVESTMENT")
      .map((p) => {
        /* ---------------- FALLBACKS ---------------- */

        const totalSlots = p.totalSlots || p.total_units || 0;
        const availableTokens =
          p.availableTokens ?? p.available_units ?? 0;

        const tokenPrice = p.tokenPrice ?? p.tokenValue ?? 0;
        
        const totalSupply = parseInt(
          p.overview?.blockchain?.totalSupply || 0,
          10
        );

        const tokensPerSlot =
          p.tokensPerSlot ||
          (totalSlots ? totalSupply / totalSlots : 0);

        const pricePerSlot =
          p.pricePerSlot || tokensPerSlot * tokenPrice;

        const transferable =
          p.transferable ||
          p.overview?.blockchain?.transferable ||
          "No";

        const amenities =
          p.overview?.amenities?.length
            ? p.overview.amenities
            : p.amenities || [];

        const risk =
          p.risk ||
          p.risk_level ||
          p.risklevel ||
          "Medium Risk";

        const minInvestment =
          p.minInvestment ||
          p.mininvest ||
          1;

        const propertyValue =
          p.propertyValue ||
          p.total_value_usd ||
          p.value ||
          0;

        const growth =
          p.growth ||
          `${p.apr_min || 0}–${p.apr_max || 0}`;

        /* ---------------- RETURN ---------------- */

        return {
          id: p.property_id,
          slug: p.slug,
          category: "persqftinvestment",

          title: p.title,
          location: p.location,
          description: p.description,

          image: p.images?.[0] || null,
          gallery: p.images || [],

          stats: {
            beds: p.stats?.beds ?? p.beds ?? 0,
            baths: p.stats?.baths ?? p.baths ?? 0,
            area: p.stats?.area ?? p.area ?? "",
            listed: p.stats?.listed ||
              (p.createdAt
                ? new Date(p.createdAt).toLocaleDateString()
                : "N/A"),
          },

          amenities,
          // documents: p.documents || [],
          documents: (p.documents || []).map((d) => ({
            title: d.name,
            type: d.type,
            url: d.link,
          })),


          propertyValue,
          tokenPrice,
          minInvestment,
          availableTokens,
          totalSlots,
          pricePerSlot,
          tokensPerSlot,
          growth,
          transferable: transferable === "Yes" ? "Yes" : "No",
          risk: p.status || "AVAILABLE",

          // risk,
          deal: p.deal || "🔥 Hot Deal",
          rate: p.rate || "+0%",
          progress: `${totalSlots - availableTokens} / ${totalSlots} slots`,

          financials: p.financials || { metrics: {}, breakdown: [] },
          tokenValue: p.tokenValue || p.tokenPrice || 0,
          defaultInvestment: p.defaultInvestment || 1,
          monthlyIncome: p.monthlyIncome || 0,
          annualIncome: p.annualIncome || 0,
          sharetobuy: p.sharetobuy || 1,
          partner: p.partner || {},
        };
      });
  } catch (err) {
    console.error("❌ persqftinvestment fetch failed:", err);
    return [];
  }
};






// import one from "../../assets/userImages/images/invest plan/1.png";
// import two from "../../assets/userImages/images/invest plan/2.jpg";

// export const READYMADES = [
//   {
//     id: "1",
//     title: "Green Hill Tbilisi",
//     slug: "green-hill-tbilisi",
//     category: "readymade",
//     location: "Georgia, Missouri, St. Louis, 7751 Mallard Dr",
//     sharetobuy: 1,
//     stats: {
//       beds: 2,
//       baths: 1,
//       area: "74 m²",
//       listed: "12.124",
//     },

//     description: `A beautiful 2 bed 1 bath home that was recently remodeled from head to toe! This house sits on a large corner lot with tons of privacy. Neighbors to one side or the rear of the property! Located just 1 block from a community park. Beautiful, hardwood floors throughout. Recessed lighting throughout. Well designed, open floor plan. Gorgeous kitchen has been expanded and offers brand new white cabinets, granite countertops and stainless steel appliances. The spacious bedrooms have new light fixtures and wire closet organizers to help organize. The bathroom is bright and practically all brand new. Property is currently occupied and rented through October 2024.`,

//     amenities: [
//       "Air Conditioning",
//       "Parking",
//       "Garden",
//       "Security System",
//       "Modern Kitchen",
//       "Hardwood Floors",
//       "Open Floor Plan",
//       "Near Park",
//     ],

//     documents: [
//       { title: "Property Deed", type: "PDF Document", url: "/docs/property-deed.pdf" },
//       { title: "Title Insurance", type: "PDF Document", url: "/docs/title-insurance.pdf" },
//       { title: "Property Inspection Report", type: "PDF Document", url: "/docs/inspection-report.pdf" },
//       { title: "Rental Agreement", type: "PDF Document", url: "/docs/rental-agreement.pdf" },
//       { title: "Financial Projections", type: "PDF Document", url: "/docs/financial-projections.pdf" },
//     ],

//     locationInfo: {
//       address: "Georgia, Missouri, St. Louis, 7751 Mallard Dr",
//     },

//     financials: {
//       metrics: {
//         annualYield: 12.0,
//         rentalIncome: 1.1,
//         valueGrowth: 2.0,
//       },
//       breakdown: [
//         { label: "APR Rating", value: 35, max: 50 },
//         { label: "Security", value: 60, max: 70 },
//         { label: "Token Price", value: 99, max: 100 },
//         { label: "Popularity", value: 23, max: 30 },
//         { label: "Value Growth", value: 10, max: 20 },
//         { label: "Location", value: 90, max: 100 },
//       ],
//     },

//     // MAIN IMAGE + GALLERY
//     image: one,
//     gallery: [one, two, one, two],

//     // TOP SUMMARY
//     propertyValue: 1254682,
//     tokenPrice: 11,           // Price per token
//     minInvestment: 1,         // Minimum slots you can buy
//     availableTokens: 147,     // Current available slots
//     totalSlots: 300,          // Total slots
//     tokensPerSlot: 1000,      // Tokens per slot
//     pricePerSlot: 10000,      // Price per slot
//     tokenValue: 12.50,        // Value per token
//     slotselect: 0,            // Slots selected by user
//     quickSlots: [1, 5, 10, 20],

//     // CALCULATOR
//     defaultInvestment: 1,
//     monthlyIncome: 0.12,
//     annualIncome: 1.45,

//     // RISK
//     riskLevel: "Medium Risk",



//     // main card
//     risk: "Medium Risk",
//       deal: "🔥 Hot Deal",
//       rate: "+8.3% 24h",
// progress: "153 / 300 slots",
// growth: "15–25",
// transferable: "Yes",
//     // PARTNER
//     partner: {
//       name: "Landshare",
//       verified: true,
//     },
//   },
// ];
