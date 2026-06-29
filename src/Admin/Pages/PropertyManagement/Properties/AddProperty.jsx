import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminApi } from "../../../Service/adminApi";
import { appConfig } from '../../../../config/appConfig';

const PINATA_JWT = appConfig.PINATA_JWT;

export default function AddProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    // Common fields
    title: "",
    slug: "",
    category: "",
    location: {
  address: "",
  lat: "",
  lng: "",
},
    description: "",
    status: "AVAILABLE",
    construction_stage: "Completed",
    images: [],
    documents: [],
    beds: "",
    baths: "",
    area: "",
    listed: "",

    // Common required fields (for ALL categories)
    total_value_usd: "",
    // total_units: "",
    // total_area : "",
    // available_units: "",
    
    //sqft 
    totalSqft : "",
    pricePerSqft : "",
    // Returns & Risk (common)
    apr_min: "",
    apr_max: "",
    rental_percentage: "",
    risk_level: "Low",

    // TOKENIZED specific
    network: "BEP-20",
    token_address: "",
    totalSupply: "",
    transferable: "Yes",
    propertyValue: "",
    MarketCap: "",
    volume: "",
    mininvest: "",
    tokenPrice: "",
    initTokePri: "",
    growth: "",
    tokenHolders: "",

    // UNDER_CONSTRUCTION specific
    started: "",
    expectedCompletion: "",
    duration: "",
    overallprogress: "",
    structure: "",
    exit: "",
    construction: "",
    projectCompletion: "",
    risk: "",
    risklevel: "",
    risktitle: "",
    riskk: "",
    chain: "",
    value: "",

    financials: {
      metrics: {
        annualYield: "",
        rentalIncome: "",
        valueGrowth: "",
      },
      breakdown: [],
    },
    pricePerSlot: "",
    tokensPerSlot: "",
    tokenValue: "",
    totalSlots: "",
    availableSlots: "",
    parkingSpaces:"",
    // Sidebar fields (NEW)
    sidebar: {
      totalValue: "",
      minInv: "",
      expectedROI: "",
      duration: "",
      completion: "",
      progress: "",
      funprogress: "",
      investors: "",
      raised: "",
    },

    // Under Construction - advanced dynamic fields
    team: [],
    amenities: [],
    milestones: [],
    calculator: {
      minInvestment: "",
      expectedReturn: "",
      lockIn: ""
    },
    keyHighlights: [],
    benefits: [],


    // READY_MADE specific - full fields from your sample
    occupancy: "",
    leaseEnd: "",
    maintenanceCost: "",
    sharetobuy: 1,
    stats: {
      beds: "",
      baths: "",
      area: "",
      listed: "",
    },
    deal: "",
    rate: "",
    progress: "",
    transferable: "Yes",
    partner: {
      name: "",
      verified: false,
    },
    defaultInvestment: "",
    monthlyIncome: "",
    annualIncome: "",
    risk: "Medium Risk",
    propertyValue: "",
    tokenPrice: "",
    minInvestment: "",
    availableTokens: "",
    // totalSlots: "",
    tokensPerSlot: "",
    pricePerSlot: "",
    tokenValue: "",
    slotselect: 0,
    quickSlots: [1, 5, 10, 20],
    overview: {
      about: "",
      blockchain: {
        network: "",
        smartContract: "",
        totalSupply: "",
        transferable: "Yes",
      },
      amenities: [],
    },
    financials: {
      metrics: {
        annualYield: "",
        rentalIncome: "",
        valueGrowth: "",
      },
      breakdown: [],
    },
    marketplace: {
      listings: [],
    },

    marketplace: { listings: [] },
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Helpers
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onTitleChange = (e) => {
    const title = e.target.value;
    setData({ ...data, title, slug: generateSlug(title) });
  };

  const onFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const formatted = files.map((file) => ({
      name: file.name,
      preview: type === "images" ? URL.createObjectURL(file) : null,
      file,
    }));
    setData((prev) => ({ ...prev, [type]: [...prev[type], ...formatted] }));
  };

  const removeMedia = (type, index) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Fetch existing property (edit mode)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const { data: propertyRes } = useQuery({
    queryKey: ["property", id],
    queryFn: () => adminApi.getPropertyById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (propertyRes?.data?.data && id) {
      const p = propertyRes.data.data;
      const tabs = p.tabs || {};
      const overview = tabs.overview || p.overview || {};

      setData({
        title: p.title || "",
        slug: p.slug || "",
        category: p.category || "",
       location: {
  address: p.location?.address || "",
  lat: p.location?.lat || "",
  lng: p.location?.lng || "",
},
        description: p.description || "",
        status: p.status || "AVAILABLE",
        construction_stage: p.construction_stage || "Completed",

        images: p.images?.map((url) => ({ name: url.split("/").pop(), preview: url })) || [],
        documents: p.documents?.map((d) => ({
          name: d.name || d.link?.split("/").pop() || "document",
          type: d.type || "PDF",
          link: d.link || d.name || "",
        })) || [],

        beds: p.beds || "",
        baths: p.baths || "",
        area: p.area || "",
        listed: p.listed || "",

        // Common required financial fields
        total_value_usd: p.total_value_usd || "",
        // total_units: p.total_units || "",
        // available_units: p.available_units || "",

        //add akshay
        pricePerSqft: p.pricePerSqft || "",
        sqftotalSqft: p.totalSqft || "",

        apr_min: p.apr_min || "",
        apr_max: p.apr_max || "",
        rental_percentage: p.rental_percentage || "",
        risk_level: p.risk_level || "Low",

        // Tokenized
        network: p.network || "BEP-20",
        token_address: p.token_address || "",
        totalSupply: p.totalSupply || "",
        transferable: p.transferable || "Yes",
        propertyValue: p.propertyValue || "",
        MarketCap: p.MarketCap || "",
        volume: p.volume || "",
        mininvest: p.mininvest || "",
        tokenPrice: p.tokenPrice || "",
        initTokePri: p.initTokePri || "",
        growth: p.growth || "",
        tokenHolders: p.tokenHolders || "",

        // Under Construction
        started: p.started || p.Started || "",
        expectedCompletion: p.expectedCompletion || "",
        duration: p.duration || "",
        overallprogress: p.overallprogress || "",
        structure: p.structure || "",
        exit: p.exit || "",
        construction: p.construction || "",
        projectCompletion: p.projectCompletion || "",
        risk: p.risk || "",
        risklevel: p.risklevel || "",
        risktitle: p.risktitle || "",
        riskk: p.riskk || "",
        chain: p.chain || "",
        value: p.value || "",
        parkingSpaces: p.parkingSpaces || "",

        financials: {
          metrics: {
            annualYield: p.financials?.metrics?.annualYield || "",
            rentalIncome: p.financials?.metrics?.rentalIncome || "",
            valueGrowth: p.financials?.metrics?.valueGrowth || "",
          },
          breakdown: p.financials?.breakdown || [],
        },
        pricePerSlot: p.pricePerSlot || p.price_per_slot || "",
        tokensPerSlot: p.tokensPerSlot || p.tokens_per_slot || "",
        tokenValue: p.tokenValue || p.token_value || "",
        totalSlots: p.totalSlots || p.total_slots || "",
        availableSlots: p.availableSlots || p.available_slots || "",




        // Sidebar (NEW)
        sidebar: {
          totalValue: p.sidebar?.totalValue || "",
          minInv: p.sidebar?.minInv || "",
          expectedROI: p.sidebar?.expectedROI || "",
          duration: p.sidebar?.duration || "",
          completion: p.sidebar?.completion || "",
          progress: p.sidebar?.progress || "",
          funprogress: p.sidebar?.funprogress || "",
          investors: p.sidebar?.investors || "",
          raised: p.sidebar?.raised || "",
        },

        team: overview.team || [],
        amenities: overview.amenities || [],
        milestones: tabs.milestones?.map(m => ({
          ...m,
          target: m.target ? new Date(m.target).toISOString().split("T")[0] : ""
        })) || [],
        calculator: tabs.calculator || { minInvestment: "", expectedReturn: "", lockIn: "" },
        keyHighlights: Array.isArray(p.keyHighlights)
          ? p.keyHighlights
              .map((item) =>
                typeof item === "string" ? item : item?.title || item?.desc || ""
              )
              .filter(Boolean)
          : Array.isArray(p.keyFeatures)
          ? p.keyFeatures
              .map((item) =>
                typeof item === "string" ? item : item?.title || item?.desc || ""
              )
              .filter(Boolean)
          : [],
        benefits: p.benefits || [],

        // Ready Made
        occupancy: p.occupancy || "",
        leaseEnd: p.leaseEnd ? new Date(p.leaseEnd).toISOString().split("T")[0] : "",
        maintenanceCost: p.maintenanceCost || "",

        sharetobuy: p.sharetobuy || 1,
        stats: {
          beds: p.stats?.beds || p.beds || "",
          baths: p.stats?.baths || p.baths || "",
          area: p.stats?.area || p.area || "",
          listed: p.stats?.listed || "",
        },
        deal: p.deal || "",
        rate: p.rate || "",
        progress: p.progress || "",
        partner: {
          name: p.partner?.name || "",
          verified: p.partner?.verified || false,
        },
        defaultInvestment: p.defaultInvestment || "",
        monthlyIncome: p.monthlyIncome || "",
        annualIncome: p.annualIncome || "",

        minInvestment: p.minInvestment || "",
        availableTokens: p.availableTokens || "",
        totalSlots: p.totalSlots || "",
        tokensPerSlot: p.tokensPerSlot || "",
        pricePerSlot: p.pricePerSlot || "",
        tokenValue: p.tokenValue || "",
        slotselect: p.slotselect || 0,
        quickSlots: p.quickSlots || [1, 5, 10, 20],

        overview: {
          about: overview.about || p.description || "",
          blockchain: {
            network: overview.blockchain?.network || "",
            smartContract: overview.blockchain?.smartContract || "",
            totalSupply: overview.blockchain?.totalSupply || "",
            transferable: overview.blockchain?.transferable || "Yes",
          },
          amenities: overview.amenities || p.amenities || [],
        },

        marketplace: p.marketplace || { listings: [] },

        financials: {
          metrics: {
            annualYield: p.financials?.metrics?.annualYield || "",
            rentalIncome: p.financials?.metrics?.rentalIncome || "",
            valueGrowth: p.financials?.metrics?.valueGrowth || "",
          },
          breakdown: p.financials?.breakdown || [],
        },
      });
    }
  }, [propertyRes, id]);

  useEffect(() => {
  const totalSqft = Number(data.totalSqft);
  const pricePerSqft = Number(data.pricePerSqft);

  if (totalSqft && pricePerSqft) {
    setData((prev) => ({
      ...prev,
      total_value_usd: totalSqft * pricePerSqft,

      // ðŸ‘‡ sidebar me bhi update karo (important for UI)
      sidebar: {
        ...prev.sidebar,
        totalValue: totalSqft * pricePerSqft,
      },
    }));
  }
}, [data.totalSqft, data.pricePerSqft]);

  useEffect(() => {
    return () => {
      data.images.forEach((img) => {
        if (img.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [data.images]);

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Save / Publish
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const savePropertyMutation = useMutation({
    mutationFn: (payload) =>
      id ? adminApi.updateProperty(id, payload) : adminApi.createProperty(payload),
    onSuccess: () => {
      toast.success(id ? "Property updated!" : "Property created!");
      navigate("/admin/property-management/add-property-plan");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const isFormValid = () => {
    return (
  data.title &&
  data.slug &&
  data.category &&
  data.location?.address &&
  data.location?.lat &&
  data.location?.lng
);
  };

  const uploadToPinata = async (file, isDocument = false) => {
    try {
      const formData = new FormData();
      formData.append("file", file.file || file);
      formData.append("name", file.name);
      formData.append("network", "public");

      const res = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);

      const json = await res.json();
      const cid = json.data.cid;
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

      return isDocument
        ? { name: file.name, type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOC", link: url }
        : url;
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }
  };

  const handlePublish = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields");
      return;
    }

    const newImageUrls = await Promise.all(
      data.images.filter((img) => img.file).map((img) => uploadToPinata(img))
    ).then(r => r.filter(Boolean));

    const existingImages = data.images.filter(img => !img.file).map(img => img.preview);

    const newDocs = await Promise.all(
      data.documents.filter(d => d.file).map(d => uploadToPinata(d, true))
    ).then(r => r.filter(Boolean));

    const existingDocs = data.documents.filter(d => !d.file).map(d => ({
      name: d.name,
      type: d.type || "PDF",
      link: d.link,
    }));

    const payload = {
      title: data.title,
      slug: data.slug,
      category: data.category.toUpperCase(),
      location: {
  address: data.location.address,
  lat: Number(data.location.lat),
  lng: Number(data.location.lng),
},
      description: data.description,
      status: data.status,
      construction_stage: data.construction_stage,
parkingSpaces: data.parkingSpaces,
      beds: Number(data.beds) || 0,
      baths: Number(data.baths) || 0,
      area: data.area || "",
      listed: data.listed || "",

      images: [...existingImages, ...newImageUrls],
      documents: [...existingDocs, ...newDocs],

      // Common required fields - always sent
      total_value_usd: Number(data.total_value_usd) || 0,
      // total_units: Number(data.total_units) || 0,
      // available_units: Number(data.available_units) || 0,

      //add akshay
        totalSqft: Number(data.totalSqft) || 0,
  pricePerSqft: Number(data.pricePerSqft) || 0,
      pricePerSlot: Number(data.pricePerSlot) || 0,
      apr_min: Number(data.apr_min) || 0,
      apr_max: Number(data.apr_max) || 0,
      rental_percentage: Number(data.rental_percentage) || 0,
      risk_level: data.risk_level,
      //amenities
 amenities: data.overview.amenities,
      // Tokenized
      // ...(data.category === "TOKENIZED" && {
      ...(data.category === "ONE_TIME_BUY" && {
        network: data.network,
        token_address: data.token_address || null,
        totalSupply: Number(data.totalSupply) || 0,
        transferable: data.transferable,
        propertyValue: Number(data.propertyValue) || 0,
        MarketCap: Number(data.MarketCap) || 0,
        volume: Number(data.volume) || 0,
        mininvest: Number(data.mininvest) || 0,
        tokenPrice: Number(data.tokenPrice) || 0,
        initTokePri: Number(data.initTokePri) || 0,
        growth: Number(data.growth) || 0,
        tokenHolders: Number(data.tokenHolders) || 0,
      }),

      // Under Construction
      ...(data.category === "FRACTIONAL_BUY" && {
        // started: data.started,
        started: data.Started || "",
        totalSlots: Number(data.totalSlots) || 0,
  availableSlots: Number(data.availableSlots) || Number(data.totalSlots) || 0,
        pricePerSlot: Number(data.pricePerSlot) || 0,
        expectedCompletion: data.expectedCompletion,
        duration: data.duration,
        overallprogress: Number(data.overallprogress) || 0,
        structure: data.structure,
        exit: data.exit,
        construction: data.construction,
        projectCompletion: data.projectCompletion,
        risk: data.risk,
        risklevel: data.risklevel,
        risktitle: data.risktitle,
        riskk: data.riskk,
        chain: data.chain,
        value: Number(data.value) || 0,
        

        // Sidebar - NEW
        sidebar: {
          totalValue: data.sidebar.totalValue || "",
          minInv: data.sidebar.minInv || "",
          expectedROI: data.sidebar.expectedROI || "",
          duration: data.sidebar.duration || "",
          completion: data.sidebar.completion || "",
          progress: data.sidebar.progress || "",
          funprogress: data.sidebar.funprogress || "",
          investors: data.sidebar.investors || "",
          raised: data.sidebar.raised || "",
        },

        // Root overview for consistency with sample
        overview: {
          about: data.overview.about || data.description,
          blockchain: {
            network: data.overview.blockchain.network || "",
            smartContract: data.overview.blockchain.smartContract || "",
            totalSupply: data.overview.blockchain.totalSupply || "",
            transferable: data.overview.blockchain.transferable || "Yes",
          },
          overview: {
  amenities: data.overview.amenities,
}
        },

        // Tabs
        tabs: {
          overview: {
            about: data.description, // Use description as about
            details: {
              beds: Number(data.beds) || 0,
              baths: Number(data.baths) || 0,
              area: data.area || "",
              listed: data.listed || "",
            },
            team: data.team,
            amenities: data.amenities,
          },
          milestones: data.milestones,
          calculator: data.calculator,
          documents: data.documents.map(d => d.name), // Extract names for tabs.documents
        },

        keyHighlights: data.keyHighlights
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean),
        benefits: data.benefits,
      }),

      // READY_MADE - all fields
      ...(data.category === "PER_SQFT_INVESTMENT" && {
        occupancy: data.occupancy || undefined,
        leaseEnd: data.leaseEnd || undefined,
        maintenanceCost: data.maintenanceCost || undefined,

        sharetobuy: Number(data.sharetobuy) || 1,
        stats: {
          beds: data.stats.beds || data.beds || "",
          baths: data.stats.baths || data.baths || "",
          area: data.stats.area || data.area || "",
          listed: data.stats.listed || "",
        },
        deal: data.deal || undefined,
        rate: data.rate || undefined,
        progress: data.progress || undefined,
        transferable: data.transferable || "Yes",
        partner: {
          name: data.partner.name || "",
          verified: data.partner.verified || false,
        },
        defaultInvestment: data.defaultInvestment || undefined,
        monthlyIncome: data.monthlyIncome || undefined,
        annualIncome: data.annualIncome || undefined,
        risk: data.risk || undefined,

        propertyValue: Number(data.propertyValue) || undefined,
        tokenPrice: Number(data.tokenPrice) || undefined,
        minInvestment: Number(data.minInvestment) || undefined,
        availableTokens: Number(data.availableTokens) || undefined,
        totalSlots: Number(data.totalSlots) || undefined,
        
        tokensPerSlot: Number(data.tokensPerSlot) || undefined,
        pricePerSlot: Number(data.pricePerSlot) || undefined,
        tokenValue: Number(data.tokenValue) || undefined,
        slotselect: Number(data.slotselect) || 0,
        quickSlots: data.quickSlots?.length > 0 ? data.quickSlots : undefined,

        overview: data.overview.about || data.overview.amenities?.length > 0 ? {
          about: data.overview.about || undefined,
          blockchain: {
            network: data.overview.blockchain.network || undefined,
            smartContract: data.overview.blockchain.smartContract || undefined,
            totalSupply: data.overview.blockchain.totalSupply || undefined,
            transferable: data.overview.blockchain.transferable || "Yes",
          },
          amenities: data.overview.amenities?.length > 0 ? data.overview.amenities : undefined,
        } : undefined,

        financials: (data.financials.metrics.annualYield ||
          data.financials.metrics.rentalIncome ||
          data.financials.metrics.valueGrowth ||
          data.financials.breakdown?.length > 0) ? {
          metrics: {
            annualYield: data.financials.metrics.annualYield || undefined,
            rentalIncome: data.financials.metrics.rentalIncome || undefined,
            valueGrowth: data.financials.metrics.valueGrowth || undefined,
          },
          breakdown: data.financials.breakdown?.length > 0 ? data.financials.breakdown : undefined,
        } : undefined,

        marketplace: data.marketplace.listings?.length > 0 ? { listings: data.marketplace.listings } : undefined,
      }),
    }
console.log("🚀 parkingSpaces BEFORE SEND:", data.parkingSpaces);
    savePropertyMutation.mutate(payload);
  };

  
  const isTokenized = data.category === "ONE_TIME_BUY";
  const isUnderConstruction = data.category === "FRACTIONAL_BUY";
  const isReadyMade = data.category === "PER_SQFT_INVESTMENT";


  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      <div className="max-w-8xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? "Edit Property" : "Add Property"}
        </h1>

        {/* BASIC INFO */}
        <Card title="Basic Info">
          <TwoGrid>
            <Input label="Title" name="title" value={data.title} onChange={onTitleChange} required />
            <Input label="Slug" name="slug" value={data.slug} readOnly />
            <Select
              label="Category"
              name="category"
              value={data.category}
              // options={["TOKENIZED", "UNDER_CONSTRUCTION", "READY_MADE"]}
              options={["ONE_TIME_BUY", "FRACTIONAL_BUY", "PER_SQFT_INVESTMENT"]}
              onChange={onChange}
              required
            />
        <div className="col-span-2">
  <label className="text-sm text-gray-700">
    Location <span className="text-red-500">*</span>
  </label>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
    
    {/* Address */}
    <input
      type="text"
      placeholder="Address (e.g. Indore, MP)"
      value={data.location.address}
      onChange={(e) =>
        setData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            address: e.target.value,
          },
        }))
      }
      className="border px-3 py-2 rounded w-full"
    />

    {/* Latitude */}
    <input
      type="number"
      placeholder="Latitude"
      value={data.location.lat}
      onChange={(e) =>
        setData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lat: e.target.value,
          },
        }))
      }
      className="border px-3 py-2 rounded w-full"
    />

    {/* Longitude */}
    <input
      type="number"
      placeholder="Longitude"
      value={data.location.lng}
      onChange={(e) =>
        setData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lng: e.target.value,
          },
        }))
      }
      className="border px-3 py-2 rounded w-full"
    />
  </div>
</div>
            <Select label="Status" name="status" value={data.status} options={["AVAILABLE", "SOLD_OUT", "COMING_SOON"]} onChange={onChange} />
            <Select label="Construction Stage" name="construction_stage" value={data.construction_stage} options={["Completed", "Ongoing", "Planning"]} onChange={onChange} />
          </TwoGrid>
        </Card>

        {/* DESCRIPTION */}
        <Card title="Description">
          <Textarea name="description" value={data.description} onChange={onChange} />
        </Card>

        {/* MEDIA */}
        <Card title="Media">
          <TwoGrid>
            <Upload label="Images" multiple accept="image/*" onChange={(e) => onFileChange(e, "images")} />
            <Upload label="Documents" multiple accept=".pdf,.doc,.docx" onChange={(e) => onFileChange(e, "documents")} />
          </TwoGrid>

          {data.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {data.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.preview} className="h-24 w-full object-cover rounded border" alt={img.name} />
                  <button onClick={() => removeMedia("images", i)} className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded">
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {data.documents.length > 0 && (
            <ul className="mt-3 text-sm space-y-1">
              {data.documents.map((d, i) => (
                <li key={i} className="flex items-center justify-between">
                  ðŸ“„ {d.name} {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer">(View)</a>}
                  <button onClick={() => removeMedia("documents", i)} className="text-red-500 ml-2">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>


        {/* Key Features - Added inputs for bg, color, monincome */}
        <Card title="Key Highlights">
              {data.keyHighlights.map((item, i) => (
                <div key={i} className="border rounded p-5 mb-5 bg-gray-50 relative">
                  <button
                    className="absolute top-3 right-3 text-red-600 text-xl"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        keyHighlights: p.keyHighlights.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    X
                  </button>
                  <div className="grid md:grid-cols-1 gap-4">
                    <Input
                      label="Key Highlight"
                      value={item}
                      onChange={(e) => {
                        const updated = [...data.keyHighlights];
                        updated[i] = e.target.value;
                        setData((p) => ({ ...p, keyHighlights: updated }));
                      }}
                      required
                      placeholder="e.g. Prime location with high rental demand"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() =>
                  setData((p) => ({ ...p, keyHighlights: [...p.keyHighlights, ""] }))
                }
              >
                + Add Key Highlight
              </button>
            </Card>

      <Card title="Amenities">
              <div className="space-y-3">
                {data.overview.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Input value={item} onChange={(e) => {
                      const updated = [...data.overview.amenities];
                      updated[idx] = e.target.value;
                      setData(p => ({ ...p, overview: { ...p.overview, amenities: updated } }));
                    }} placeholder="e.g. Air Conditioning" />
                    <button className="text-red-600 hover:text-red-800 text-xl" onClick={() => {
                      const updated = data.overview.amenities.filter((_, i) => i !== idx);
                      setData(p => ({ ...p, overview: { ...p.overview, amenities: updated } }));
                    }}>Ã—</button>
                  </div>
                ))}
                <button type="button" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setData(p => ({
                  ...p,
                  overview: { ...p.overview, amenities: [...p.overview.amenities, ""] }
                }))}>
                  + Add Amenity
                </button>
              </div>
            </Card>

          <Card title="Basic Financial Info (Required for All Categories)">
          <Grid>
          
            <Input
              type="number"
              label="Total Area"
              name="totalSqft"
              value={data.totalSqft}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Per Sqft Price"
              name="pricePerSqft"
              value={data.pricePerSqft}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
              <Input
              type="number"
              label="Total Value (INR)"
              name="total_value_usd"
              value={data.total_value_usd}
              onChange={onChange}
              min="0"
              placeholder="Required"
              readOnly
            />
          </Grid>
        </Card>

         {/* <Card title="Calculator Defaults">
              <Grid>
                <Input label="Default Investment" name="defaultInvestment" value={data.defaultInvestment} onChange={onChange} placeholder="1" />
                <Input label="Monthly Income %" name="monthlyIncome" value={data.monthlyIncome} onChange={onChange} placeholder="0.12" />
                <Input label="Annual Income %" name="annualIncome" value={data.annualIncome} onChange={onChange} placeholder="1.45" />
              </Grid>
            </Card> */}


        {/* TOKENIZED */}
        {/* {isTokenized && (
          <>

          <Card title="Basic Financial Info (Required for All Categories)">
          <Grid>

            <Input
              type="number"
              label="Total Area"
              name="totalSqft"
              value={data.totalSqft}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Per Sqft Price"
              name="pricePerSqft"
              value={data.pricePerSqft}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Total Value (INR)"
              name="total_value_usd"
              value={data.total_value_usd}
              onChange={onChange}
              min="0"
              placeholder="Required"
              readOnly
            />
          </Grid>
        </Card>
           
          </>
        )} */}

        {/* UNDER CONSTRUCTION */}
        {isUnderConstruction && (
          <div className="space-y-8">

            <Card title="Token & Slot Configuration">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input
                      type="number"
                      label="Price per Slot (INR)"
                      value={data.pricePerSlot}
                      onChange={onChange}
                      name="pricePerSlot"
                      placeholder="5000"
                    />
                    {/* <Input
                      type="number"
                      label="Tokens per Slot"
                      value={data.tokensPerSlot}
                      onChange={onChange}
                      name="tokensPerSlot"
                      placeholder="1000"
                    />
                    <Input
                      type="number"
                      label="Current Token Value (INR)"
                      value={data.tokenValue}
                      onChange={onChange}
                      name="tokenValue"
                      placeholder="5.2"
                      step="0.01"
                    /> */}
                    <Input
                      type="number"
                      label="Total Slots"
                      value={data.totalSlots}
                      onChange={onChange}
                      name="totalSlots"
                      placeholder="0"
                    />
                    <Input
                      type="number"
                      label="Available Slots"
                      value={data.availableSlots}
                      onChange={onChange}
                      name="availableSlots"
                      placeholder="0"
                    /> 
                  </div>
                </Card>
          </div>
        )}

        {/* READY MADE */}

        {/* {isReadyMade && (
          <div className="space-y-8">

           <Card title="Basic Financial Info (Required for All Categories)">
          <Grid>

            <Input
              type="number"
              label="Total Area"
              name="totalSqft"
              value={data.totalSqft}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Per Sqft Price"
              name="pricePerSqft"
              value={data.pricePerSqft}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Total Value (INR)"
              name="total_value_usd"
              value={data.total_value_usd}
              onChange={onChange}
              min="0"
              placeholder="Required"
              readOnly
            />
          </Grid>
        </Card>
          </div>
        )} */}
      

        {/* COMMON RETURNS & RISK */}
        <Card title="Parking Spaces">
          <Grid>
          <Input type="number" label="APR Min" name="apr_min" value={data.apr_min} onChange={onChange} min="0" />
            <Input type="number" label="APR Max" name="apr_max" value={data.apr_max} onChange={onChange} min="0" />
            <Input type="number" label="Rental %" name="rental_percentage" value={data.rental_percentage} onChange={onChange} min="0" />
            <Select
  label="Parking Spaces"
  name="parkingSpaces"
  value={data.parkingSpaces}
  options={["Yes", "No"]}
  onChange={(e) =>
  setData({ ...data, parkingSpaces: e.target.value })
}
/>
            
          </Grid>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={savePropertyMutation.isLoading || !isFormValid()}
            className="px-8 py-3 rounded-lg bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-white disabled:opacity-50"
          >
            {savePropertyMutation.isLoading ? "Saving..." : id ? "Update Property" : "Publish Property"}

          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl border space-y-4">
    <h2 className="font-medium text-gray-900">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>
);

const TwoGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, required, ...props }) => (
  <div>
    <label className="text-sm text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input className="w-full mt-1 border px-3 py-2 rounded" {...props} />
  </div>
);

const Textarea = (props) => (
  <textarea rows="4" className="w-full border px-3 py-2 rounded" {...props} />
);

const Select = ({ label, options, required, ...props }) => (
  <div>
    <label className="text-sm text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select className="w-full mt-1 border px-3 py-2 rounded" {...props}>
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Upload = ({ label, ...props }) => (
  <label className="border-2 border-dashed p-6 rounded text-center cursor-pointer block">
    <p className="text-sm">{label}</p>
    <input type="file" className="hidden" {...props} />
  </label>
);