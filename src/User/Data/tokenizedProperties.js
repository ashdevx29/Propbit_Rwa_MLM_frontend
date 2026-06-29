import axios from "axios";

import { appConfig } from "../../config/appConfig";

export const getTokenizedProperties = async () => {
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

    if (!res?.data?.data) {
      return [];
    }

    return res.data.data
      .filter(p => p.category === "ONE_TIME_BUY")
      .map(p => ({
        id: p.property_id,   
        backendId: p.property_id,  // buy API ID

        title: p.title,
        slug: p.slug,
        location: p.location,
        description: p.description,
        images: p.images || [],
        image: p.images?.[0] || null,

        network: p.network,
        token_address: p.token_address,
        totalSupply: p.total_units,
        transferable: p.transferable,
        chain: p.status || "AVAILABLE",
        //  chain: p.network,
        growth: Number(p.growth),
        tokenPrice: p.tokenPrice,
        propertyValue: p.propertyValue,
        MarketCap: p.MarketCap,
        volume: p.volume,

        totaltoken: p.total_units,
        avaitoken: p.available_units,
        mininvest: p.mininvest,
        tokenHolders: p.tokenHolders,
        initTokePri: p.initTokePri,

        beds: p.beds,
        baths: p.baths,
        area: p.area,

        overview: p.description,
        marketplace: p.marketplace, 

        documents: p.documents || [],
      }));
  } catch (error) {
    console.error(
      "❌ One_Time_Buy fetch failed:",
      error?.response?.status,
      error?.message
    );
    return [];
  }
};