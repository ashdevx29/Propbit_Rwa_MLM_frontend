import { useEffect, useState } from "react";
import { submitQuery } from "../../Service/investmentApi";
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

export default function ContactFormModal({ property, onClose }) {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    mobileNumber: "",
    address: "",
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    const nextPreview = URL.createObjectURL(file);
    setFileName(file.name);
    setPreview(nextPreview);
    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const propertyTitle = property?.title || property?.name || "Property";
  const totalValuation = toNumber(property?.totalValuation);
  const pricePerSqft =
    toNumber(property?.pricePerSqft) || toNumber(property?.pricing?.pricePerSqft);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const propertyId = property?.backendId || property?.propertyId;

    if (!propertyId) {
      toast.error("Query submission failed: invalid property details.");
      return;
    }

    const payload = new FormData();
    payload.append("propertyId", propertyId);
    payload.append("propertyName", propertyTitle);
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("email", formData.email);
    payload.append("mobile", formData.mobile);
    payload.append("address", formData.address);

    if (selectedFile) {
      payload.append("profileImage", selectedFile);
    }

    try {
      setSubmitting(true);
      const response = await submitQuery(payload);
      toast.success(
        response?.data?.message ||
          "Query sent successfully. Our team will contact you soon."
      );
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        getFailureReason(
          err,
          "Unable to send query right now. Please try again later."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center z-50 p-3 sm:p-4 dmfont">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="dmfont mb-4">
          <h2 className="text-xl sm:text-2xl font-normal text-black">
            Contact Form - {propertyTitle}
          </h2>
          <p className="text-[14px] text-[#4B5563] mt-1">
            Send enquiry for property purchase
          </p>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-4 mb-6">
          <p className="text-[12px] text-[#64748B] mb-3">PROPERTY DETAILS</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-[#64748B]">Property Name</p>
              <p className="text-[14px] font-bold text-gray-800 mb-4">{propertyTitle}</p>

              <p className="text-[12px] text-[#64748B]">Total Valuation</p>
              <p className="text-[14px] font-bold text-gray-800">
                {formatCurrency(totalValuation)}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-[#64748B]">ID</p>
              <p className="text-[14px] font-bold text-gray-800 mb-4">
                #{property?.id ?? "N/A"}
              </p>

              <p className="text-[12px] text-[#64748B]">Per Sqft Price</p>
              <p className="text-[14px] font-bold text-gray-800">
                {formatCurrency(pricePerSqft)}
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] text-[#0F172A]">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:ring-2 focus:ring-[#4BDD96] outline-none"
              />
            </div>

            <div>
              <label className="text-[14px] text-[#0F172A]">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:ring-2 focus:ring-[#4BDD96] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[14px] text-[#0F172A]">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:ring-2 focus:ring-[#4BDD96] outline-none"
            />
          </div>

          <div>
            <label className="text-[14px] text-[#0F172A]">Mobile Number *</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:ring-2 focus:ring-[#4BDD96] outline-none"
            />
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#0F172A]">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your complete address"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black h-28 resize-none focus:ring-2 focus:ring-[#4BDD96] outline-none"
            />
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#0F172A]">
              Profile Image (Optional)
            </label>

            <input
              type="file"
              accept="image/*"
              id="uploadImage"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="uploadImage"
              className="mt-1 border border-gray-300 rounded-xl py-3 text-center text-gray-500 cursor-pointer hover:bg-gray-50 block"
            >
              {fileName || "Upload Image"}
            </label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-24 h-24 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-full py-3 text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-gray-900 rounded-full py-3 hover:bg-[#3aad75]"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
