import axiosClient from "../../api/axiosClient";

const CATEGORY_TO_TYPE = {
  PER_SQFT_INVESTMENT: "SQFT Investment",
  FRACTIONAL_BUY: "Fractional Buy",
  TOKENIZED: "One Time Buy",
  READY_MADE: "SQFT Investment",
  UNDER_CONSTRUCTION: "Fractional Buy",
  ONE_TIME_BUY: "One Time Buy"
};

const TYPE_TO_INVESTMENT = {
  "SQFT Investment": "PER_SQFT_INVESTMENT",
  "Fractional Buy": "FRACTIONAL_BUY",
  "One Time Buy": "ONE_TIME_BUY",
};

const CATEGORY_ALIASES = {
  READY_MADE: "PER_SQFT_INVESTMENT",
  UNDER_CONSTRUCTION: "FRACTIONAL_BUY",
  TOKENIZED: "ONE_TIME_BUY",
};

const getAuthToken = () =>
  // localStorage.getItem("token") ||
  // sessionStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  sessionStorage.getItem("authToken");

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const toNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toPositiveInt = (value) => Math.max(0, Math.round(toNumber(value)));

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const extractList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.properties)) return response.properties;
  if (Array.isArray(response?.data?.properties)) return response.data.properties;
  if (Array.isArray(response?.result)) return response.result;
  return [];
};

const normalizeCategory = (category) => {
  if (!category) return "";
  return CATEGORY_ALIASES[category] || category;
};

const normalizeType = (rawProperty = {}) => {
  if (rawProperty?.type) return rawProperty.type;
  const normalizedCategory = normalizeCategory(rawProperty?.category);
  if (normalizedCategory && CATEGORY_TO_TYPE[normalizedCategory]) {
    return CATEGORY_TO_TYPE[normalizedCategory];
  }
  return "SQFT Investment";
};

const normalizeImages = (rawProperty = {}) => {
  const imageList = Array.isArray(rawProperty?.images?.main)
    ? rawProperty.images.main
    : Array.isArray(rawProperty?.images)
    ? rawProperty.images
    : rawProperty?.image
    ? [rawProperty.image]
    : [];

  const main = imageList.filter(Boolean);
  return {
    main,
    thumbnails: main.slice(0, 5),
  };
};

const normalizeProperty = (rawProperty = {}) => {
  const type = normalizeType(rawProperty);
  const id = rawProperty?.property_id ?? rawProperty?.id ?? rawProperty?._id ?? "";
  const backendId = rawProperty?.property_id ?? rawProperty?.backendId ?? id;

  const totalValuationNumber = toNumber(
    rawProperty?.totalValuation ??
      rawProperty?.total_value_usd ??
      rawProperty?.propertyValue ??
      rawProperty?.value
  );
  const totalValuation =
    rawProperty?.totalValuation ??
    (totalValuationNumber > 0 ? totalValuationNumber.toLocaleString("en-IN") : "0");

  const totalAreaRaw =
    rawProperty?.specifications?.totalArea ??
    rawProperty?.totalSqft ??
    rawProperty?.pricing?.totalArea ??
    rawProperty?.totalArea ??
    rawProperty?.area;
  const totalAreaNumber = toNumber(totalAreaRaw);
  const availableAreaNumber = toPositiveInt(
    rawProperty?.availableSqft ??
      rawProperty?.availableArea ??
      rawProperty?.pricing?.availableArea
  );
  const totalAreaDisplay =
    typeof totalAreaRaw === "string" && totalAreaRaw.trim().length > 0
      ? totalAreaRaw
      : totalAreaNumber > 0
      ? `${totalAreaNumber.toLocaleString("en-IN")} sqft`
      : "-";

  let totalUnits = toPositiveInt(
    rawProperty?.total_units ??
      rawProperty?.totalSlots ??
      rawProperty?.pricing?.totalSlots
  );
  let availableUnits = toPositiveInt(
    rawProperty?.available_units ??
      rawProperty?.availableUnits ??
      rawProperty?.availableSlots ??
      rawProperty?.pricing?.availableSlots
  );

  if (totalUnits <= 0 && totalAreaNumber > 0) {
    totalUnits = toPositiveInt(totalAreaNumber);
  }

  const normalizedAvailableFromArea =
    totalUnits > 0 ? Math.min(availableAreaNumber, totalUnits) : availableAreaNumber;
  if (availableUnits <= 0 && normalizedAvailableFromArea > 0) {
    availableUnits = normalizedAvailableFromArea;
  }

  const soldFromApi = toPositiveInt(rawProperty?.soldUnits ?? rawProperty?.sold_units);
  const soldUnits = soldFromApi || Math.max(totalUnits - availableUnits, 0);

  const pricePerSqftNumber =
    toNumber(rawProperty?.pricePerSqft) ||
    toNumber(rawProperty?.pricing?.pricePerSqft) ||
    (totalAreaNumber > 0 ? totalValuationNumber / totalAreaNumber : 0);
  const pricePerSqft =
    rawProperty?.pricePerSqft ??
    rawProperty?.pricing?.pricePerSqft ??
    (pricePerSqftNumber > 0 ? Math.round(pricePerSqftNumber) : 0);

  const keyHighlightsRaw = parseArray(rawProperty?.keyHighlights);
  const keyHighlights = keyHighlightsRaw
    .map((item) => (typeof item === "string" ? item : item?.title || item?.desc || ""))
    .filter(Boolean);

  const amenities = parseArray(
    rawProperty?.amenities ?? rawProperty?.overview?.amenities ?? rawProperty?.tabs?.overview?.amenities
  );

  const totalInvestors =
    toPositiveInt(
      rawProperty?.specifications?.totalInvestors ??
        rawProperty?.tokenHolders ??
        rawProperty?.sidebar?.investors
    ) || 0;

  const location =
    rawProperty?.specifications?.location ??
    rawProperty?.location ??
    rawProperty?.address ??
    "-";

  const owners = parseArray(rawProperty?.owners);
  const category = normalizeCategory(rawProperty?.category) || TYPE_TO_INVESTMENT[type];

  const estimatedAnnual = toNumber(rawProperty?.apr_max ?? rawProperty?.aprMax);
  const estimatedMonthly =
    toNumber(rawProperty?.rental_percentage) ||
    (estimatedAnnual > 0 ? Number((estimatedAnnual / 12).toFixed(2)) : 0);

  return {
    ...rawProperty,
    id,
    backendId,
    category,
    type,
    title: rawProperty?.title || rawProperty?.name || "Untitled Property",
    description:
      rawProperty?.description || rawProperty?.tabs?.overview?.about || rawProperty?.overview?.about || "",
    totalValuation,
    pricePerSqft,
    availableUnits,
    soldUnits,
    images: normalizeImages(rawProperty),
    keyHighlights,
    amenities,
    owners,
    specifications: {
      totalArea: totalAreaDisplay,
      propertyType:
        rawProperty?.specifications?.propertyType ||
        rawProperty?.propertyType ||
        rawProperty?.category ||
        "-",
      location,
      totalInvestors,
      parkingSpaces:
        rawProperty?.specifications?.parkingSpaces ??
        rawProperty?.parkingSpaces ??
        "-",
      listingType:
        rawProperty?.specifications?.listingType ||
        rawProperty?.listingType ||
        rawProperty?.status ||
        "-",
    },
    pricing: {
      ...(rawProperty?.pricing || {}),
      totalSlots: totalUnits || toPositiveInt(rawProperty?.pricing?.totalSlots),
      availableSlots: availableUnits,
      pricePerSlot:
        toNumber(rawProperty?.pricing?.pricePerSlot) ||
        (totalUnits > 0 ? totalValuationNumber / totalUnits : 0),
      totalArea: totalAreaNumber,
      availableArea:
        availableAreaNumber ||
        (totalAreaNumber > 0 && totalUnits > 0
          ? Math.round((availableUnits / totalUnits) * totalAreaNumber)
          : 0),
      pricePerSqft: pricePerSqftNumber,
    },
    aprMin: toNumber(rawProperty?.apr_min ?? rawProperty?.aprMin),
    aprMax: estimatedAnnual,
    monthlyReturn: estimatedMonthly,
  };
};

export const getPropertyInvestments = async () => {
  const response = await axiosClient.get("/user/properties/listed", {
    headers: getAuthHeaders(),
  });
  return extractList(response).map(normalizeProperty);
};

export const getConstructionDetails = async (id) => {
  const properties = await getPropertyInvestments();
  return (
    properties.find((property) => String(property?.id) === String(id)) || null
  );
};

export const submitInvestment = async (payload) => {
  try {
    const response = await axiosClient.post("user/properties/invest", payload);
    return response;
  } catch (error) {
    console.error("Investment API Error:", error.response?.data || error);
    throw error;
  }
};

export const submitQuery = async (payload) => {
  const headers = getAuthHeaders();

  try {
    return await axiosClient.post("/user/property-OneTimeContact", payload, { headers });
  } catch (error) {
    if (error?.response?.status === 404) {
      return axiosClient.post("/user/property-OneTimeContact", payload, { headers });
    }
    throw error;
  }
};

export const resolveInvestmentType = (property = {}) =>
  TYPE_TO_INVESTMENT[property?.type] ||
  normalizeCategory(property?.category) ||
  "PER_SQFT_INVESTMENT";
