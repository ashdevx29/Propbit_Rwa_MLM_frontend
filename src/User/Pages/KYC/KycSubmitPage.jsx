import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { appConfig } from "../../../config/appConfig";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const PINATA_JWT = appConfig.PINATA_JWT;

const KycSubmitPage = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    firstNameAsPerID: "",
    lastNameAsPerID: "",
    DateOfBirth: "",
    Address: "",
    governmentIdType: "",
    governmentIdNumber: "",
  });

  const [files, setFiles] = useState({
    governmentIdFront: null,
    governmentIdBack: null,
    signatureImage: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    governmentIdFront: null,
    governmentIdBack: null,
    signatureImage: null,
  });

  // Pinata V3 Upload Helper (Client-side)
  const uploadToPinata = async (file, isDocument = false) => {
    try {
      const formDataPinata = new FormData();
      formDataPinata.append("file", file);
      formDataPinata.append("name", file.name);
      formDataPinata.append("network", "public");

      const res = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formDataPinata,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);

      const json = await res.json();
      const cid = json.data.cid;
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

      return isDocument
        ? {
            name: file.name,
            type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOC",
            link: url,
          }
        : url;
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }
  };

  // File Validation + Preview
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

    if (file.size > MAX_SIZE) {
      toast.error("File size must not exceed 10 MB");
      e.target.value = "";
      return;
    }

    let allowedTypes = [];
    if (type === "governmentIdFront" || type === "governmentIdBack") {
      allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
    } else if (type === "signatureImage") {
      allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Only ${type.includes("signature") ? "JPG, PNG" : "JPG, PNG, PDF"} files allowed`,
      );
      e.target.value = "";
      return;
    }

    setFiles((prev) => ({ ...prev, [type]: file }));
    const reader = new FileReader();
    reader.onload = () =>
      setPreviewUrls((prev) => ({ ...prev, [type]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchMyKYC();
  }, []);

  const fetchMyKYC = async () => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      const res = await axios.get(`${appConfig.baseURL}/user/get-kyc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKycData(res.data.data?.kyc || null);
    } catch (error) {
      console.error("Failed to fetch KYC", error);
      setKycData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitKYC = async () => {
    if (
      !formData.firstNameAsPerID ||
      !formData.lastNameAsPerID ||
      !formData.DateOfBirth ||
      !formData.governmentIdNumber ||
      !formData.governmentIdType
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!files.governmentIdFront || !files.signatureImage) {
      toast.error("Government ID Front and Signature Image are required");
      return;
    }

    setSubmitting(true);

    try {
      const uploadFront = files.governmentIdFront
        ? uploadToPinata(files.governmentIdFront)
        : Promise.resolve(null);

      const uploadBack = files.governmentIdBack
        ? uploadToPinata(files.governmentIdBack)
        : Promise.resolve(null);

      const uploadSig = files.signatureImage
        ? uploadToPinata(files.signatureImage)
        : Promise.resolve(null);

      const [frontUrl, backUrl, sigUrl] = await Promise.all([
        uploadFront,
        uploadBack,
        uploadSig,
      ]);

      if (
        (files.governmentIdFront && !frontUrl) ||
        (files.signatureImage && !sigUrl)
      ) {
        return;
      }

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const payload = {
        firstNameAsPerID: formData.firstNameAsPerID,
        lastNameAsPerID: formData.lastNameAsPerID,
        DateOfBirth: formData.DateOfBirth,
        Address: formData.Address,
        governmentIdType: formData.governmentIdType,
        governmentIdNumber: formData.governmentIdNumber,
        governmentIdFront: frontUrl,
        governmentIdBack: backUrl,
        signatureImage: sigUrl,
      };

      const res = await axios.post(
        `${appConfig.baseURL}/user/submit-kyc`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("KYC submitted successfully! Waiting for admin approval.");
      fetchMyKYC();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit KYC");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-8 text-center text-lg">Loading KYC status...</div>;

  if (kycData && kycData.status !== "rejected") {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#101828]">KYC Status</h2>
        <div className="bg-white rounded-2xl shadow p-8 max-w-2xl mx-auto text-center">
          {kycData.status === "approved" ? (
            <FaCheckCircle className="text-[#0082ED] text-8xl mx-auto mb-4" />
          ) : (
            <FaSpinner className="text-yellow-500 text-8xl mx-auto mb-4 animate-spin" />
          )}
          <h3 className="text-2xl font-semibold text-gray-800">
            {kycData.status === "approved"
              ? "✅ KYC Approved"
              : "⏳ KYC Under Review"}
          </h3>
          <p className="text-gray-600 mt-2">
            {kycData.status === "approved"
              ? "Your KYC has been successfully verified by admin."
              : "Your KYC is under review. You will be notified once approved."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[1260px] mx-auto">
      <h2 className="text-3xl mb-6 text-[#0F172A] droxen-font">
        {kycData?.status === "rejected" ? "Re-Submit KYC" : "Submit KYC"}
      </h2>

      <div className="bg-white rounded-2xl shadow p-8 max-w-2xl mx-auto">
        <h3 className="text-xl gued-font mb-6 text-[#0F172A]">
          Personal & Government ID Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              First Name (as per ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstNameAsPerID"
              value={formData.firstNameAsPerID}
              onChange={handleChange}
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Last Name (as per ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastNameAsPerID"
              value={formData.lastNameAsPerID}
              onChange={handleChange}
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleChange}
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Full Address (as per ID)
            </label>
            <textarea
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              rows="3"
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3"
              placeholder="Enter full address as per ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Government ID Type <span className="text-red-500">*</span>
            </label>
            <select
              name="governmentIdType"
              value={formData.governmentIdType}
              onChange={handleChange}
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3"
            >
              <option value="">Select ID Type</option>
              <option value="Government_ID">Government ID</option>
              <option value="Passport">Passport</option>
              <option value="DrivingLicense">Driving License</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Government ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="governmentIdNumber"
              value={formData.governmentIdNumber}
              onChange={handleChange}
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3"
              placeholder="Enter ID number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Upload Government ID Front <span className="text-red-500">*</span>{" "}
              (JPG, PNG, PDF • Max 10 MB)
            </label>

            {/* Hidden actual input */}
            <input
              type="file"
              id="governmentIdFront"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, "governmentIdFront")}
              className="hidden"
            />

            {/* Same UI label acting as input */}
            <label
              htmlFor="governmentIdFront"
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3
  flex items-center cursor-pointer overflow-hidden"
            >
              <span
                className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]
    text-black px-4 py-2 rounded mr-4 hover:bg-[#3bcf84] opacity-90
    whitespace-nowrap flex-shrink-0"
              >
                Upload File
              </span>

              <span className="text-[#334155] text-sm truncate">
                No file chosen
              </span>
            </label>

            {previewUrls.governmentIdFront && (
              <img
                src={previewUrls.governmentIdFront}
                alt="ID Front"
                className="mt-3 max-h-48 rounded border"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Upload Government ID Back (Optional)(JPG, PNG, PDF • Max 10 MB)
            </label>

            {/* Hidden actual input */}
            <input
              type="file"
              accept="image/*,.pdf"
              id="governmentIdBack"
              onChange={(e) => handleFileChange(e, "governmentIdBack")}
              className="hidden"
            />

            {/* Same UI label acting as input */}
            <label
              htmlFor="governmentIdBack"
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3
  flex items-center cursor-pointer overflow-hidden"
            >
              <span
                className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]
    text-black px-4 py-2 rounded mr-4 hover:bg-[#3bcf84] opacity-90
    whitespace-nowrap flex-shrink-0"
              >
                Upload File
              </span>

              <span className="text-[#334155] text-sm truncate">
                No file chosen
              </span>
            </label>
            {previewUrls.governmentIdBack && (
              <img
                src={previewUrls.governmentIdBack}
                alt="ID Back"
                className="mt-3 max-h-48 rounded border"
              />
            )}
          </div>

          {/* Signature Upload with Note */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#334155] mb-1">
              Upload Signature Image <span className="text-red-500 ">*</span>{" "}
              (JPG, PNG • Max 10 MB)
            </label>

            <input
              type="file"
              className="hidden"
              id="signatureImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "signatureImage")}
            />
            {/* Same UI label acting as input */}
            <label
              htmlFor="signatureImage"
              className="w-full border text-[#334155] border-gray-400 rounded px-4 py-3
  flex items-center cursor-pointer overflow-hidden"
            >
              <span
                className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]
    text-black px-4 py-2 rounded mr-4 hover:bg-[#3bcf84] opacity-90
    whitespace-nowrap flex-shrink-0"
              >
                Upload File
              </span>

              <span className="text-[#334155] text-sm truncate">
                No file chosen
              </span>
            </label>
            {previewUrls.signatureImage && (
              <img
                src={previewUrls.signatureImage}
                alt="Signature Preview"
                className="mt-3 max-h-48 rounded border"
              />
            )}

            {/* Added Note */}
            <p className="text-xs text-[#334155] mt-2 gued-font">
              Please upload signature to remove background or clear background
              from signature image for better verification.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmitKYC}
          disabled={submitting}
          className="w-full mt-10 droxen-font bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:opacity-90 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting ? <FaSpinner className="animate-spin" /> : "Submit KYC"}
        </button>
      </div>
    </div>
  );
};

export default KycSubmitPage;
