
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
    location: "",
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
    totalSqft: "",
    pricePerSqft: "",
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
    keyFeatures: [],
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

  // ────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────

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

  // ────────────────────────────────────────────────
  // Fetch existing property (edit mode)
  // ────────────────────────────────────────────────

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
        location: p.location || "",
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
        keyFeatures: p.keyFeatures || [],
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

        // 👇 sidebar me bhi update karo (important for UI)
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

  // ────────────────────────────────────────────────
  // Save / Publish
  // ────────────────────────────────────────────────

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
    return data.title && data.slug && data.category && data.location;
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
      location: data.location,
      description: data.description,
      status: data.status,
      construction_stage: data.construction_stage,

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

      apr_min: Number(data.apr_min) || 0,
      apr_max: Number(data.apr_max) || 0,
      rental_percentage: Number(data.rental_percentage) || 0,
      risk_level: data.risk_level,

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
          amenities: data.amenities,
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

        keyFeatures: data.keyFeatures,
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
            <Input label="Location" name="location" value={data.location} onChange={onChange} required />
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
                  📄 {d.name} {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer">(View)</a>}
                  <button onClick={() => removeMedia("documents", i)} className="text-red-500 ml-2">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* PROPERTY DETAILS */}
        {/* <Card title="Property Details">
          <Grid>
            <Input type="number" label="Bedrooms" name="beds" value={data.beds} onChange={onChange} min="0" required />
            <Input type="number" label="Bathrooms" name="baths" value={data.baths} onChange={onChange} min="0" required />
            <Input type="text" label="Area" name="area" value={data.area} onChange={onChange} required />
          </Grid>
        </Card> */}

        {/* COMMON REQUIRED FINANCIAL FIELDS */}
        {/* <Card title="Basic Financial Info (Required for All Categories)">
          <Grid>
            <Input
              type="number"
              label="Total Value (USD)"
              name="total_value_usd"
              value={data.total_value_usd}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Total Units"
              name="total_units"
              value={data.total_units}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
            <Input
              type="number"
              label="Available Units"
              name="available_units"
              value={data.available_units}
              onChange={onChange}
              min="0"
              placeholder="Required"
            />
          </Grid>
        </Card> */}
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
              label="Total Value (USD)"
              name="total_value_usd"
              value={data.total_value_usd}
              onChange={onChange}
              min="0"
              placeholder="Required"
              readOnly
            />
          </Grid>
        </Card>


        {/* Key Features - Added inputs for bg, color, monincome */}
        <Card title="Key Features">
          {data.keyFeatures.map((f, i) => (
            <div key={i} className="border rounded p-5 mb-5 bg-gray-50 relative">
              <button className="absolute top-3 right-3 text-red-600 text-xl" onClick={() => setData(p => ({ ...p, keyFeatures: p.keyFeatures.filter((_, idx) => idx !== i) }))}>×</button>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Title" value={f.title} onChange={e => { const t = [...data.keyFeatures]; t[i].title = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} />
                {/* <Input label="Description" value={f.desc} onChange={e => { const t = [...data.keyFeatures]; t[i].desc = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} /> */}
              </div>
            </div>
          ))}
          <button type="button" className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setData(p => ({ ...p, keyFeatures: [...p.keyFeatures, { title: "", desc: "", icon: "", bg: "", color: "", monincome: "" }] }))} >+ Add Key Feature</button>
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
                    }}>×</button>
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


        {/* TOKENIZED */}
        {isTokenized && (
          <>
            <Card title="Property Details">
              <Grid>
                <Input type="number" label="Bedrooms" name="beds" value={data.beds} onChange={onChange} min="0" required />
                <Input type="number" label="Bathrooms" name="baths" value={data.baths} onChange={onChange} min="0" required />
                {/* <Input type="text" label="Area" name="area" value={data.area} onChange={onChange} required /> */}

              </Grid>
            </Card>
            <Card title="Blockchain / Token">
              <TwoGrid>
                <Select label="Network" name="network" value={data.network} options={["BEP-20", "Ethereum", "Polygon", "Solana"]} onChange={onChange} />
                <Input label="Token Address" name="token_address" value={data.token_address} onChange={onChange} />
                <Input type="number" label="Total Supply" name="totalSupply" value={data.totalSupply} onChange={onChange} min="0" />
                <Select label="Transferable" name="transferable" value={data.transferable} options={["Yes", "No"]} onChange={onChange} />
              </TwoGrid>
            </Card>

            <Card title="Financial Details">
              <Grid>
                <Input type="number" label="Property Value" name="propertyValue" value={data.propertyValue} onChange={onChange} />
                <Input type="number" label="Market Cap" name="MarketCap" value={data.MarketCap} onChange={onChange} />
                <Input type="number" label="Volume" name="volume" value={data.volume} onChange={onChange} />
                <Input type="number" label="Min Investment" name="mininvest" value={data.mininvest} onChange={onChange} />
                <Input type="number" label="Token Price" name="tokenPrice" value={data.tokenPrice} onChange={onChange} />
                <Input type="number" label="Initial Token Price" name="initTokePri" value={data.initTokePri} onChange={onChange} />
                <Input type="number" label="Growth %" name="growth" value={data.growth} onChange={onChange} />
                <Input type="number" label="Token Holders" name="tokenHolders" value={data.tokenHolders} onChange={onChange} />
              </Grid>
            </Card>
          </>
        )}

        {/* UNDER CONSTRUCTION */}
        {isUnderConstruction && (
          <div className="space-y-8">

            {/* Add Overview for root overview */}
            {/* <Card title="Overview">
              <Textarea label="About the Property" value={data.overview.about} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, about: e.target.value } }))} rows={6} placeholder="Detailed description..." />
            </Card> */}

            <Card title="Property Details">
              <Grid>
                <Input type="number" label="Bedrooms" name="beds" value={data.beds} onChange={onChange} min="0" required />
                <Input type="number" label="Bathrooms" name="baths" value={data.baths} onChange={onChange} min="0" required />
                <Input type="text" label="Area" name="area" value={data.area} onChange={onChange} required />
              </Grid>
            </Card>

            {/* Add Blockchain Information for root overview.blockchain */}
            <Card title="Blockchain Information">
              <TwoGrid>
                <Input label="Network" value={data.overview.blockchain.network} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, network: e.target.value } } }))} placeholder="Ethereum Mainnet" />
                <Input label="Smart Contract" value={data.overview.blockchain.smartContract} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, smartContract: e.target.value } } }))} placeholder="0x..." />
                <Input label="Total Supply" value={data.overview.blockchain.totalSupply} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, totalSupply: e.target.value } } }))} placeholder="300000" />
                <Select label="Transferable" value={data.overview.blockchain.transferable} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, transferable: e.target.value } } }))} options={["Yes", "No"]} />
              </TwoGrid>
            </Card>

            <Card title="Construction Timeline">
              <TwoGrid>
                <div>
                  <label className="text-sm text-gray-700">Started</label>
                  <input
                    type="date"
                    name="started"
                    value={data.started}
                    onChange={onChange}
                    className="w-full mt-1 border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Expected Completion</label>
                  <input
                    type="date"
                    name="expectedCompletion"
                    value={data.expectedCompletion}
                    onChange={onChange}
                    className="w-full mt-1 border px-3 py-2 rounded"
                  />
                </div>

                {/* ─── Financial Metrics & Breakdown ─── */}


                <Input type="number" label="Duration (months)" name="duration" value={data.duration} onChange={onChange} />
                <Input type="number" label="Overall Progress (%)" name="overallprogress" value={data.overallprogress} onChange={onChange} max="100" />
                <Input label="Structure Stage" name="structure" value={data.structure} onChange={onChange} placeholder="Foundation & Structure" />
                <Input label="Exit Option" name="exit" value={data.exit} onChange={onChange} placeholder="Withdraw after completion" />
              </TwoGrid>
            </Card>

            <Card title="Financial Metrics & Score Breakdown">
              <div className="space-y-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    type="text"
                    label="Annual Yield (e.g. 18-22)"
                    value={data.financials.metrics.annualYield}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      financials: {
                        ...prev.financials,
                        metrics: { ...prev.financials.metrics, annualYield: e.target.value }
                      }
                    }))}
                    placeholder="18-22"
                  />
                  <Input
                    type="text"
                    label="Rental Income (%)"
                    value={data.financials.metrics.rentalIncome}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      financials: {
                        ...prev.financials,
                        metrics: { ...prev.financials.metrics, rentalIncome: e.target.value }
                      }
                    }))}
                    placeholder="7-9"
                  />
                  <Input
                    type="text"
                    label="Value Growth (%)"
                    value={data.financials.metrics.valueGrowth}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      financials: {
                        ...prev.financials,
                        metrics: { ...prev.financials.metrics, valueGrowth: e.target.value }
                      }
                    }))}
                    placeholder="8-12"
                  />
                </div>

                {/* Breakdown Items */}
                <div>
                  <h4 className="font-medium mb-3">Property Score Breakdown</h4>
                  {data.financials.breakdown.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-4 mb-4 bg-gray-50 relative">
                      <button
                        className="absolute top-2 right-2 text-red-600 text-xl"
                        onClick={() => {
                          const updated = data.financials.breakdown.filter((_, i) => i !== idx);
                          setData(prev => ({
                            ...prev,
                            financials: { ...prev.financials, breakdown: updated }
                          }));
                        }}
                      >
                        ×
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Label"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...data.financials.breakdown];
                            updated[idx].label = e.target.value;
                            setData(prev => ({
                              ...prev,
                              financials: { ...prev.financials, breakdown: updated }
                            }));
                          }}
                          placeholder="Location Score"
                        />
                        <Input
                          type="number"
                          label="Value"
                          value={item.value}
                          onChange={(e) => {
                            const updated = [...data.financials.breakdown];
                            updated[idx].value = Number(e.target.value);
                            setData(prev => ({
                              ...prev,
                              financials: { ...prev.financials, breakdown: updated }
                            }));
                          }}
                          min="0"
                          step="0.1"
                        />
                        <Input
                          type="number"
                          label="Max"
                          value={item.max}
                          onChange={(e) => {
                            const updated = [...data.financials.breakdown];
                            updated[idx].max = Number(e.target.value);
                            setData(prev => ({
                              ...prev,
                              financials: { ...prev.financials, breakdown: updated }
                            }));
                          }}
                          min="1"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    onClick={() => setData(prev => ({
                      ...prev,
                      financials: {
                        ...prev.financials,
                        breakdown: [...prev.financials.breakdown, { label: "", value: 0, max: 10 }]
                      }
                    }))}
                  >
                    + Add Score Item
                  </button>
                </div>
              </div>
            </Card>

            {/* ─── Token / Slot Details ─── */}
            <Card title="Token & Slot Configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  type="number"
                  label="Price per Slot ($)"
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
                      label="Current Token Value ($)"
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

            <Card title="Project & Risk Info">
              <TwoGrid>
                <Input label="Construction Type" name="construction" value={data.construction} onChange={onChange} />
                <Input label="Project Completion" name="projectCompletion" value={data.projectCompletion} onChange={onChange} />
                <Input label="Risk Level" name="risklevel" value={data.risklevel} onChange={onChange} placeholder="Medium Risk" />
                <Input label="Chain" name="chain" value={data.chain} onChange={onChange} />
                <Input type="number" label="Display Value" name="value" value={data.value} onChange={onChange} />
              </TwoGrid>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Risk Description</label>
                  <textarea
                    name="risk"
                    value={data.risk}
                    onChange={onChange}
                    rows={4}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Describe project risks..."
                  />
                </div>
                {/* <Input label="Risk Title" name="risktitle" value={data.risktitle} onChange={onChange} />
                <Textarea name="riskk" value={data.riskk} onChange={onChange} rows={5} placeholder="Detailed risk disclosure..." /> */}
              </div>
            </Card>

            {/* ─── NEW: Sidebar / Project Highlights ─── */}
            <Card title="Sidebar / Project Highlights">
              <Grid>
                <Input
                  label="Total Value"
                  value={data.sidebar.totalValue}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, totalValue: e.target.value } }))}
                  placeholder="$5.00M"
                />
                <Input
                  label="Min Investment"
                  value={data.sidebar.minInv}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, minInv: e.target.value } }))}
                  placeholder="10,000"
                />
                <Input
                  label="Expected ROI"
                  value={data.sidebar.expectedROI}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, expectedROI: e.target.value } }))}
                  placeholder="2.3%"
                />
                <Input
                  label="Duration"
                  value={data.sidebar.duration}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, duration: e.target.value } }))}
                  placeholder="24 months"
                />
                <Input
                  label="Expected Completion"
                  value={data.sidebar.completion}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, completion: e.target.value } }))}
                  placeholder="Dec 2026"
                />
                <Input
                  label="Progress %"
                  type="number"
                  value={data.sidebar.progress}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, progress: e.target.value } }))}
                />
                <Input
                  label="Funding Progress %"
                  type="number"
                  value={data.sidebar.funprogress}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, funprogress: e.target.value } }))}
                />
                <Input
                  label="Number of Investors"
                  type="number"
                  value={data.sidebar.investors}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, investors: e.target.value } }))}
                />
                <Input
                  label="Amount Raised"
                  value={data.sidebar.raised}
                  onChange={(e) => setData(p => ({ ...p, sidebar: { ...p.sidebar, raised: e.target.value } }))}
                  placeholder="$3.25M"
                />
              </Grid>
            </Card>

            {/* ─── NEW: Amenities ─── */}
            {/* <Card title="Amenities">
              <div className="space-y-3">
                {data.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      value={amenity}
                      onChange={(e) => {
                        const newAmenities = [...data.amenities];
                        newAmenities[index] = e.target.value;
                        setData((prev) => ({ ...prev, amenities: newAmenities }));
                      }}
                      placeholder="e.g. Rooftop Pool"
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-xl"
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          amenities: prev.amenities.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() =>
                    setData((prev) => ({ ...prev, amenities: [...prev.amenities, ""] }))
                  }
                >
                  + Add Amenity
                </button>
              </div>
            </Card> */}

            <Card title="Investment Calculator">
              <TwoGrid>
                <Input label="Min Investment" value={data.calculator.minInvestment} onChange={(e) => setData(p => ({ ...p, calculator: { ...p.calculator, minInvestment: e.target.value } }))} placeholder="$5,000" />
                <Input label="Expected Return" value={data.calculator.expectedReturn} onChange={(e) => setData(p => ({ ...p, calculator: { ...p.calculator, expectedReturn: e.target.value } }))} placeholder="12–15%" />
                <Input label="Lock-in Period" value={data.calculator.lockIn} onChange={(e) => setData(p => ({ ...p, calculator: { ...p.calculator, lockIn: e.target.value } }))} placeholder="24 months" />
              </TwoGrid>
            </Card>

            {/* Team - Added inputs for color, bgcolor, icon */}
            {/* <Card title="Project Team">
              {data.team.map((member, index) => (
                <div key={index} className="border rounded p-4 mb-4 bg-gray-50 relative">
                  <button className="absolute top-2 right-2 text-red-600 text-xl" onClick={() => setData(p => ({ ...p, team: p.team.filter((_, i) => i !== index) }))}>×</button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Role" value={member.role} onChange={e => { const t = [...data.team]; t[index].role = e.target.value; setData(p => ({ ...p, team: t })); }} placeholder="Developer" />
                    <Input label="Name / Company" value={member.name} onChange={e => { const t = [...data.team]; t[index].name = e.target.value; setData(p => ({ ...p, team: t })); }} placeholder="Prime Developments LLC" />
                  </div>
                </div>
              ))}
              <button type="button" className="mt-3 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setData(p => ({ ...p, team: [...p.team, { role: "", name: "", color: "", bgcolor: "", icon: "" }] }))}>+ Add Team Member</button>
            </Card> */}

            {/* Milestones */}
            {/* <Card title="Milestones">
              {data.milestones.map((ms, i) => (
                <div key={i} className="border rounded p-5 mb-5 bg-gray-50 relative">
                  <button className="absolute top-3 right-3 text-red-600 text-xl" onClick={() => setData(p => ({ ...p, milestones: p.milestones.filter((_, idx) => idx !== i) }))}>×</button>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <Input label="Milestone" value={ms.label} onChange={e => { const t = [...data.milestones]; t[i].label = e.target.value; setData(p => ({ ...p, milestones: t })); }} />
                    <Select label="Status" value={ms.status} onChange={e => { const t = [...data.milestones]; t[i].status = e.target.value; setData(p => ({ ...p, milestones: t })); }} options={["Pending", "In Progress", "Completed"]} />
                    <div>
                      <label className="text-sm text-gray-700">Target Date</label>
                      <input
                        type="date"
                        value={ms.target || ""}
                        onChange={e => {
                          const t = [...data.milestones];
                          t[i].target = e.target.value;
                          setData(p => ({ ...p, milestones: t }));
                        }}
                        className="w-full mt-1 border px-3 py-2 rounded"
                      />
                    </div>
                    <Input type="number" label="Progress %" value={ms.progress} onChange={e => { const t = [...data.milestones]; t[i].progress = Number(e.target.value); setData(p => ({ ...p, milestones: t })); }} min="0" max="100" />
                  </div>
                  <Textarea label="Description" value={ms.desc || ""} onChange={e => { const t = [...data.milestones]; t[i].desc = e.target.value; setData(p => ({ ...p, milestones: t })); }} />
                </div>
              ))}
              <button type="button" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setData(p => ({ ...p, milestones: [...p.milestones, { label: "", status: "Pending", desc: "", target: "", progress: 0 }] }))} >+ Add Milestone</button>
            </Card> */}

            {/* Key Features - Added inputs for bg, color, monincome */}
            <Card title="Key Features">
              {data.keyFeatures.map((f, i) => (
                <div key={i} className="border rounded p-5 mb-5 bg-gray-50 relative">
                  <button className="absolute top-3 right-3 text-red-600 text-xl" onClick={() => setData(p => ({ ...p, keyFeatures: p.keyFeatures.filter((_, idx) => idx !== i) }))}>×</button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Title" value={f.title} onChange={e => { const t = [...data.keyFeatures]; t[i].title = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} />
                    <Input label="Description" value={f.desc} onChange={e => { const t = [...data.keyFeatures]; t[i].desc = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} />
                    {/* <Input label="Icon (optional)" value={f.icon || ""} onChange={e => { const t = [...data.keyFeatures]; t[i].icon = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} placeholder="shield, check..." />
                    <Input label="Bg" value={f.bg || ""} onChange={e => { const t = [...data.keyFeatures]; t[i].bg = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} placeholder="bg-[#DCFCE7]" />
                    <Input label="Color" value={f.color || ""} onChange={e => { const t = [...data.keyFeatures]; t[i].color = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} placeholder="text-[#00A63E]" /> */}
                    {/* <Input label="Mon Income (optional)" value={f.monincome || ""} onChange={e => { const t = [...data.keyFeatures]; t[i].monincome = e.target.value; setData(p => ({ ...p, keyFeatures: t })); }} placeholder="2.5%" /> */}
                  </div>
                </div>
              ))}
              <button type="button" className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setData(p => ({ ...p, keyFeatures: [...p.keyFeatures, { title: "", desc: "", icon: "", bg: "", color: "", monincome: "" }] }))} >+ Add Key Feature</button>
            </Card>

            {/* Benefits - Added inputs for bg, iconBg, iconColor */}
            {/* <Card title="Benefits">
              {data.benefits.map((b, i) => (
                <div key={i} className="border rounded p-5 mb-5 bg-gray-50 relative">
                  <button className="absolute top-3 right-3 text-red-600 text-xl" onClick={() => setData(p => ({ ...p, benefits: p.benefits.filter((_, idx) => idx !== i) }))} >×</button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Title" value={b.title} onChange={e => { const t = [...data.benefits]; t[i].title = e.target.value; setData(p => ({ ...p, benefits: t })); }} />
                    <Input label="Description" value={b.desc} onChange={e => { const t = [...data.benefits]; t[i].desc = e.target.value; setData(p => ({ ...p, benefits: t })); }} />
                   </div>
                </div>
              ))}
              <button type="button" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => setData(p => ({ ...p, benefits: [...p.benefits, { title: "", desc: "", icon: "", bg: "", iconBg: "", iconColor: "" }] }))} >+ Add Benefit</button>
            </Card> */}
          </div>
        )}

        {/* READY MADE */}

        {isReadyMade && (
          <div className="space-y-8">

            <Card title="Property Details">
              <Grid>
                <Input type="number" label="Bedrooms" name="beds" value={data.beds} onChange={onChange} min="0" required />
                <Input type="number" label="Bathrooms" name="baths" value={data.baths} onChange={onChange} min="0" required />
                <Input type="text" label="Area" name="area" value={data.area} onChange={onChange} required />
                <Input type="text" label="Listed" name="listed" value={data.listed} onChange={onChange} required />
              </Grid>
            </Card>

            <Card title="Rental & Occupancy">
              <TwoGrid>
                <Select label="Occupancy" name="occupancy" value={data.occupancy} options={["Occupied", "Vacant"]} onChange={onChange} />
                <div>
                  <label className="text-sm text-gray-700">Lease End Date</label>
                  <input type="date" name="leaseEnd" value={data.leaseEnd} onChange={onChange} className="w-full mt-1 border px-3 py-2 rounded" />
                </div>
                <Input type="number" label="Maintenance Cost" name="maintenanceCost" value={data.maintenanceCost} onChange={onChange} placeholder="Monthly cost" />
              </TwoGrid>
            </Card>

            <Card title="Share & Tags">
              <Grid>
                <Input type="number" label="Share to Buy" name="sharetobuy" value={data.sharetobuy} onChange={onChange} min="1" />
                <Input label="Deal Tag" name="deal" value={data.deal} onChange={onChange} placeholder="🔥 Hot Deal" />
                <Input label="Rate" name="rate" value={data.rate} onChange={onChange} placeholder="+8.3% 24h" />
                <Input label="Progress" name="progress" value={data.progress} onChange={onChange} placeholder="153 / 300 slots" />
                <Select label="Transferable" name="transferable" value={data.transferable} options={["Yes", "No"]} onChange={onChange} />
              </Grid>
            </Card>

            <Card title="Token & Slot Details">
              <Grid>
                <Input type="number" label="Property Value" name="propertyValue" value={data.propertyValue} onChange={onChange} />
                <Input type="number" label="Token Price" name="tokenPrice" value={data.tokenPrice} onChange={onChange} />
                <Input type="number" label="Min Investment" name="minInvestment" value={data.minInvestment} onChange={onChange} />
                <Input type="number" label="Available Tokens" name="availableTokens" value={data.availableTokens} onChange={onChange} />
                {/* <Input type="number" label="Total Slots" name="totalSlots" value={data.totalSlots} onChange={onChange} /> */}
                <Input type="number" label="Tokens per Slot" name="tokensPerSlot" value={data.tokensPerSlot} onChange={onChange} />
                <Input type="number" label="Price per Slot" name="pricePerSlot" value={data.pricePerSlot} onChange={onChange} />
                <Input type="number" label="Token Value" name="tokenValue" value={data.tokenValue} onChange={onChange} />
              </Grid>
            </Card>

            <Card title="Partner">
              <TwoGrid>
                <Input label="Partner Name" value={data.partner.name} onChange={(e) => setData(p => ({ ...p, partner: { ...p.partner, name: e.target.value } }))} placeholder="Landshare" />
                <Select label="Verified" value={data.partner.verified ? "Yes" : "No"} onChange={(e) => setData(p => ({ ...p, partner: { ...p.partner, verified: e.target.value === "Yes" } }))} options={["Yes", "No"]} />
              </TwoGrid>
            </Card>

            <Card title="Calculator Defaults">
              <Grid>
                <Input label="Default Investment" name="defaultInvestment" value={data.defaultInvestment} onChange={onChange} placeholder="1" />
                <Input label="Monthly Income %" name="monthlyIncome" value={data.monthlyIncome} onChange={onChange} placeholder="0.12" />
                <Input label="Annual Income %" name="annualIncome" value={data.annualIncome} onChange={onChange} placeholder="1.45" />
              </Grid>
            </Card>

            {/* <Card title="Overview">
              <Textarea label="About the Property" value={data.overview.about} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, about: e.target.value } }))} rows={6} placeholder="Detailed description..." />
            </Card> */}

            <Card title="Blockchain Information">
              <TwoGrid>
                <Input label="Network" value={data.overview.blockchain.network} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, network: e.target.value } } }))} placeholder="Ethereum Mainnet" />
                <Input label="Smart Contract" value={data.overview.blockchain.smartContract} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, smartContract: e.target.value } } }))} placeholder="0x..." />
                <Input label="Total Supply" value={data.overview.blockchain.totalSupply} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, totalSupply: e.target.value } } }))} placeholder="300000" />
                <Select label="Transferable" value={data.overview.blockchain.transferable} onChange={(e) => setData(p => ({ ...p, overview: { ...p.overview, blockchain: { ...p.overview.blockchain, transferable: e.target.value } } }))} options={["Yes", "No"]} />
              </TwoGrid>
            </Card>
{/* 
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
                    }}>×</button>
                  </div>
                ))}
                <button type="button" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setData(p => ({
                  ...p,
                  overview: { ...p.overview, amenities: [...p.overview.amenities, ""] }
                }))}>
                  + Add Amenity
                </button>
              </div>
            </Card> */}

            {/* <Card title="Marketplace Listings">
              {data.marketplace.listings.map((listing, idx) => (
                <div key={idx} className="border rounded p-4 mb-4 bg-gray-50 relative">
                  <button className="absolute top-2 right-2 text-red-600 text-xl" onClick={() => {
                    const updated = data.marketplace.listings.filter((_, i) => i !== idx);
                    setData(p => ({ ...p, marketplace: { ...p.marketplace, listings: updated } }));
                  }}>×</button>
                  <Grid>
                    <Input label="Seller" value={listing.seller} onChange={(e) => {
                      const updated = [...data.marketplace.listings];
                      updated[idx].seller = e.target.value;
                      setData(p => ({ ...p, marketplace: { ...p.marketplace, listings: updated } }));
                    }} placeholder="0xSellerAddress" />
                    <Input type="number" label="Tokens" value={listing.tokens} onChange={(e) => {
                      const updated = [...data.marketplace.listings];
                      updated[idx].tokens = Number(e.target.value);
                      setData(p => ({ ...p, marketplace: { ...p.marketplace, listings: updated } }));
                    }} />
                    <Input type="number" label="Price" value={listing.price} onChange={(e) => {
                      const updated = [...data.marketplace.listings];
                      updated[idx].price = Number(e.target.value);
                      setData(p => ({ ...p, marketplace: { ...p.marketplace, listings: updated } }));
                    }} />
                  </Grid>
                </div>
              ))}
              <button type="button" className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setData(p => ({
                ...p,
                marketplace: { ...p.marketplace, listings: [...p.marketplace.listings, { seller: "", tokens: "", price: "" }] }
              }))}>
                + Add Listing
              </button>
            </Card> */}

            <Card title="Financial Metrics">
              <Grid>
                <Input type="number" label="Annual Yield (%)" value={data.financials.metrics.annualYield} onChange={(e) => setData(p => ({
                  ...p,
                  financials: { ...p.financials, metrics: { ...p.financials.metrics, annualYield: e.target.value } }
                }))} placeholder="12.0" />
                <Input type="number" label="Rental Income (%)" value={data.financials.metrics.rentalIncome} onChange={(e) => setData(p => ({
                  ...p,
                  financials: { ...p.financials, metrics: { ...p.financials.metrics, rentalIncome: e.target.value } }
                }))} placeholder="1.1" />
                <Input type="number" label="Value Growth (%)" value={data.financials.metrics.valueGrowth} onChange={(e) => setData(p => ({
                  ...p,
                  financials: { ...p.financials, metrics: { ...p.financials.metrics, valueGrowth: e.target.value } }
                }))} placeholder="2.0" />
              </Grid>
            </Card>

            <Card title="Financial Breakdown">
              {data.financials.breakdown.map((item, idx) => (
                <div key={idx} className="border rounded p-4 mb-4 bg-gray-50 relative">
                  <button className="absolute top-2 right-2 text-red-600 text-xl" onClick={() => {
                    const updated = data.financials.breakdown.filter((_, i) => i !== idx);
                    setData(p => ({ ...p, financials: { ...p.financials, breakdown: updated } }));
                  }}>×</button>
                  <Grid>
                    <Input label="Label" value={item.label} onChange={(e) => {
                      const updated = [...data.financials.breakdown];
                      updated[idx].label = e.target.value;
                      setData(p => ({ ...p, financials: { ...p.financials, breakdown: updated } }));
                    }} placeholder="APR Rating" />
                    <Input type="number" label="Value" value={item.value} onChange={(e) => {
                      const updated = [...data.financials.breakdown];
                      updated[idx].value = Number(e.target.value);
                      setData(p => ({ ...p, financials: { ...p.financials, breakdown: updated } }));
                    }} />
                    <Input type="number" label="Max" value={item.max} onChange={(e) => {
                      const updated = [...data.financials.breakdown];
                      updated[idx].max = Number(e.target.value);
                      setData(p => ({ ...p, financials: { ...p.financials, breakdown: updated } }));
                    }} placeholder="50" />
                  </Grid>
                </div>
              ))}
              <button type="button" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => setData(p => ({
                ...p,
                financials: { ...p.financials, breakdown: [...p.financials.breakdown, { label: "", value: 0, max: 100 }] }
              }))}>
                + Add Breakdown Item
              </button>
            </Card>

          </div>
        )}
        {/* {isReadyMade && (
          <>
            <Card title="Rental Details">
              <TwoGrid>
                <Select label="Occupancy" name="occupancy" value={data.occupancy} options={["Occupied", "Vacant"]} onChange={onChange} />
                <div>
                  <label className="text-sm text-gray-700">Lease End Date</label>
                  <input
                    type="date"
                    name="leaseEnd"
                    value={data.leaseEnd}
                    onChange={onChange}
                    className="w-full mt-1 border px-3 py-2 rounded"
                  />
                </div>
                <Input type="number" label="Maintenance Cost" name="maintenanceCost" value={data.maintenanceCost} onChange={onChange} />
              </TwoGrid>
            </Card>

            <Card title="Additional Info">
              <TwoGrid>
                <Input label="Chain" name="chain" value={data.chain} onChange={onChange} />
                <Input type="number" label="Display Value" name="value" value={data.value} onChange={onChange} />
              </TwoGrid>
            </Card>
          </>
        )} */}

        {/* COMMON RETURNS & RISK */}
        <Card title="Returns & Risk">
          <Grid>
            <Input type="number" label="APR Min" name="apr_min" value={data.apr_min} onChange={onChange} min="0" />
            <Input type="number" label="APR Max" name="apr_max" value={data.apr_max} onChange={onChange} min="0" />
            <Input type="number" label="Rental %" name="rental_percentage" value={data.rental_percentage} onChange={onChange} min="0" />
            <Select label="Risk Level" name="risk_level" value={data.risk_level} options={["Low", "Medium", "High"]} onChange={onChange} />
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