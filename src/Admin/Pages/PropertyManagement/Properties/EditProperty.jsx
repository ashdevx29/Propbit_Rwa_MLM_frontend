import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminApi } from "../../../Service/adminApi";
import { appConfig } from "../../../../config/appConfig";

const PINATA_JWT = appConfig.PINATA_JWT;

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= EMPTY STATE (SAME AS ADD) ================= */
  const getEmptyState = () => ({
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

    total_value_usd: "",
    // total_units: "",
    // available_units: "",
    //add akshay , sqft

    parkingSpaces: "",

    totalSqft: "",
    pricePerSqft: "",

    apr_min: "",
    apr_max: "",
    rental_percentage: "",
    risk_level: "Low",

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

    team: [],
    amenities: [],
    milestones: [],
    calculator: { minInvestment: "", expectedReturn: "", lockIn: "" },
    keyFeatures: [],
    benefits: [],

    occupancy: "",
    leaseEnd: "",
    maintenanceCost: "",

    sharetobuy: 1,
    stats: { beds: "", baths: "", area: "", listed: "" },
    deal: "",
    rate: "",
    progress: "",
    partner: { name: "", verified: false },
    defaultInvestment: "",
    monthlyIncome: "",
    annualIncome: "",
    minInvestment: "",
    availableTokens: "",
    totalSlots: "",
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
      metrics: { annualYield: "", rentalIncome: "", valueGrowth: "" },
      breakdown: [],
    },

    marketplace: { listings: [] },
  });

  const [data, setData] = useState(getEmptyState());

  /* ================= FETCH PROPERTY ================= */
  const { data: propertyRes } = useQuery({
    queryKey: ["property", id],
    queryFn: () => adminApi.getPropertyById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!propertyRes) return;

    console.log("API RESPONSE ðŸ‘‰", propertyRes);

    // auto detect where property is
    const p =
      propertyRes?.data?.data ||
      propertyRes?.data?.property ||
      propertyRes?.data ||
      propertyRes;

    if (!p) return;

    console.log("FINAL PROPERTY ðŸ‘‰", p);

    const empty = getEmptyState();

    setData({
      ...empty,
      ...p,

      started: p.started ? p.started.split("T")[0] : "",
      expectedCompletion: p.expectedCompletion
        ? p.expectedCompletion.split("T")[0]
        : "",
      leaseEnd: p.leaseEnd ? p.leaseEnd.split("T")[0] : "",

      amenities: p.amenities?.length
        ? p.amenities
        : p.overview?.amenities || [],

      // ðŸ”¥ðŸ”¥ðŸ”¥ MAIN CHANGE
      team: p.team || p.tabs?.overview?.team || [],
      milestones: p.milestones || p.tabs?.milestones || [],
      keyFeatures: p.keyFeatures || [],
      benefits: p.benefits || [],
parkingSpaces: p.parkingSpaces || [],
      financials: {
        metrics: {
          annualYield:
            p.financials?.metrics?.annualYield || p.annualYield || "",
          rentalIncome:
            p.financials?.metrics?.rentalIncome || p.rentalIncome || "",
          valueGrowth:
            p.financials?.metrics?.valueGrowth || p.valueGrowth || "",
        },
        breakdown:
          p.financials?.breakdown || p.breakdown || p.score_breakdown || [],
      },
      pricePerSlot: p.pricePerSlot || p.price_per_slot || p.slot_price || "",
      tokensPerSlot: p.tokensPerSlot || p.tokens_per_slot || "",
      tokenValue: p.tokenValue || p.token_value || p.current_token_price || "",
      totalSlots: p.totalSlots || p.total_slots || p.max_slots || "",
      availableSlots:
        p.availableSlots || p.available_slots || p.remaining_slots || "",

      calculator: {
        minInvestment:
          p.calculator?.minInvestment ||
          p.tabs?.calculator?.minInvestment ||
          "",

        expectedReturn:
          p.calculator?.expectedReturn ||
          p.tabs?.calculator?.expectedReturn ||
          "",

        lockIn: p.calculator?.lockIn || p.tabs?.calculator?.lockIn || "",
      },

      images:
        p.images?.map((url) => ({
          name: url.split("/").pop(),
          preview: url,
          existing: true,
        })) || [],

      documents:
        p.documents?.map((d) => ({
          name: d.name,
          type: d.type,
          link: d.link,
          existing: true,
        })) || [],
    });
  }, [propertyRes]);

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
  /* ================= HELPERS ================= */
  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  /* ================= FILE ================= */
  const onFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      name: file.name,
      preview: type === "images" ? URL.createObjectURL(file) : null,
      file,
      existing: false,
    }));

    setData((prev) => ({
      ...prev,
      [type]: [...prev[type], ...mapped],
    }));
  };

  const removeMedia = (type, index) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  /* ================= PINATA ================= */
  const uploadToPinata = async (file, isDoc = false) => {
    if (file.existing) return isDoc ? file : file.preview;

    const formData = new FormData();
    formData.append("file", file.file);

    const res = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
      body: formData,
    });

    const json = await res.json();
    const url = `https://gateway.pinata.cloud/ipfs/${json.data.cid}`;

    return isDoc ? { name: file.name, type: "PDF", link: url } : url;
  };

  /* ================= UPDATE ================= */
  const mutation = useMutation({
    mutationFn: (payload) => adminApi.updateProperty(id, payload),
    onSuccess: () => {
      toast.success("Property Updated");
      navigate("/admin/property-management/add-property-plan");
    },
  });

  const handleUpdate = async () => {
    const images = await Promise.all(
      data.images.map((img) => uploadToPinata(img)),
    );

    const documents = await Promise.all(
      data.documents.map((d) => uploadToPinata(d, true)),
    );

    mutation.mutate({
      ...data,
      images,
      documents,
    });
  };

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const onTitleChange = (e) => {
    const title = e.target.value;
    setData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  /* ================= CATEGORY ================= */
  const isTokenized = data.category === "ONE_TIME_BUY";
  const isUnderConstruction = data.category === "FRACTIONAL_BUY";
  const isReadyMade = data.category === "PER_SQFT_INVETMENT";

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      <div className="max-w-8xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Edit Property</h1>

        {/* BASIC INFO */}
        <Card title="Basic Info">
          <TwoGrid>
            <Input
              label="Title"
              name="title"
              value={data.title}
              onChange={onChange}
              required
            />
            <Input label="Slug" name="slug" value={data.slug} readOnly />
            <Select
              label="Category"
              name="category"
              value={data.category}
              // options={["TOKENIZED", "UNDER_CONSTRUCTION", "READY_MADE"]}
              options={["ONE_TIME_BUY", "FRACTIONAL_BUY", "PER_SQFT_INVETMENT"]}
              onChange={onChange}
              required
            />
            <Input
              label="Location"
              name="location"
              value={data.location}
              onChange={onChange}
              required
            />
            <Select
              label="Status"
              name="status"
              value={data.status}
              options={["AVAILABLE", "SOLD_OUT", "COMING_SOON"]}
              onChange={onChange}
            />
            <Select
              label="Construction Stage"
              name="construction_stage"
              value={data.construction_stage}
              options={["Completed", "Ongoing", "Planning"]}
              onChange={onChange}
            />
          </TwoGrid>
        </Card>

        {/* DESCRIPTION */}
        <Card title="Description">
          <Textarea
            name="description"
            value={data.description}
            onChange={onChange}
          />
        </Card>

        {/* MEDIA */}
        <Card title="Media">
          <TwoGrid>
            <Upload
              label="Images"
              multiple
              accept="image/*"
              onChange={(e) => onFileChange(e, "images")}
            />
            <Upload
              label="Documents"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFileChange(e, "documents")}
            />
          </TwoGrid>

          {data.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {data.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.preview}
                    className="h-24 w-full object-cover rounded border"
                    alt={img.name}
                  />
                  <button
                    onClick={() => removeMedia("images", i)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                  >
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
                  ðŸ“„ {d.name}{" "}
                  {d.link && (
                    <a href={d.link} target="_blank" rel="noopener noreferrer">
                      (View)
                    </a>
                  )}
                  <button
                    onClick={() => removeMedia("documents", i)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Key Features">
          {data.keyFeatures.map((f, i) => (
            <div
              key={i}
              className="border rounded p-5 mb-5 bg-gray-50 relative"
            >
              <button
                className="absolute top-3 right-3 text-red-600 text-xl"
                onClick={() =>
                  setData((p) => ({
                    ...p,
                    keyFeatures: p.keyFeatures.filter((_, idx) => idx !== i),
                  }))
                }
              >
                Ã—
              </button>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={f.title}
                  onChange={(e) => {
                    const t = [...data.keyFeatures];
                    t[i].title = e.target.value;
                    setData((p) => ({ ...p, keyFeatures: t }));
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() =>
              setData((p) => ({
                ...p,
                keyFeatures: [
                  ...p.keyFeatures,
                  {
                    title: "",
                    desc: "",
                    icon: "",
                    bg: "",
                    color: "",
                    monincome: "",
                  },
                ],
              }))
            }
          >
            + Add Key Feature
          </button>
        </Card>

        <Card title="Amenities">
          <div className="space-y-3">
            {data.overview.amenities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  value={item}
                  onChange={(e) => {
                    const updated = [...data.overview.amenities];
                    updated[idx] = e.target.value;
                    setData((p) => ({
                      ...p,
                      overview: { ...p.overview, amenities: updated },
                    }));
                  }}
                  placeholder="e.g. Air Conditioning"
                />
                <button
                  className="text-red-600 hover:text-red-800 text-xl"
                  onClick={() => {
                    const updated = data.overview.amenities.filter(
                      (_, i) => i !== idx,
                    );
                    setData((p) => ({
                      ...p,
                      overview: { ...p.overview, amenities: updated },
                    }));
                  }}
                >
                  Ã—
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() =>
                setData((p) => ({
                  ...p,
                  overview: {
                    ...p.overview,
                    amenities: [...p.overview.amenities, ""],
                  },
                }))
              }
            >
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
        {isTokenized && (
          <>
            {/* <Card title="Basic Financial Info (Required for All Categories)">
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
                />
              </Grid>
            </Card> */}
          </>
        )}

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

            {/* â”€â”€â”€ Token / Slot Details â”€â”€â”€ */}
            {/* <Card title="Token & Slot Configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  type="number"
                  label="Price per Slot (INR)"
                  value={data.pricePerSlot}
                  onChange={onChange}
                  name="pricePerSlot"
                  placeholder="5000"
                />
                <Input
                  type="number"
                  label="Total Value (INR)"
                  name="total_value_usd"
                  value={data.total_value_usd}
                  onChange={onChange}
                  min="0"
                  placeholder="Required"
                />
                <Input
                  type="number"
                  label="Total Slots"
                  value={data.totalSlots}
                  onChange={onChange}
                  name="totalSlots"
                  placeholder="2000"
                />
              </div>
            </Card> */}
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
                />
              </Grid>
            </Card>
          </div>
        )} */}

        {/* COMMON RETURNS & RISK */}
        <Card title="Parking Spaces">
          <Grid>
            <Input
              type="number"
              label="APR Min"
              name="apr_min"
              value={data.apr_min}
              onChange={onChange}
              min="0"
            />
            <Input
              type="number"
              label="APR Max"
              name="apr_max"
              value={data.apr_max}
              onChange={onChange}
              min="0"
            />
            <Input
              type="number"
              label="Rental %"
              name="rental_percentage"
              value={data.rental_percentage}
              onChange={onChange}
              min="0"
            />
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

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-8 py-3 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-white rounded"
          >
            Update Property
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {children}
  </div>
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
