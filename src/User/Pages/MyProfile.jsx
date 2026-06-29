import { useState, useEffect } from "react";
import { MdOutlineMail } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { FiPhone } from "react-icons/fi";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaKey, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { LuBuilding2 } from "react-icons/lu";
import { LuWallet } from "react-icons/lu";
import { toast } from "react-toastify";
import axios from "axios";
import { appConfig } from "../../config/appConfig";
import Footer from "../Components/Comman/Footer";
import QRCode from "react-qr-code";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "Georgia",
    address: "",
    walletAddress: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password states
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Wallet states
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [updatingWallet, setUpdatingWallet] = useState(false);
  const [copied, setCopied] = useState(false);

  // ==================== GOOGLE 2FA STATES ====================
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [generating2FA, setGenerating2FA] = useState(false);
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [disabling2FA, setDisabling2FA] = useState(false);
  // ===========================================================

  // Fetch Profile + KYC + 2FA Status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        // Profile
        const profileRes = await axios.get(
          `${appConfig.baseURL}/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const p = profileRes.data.data?.profile || {};

        setFormData({
          firstName: p.first_name || "",
          lastName: p.last_name || "",
          email: p.email || "",
          phone: p.mobile_number || "",
          dob: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
          nationality: p.country || "Georgia",
          address: p.address || "",
          walletAddress: p.walletAddress || "",
        });

        // KYC
        const kycRes = await axios.get(`${appConfig.baseURL}/user/get-kyc`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const kyc = kycRes.data.data?.kyc || {};
        setKycStatus(kyc.status || p.kycStatus || null);

        // 2FA Status
        const twoFaRes = await axios.get(
          `${appConfig.baseURL}/user/2fa/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTwoFactorEnabled(twoFaRes.data?.data?.enabled || false);
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errorObj = {};
    if (!formData.email.trim()) errorObj.email = "Email is required";
    // if (!formData.walletAddress.trim())
    //   errorObj.walletAddress = "Wallet Address is required";

    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      Object.values(errorObj).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      setLoading(true);
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      await axios.put(
        `${appConfig.baseURL}/user/profile/update-user-password`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          address: formData.address,
          // walletAddress: formData.walletAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;
    const errorObj = {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      errorObj.password = "All fields are required";
    } else if (newPassword !== confirmPassword) {
      errorObj.password = "Passwords don't match";
    } else if (newPassword.length < 6) {
      errorObj.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      toast.error(errorObj.password);
      return;
    }

    try {
      setLoading(true);
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      await axios.put(
        `${appConfig.baseURL}/user/profile/update-user-password`,
        {
          currentPassword,
          newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Wallet Functions
  const sendUpdateOtp = async () => {
    setSendingOtp(true);
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      await axios.post(
        `${appConfig.baseURL}/user/wallet/send-update-otp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("OTP sent to your registered email");
      setShowWalletModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // const updateWalletAddress = async () => {
  //   if (!newWalletAddress || !otp) {
  //     toast.error("Wallet address and OTP are required");
  //     return;
  //   }

  //   setUpdatingWallet(true);
  //   try {
  //     const token =
  //       localStorage.getItem("authToken") ||
  //       sessionStorage.getItem("authToken");
  //     await axios.post(
  //       `${appConfig.baseURL}/user/wallet/update-address`,
  //       {
  //         otp,
  //         walletAddress: newWalletAddress,
  //         remark: remark || "Updated via profile",
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );

  //     toast.success("Wallet address updated successfully!");
  //     setFormData((prev) => ({ ...prev, walletAddress: newWalletAddress }));
  //     setShowWalletModal(false);
  //     setNewWalletAddress("");
  //     setOtp("");
  //     setRemark("");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Failed to update wallet");
  //   } finally {
  //     setUpdatingWallet(false);
  //   }
  // };

  // const handleCopy = async () => {
  //   await navigator.clipboard.writeText(formData.walletAddress);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  //   toast.success("Wallet address copied!");
  // };

  // ==================== GOOGLE 2FA FUNCTIONS ====================
  const generate2FA = async () => {
    setGenerating2FA(true);
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      const res = await axios.post(
        `${appConfig.baseURL}/user/2fa/generate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = res.data.data;
      setSecretKey(data.secret);

      const issuer = "URBAN RWA"; // ← CHANGE TO YOUR APP NAME
      const otpauth = `otpauth://totp/${issuer}:${formData.email || "User"}?secret=${data.secret}&issuer=${issuer}`;
      setOtpauthUrl(otpauth);

      setVerifyCode("");
      setShow2FAModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start 2FA setup");
    } finally {
      setGenerating2FA(false);
    }
  };

  const verifyAndEnable2FA = async () => {
    if (verifyCode.length !== 6) {
      toast.error("Please enter the 6-digit code from Google Authenticator");
      return;
    }

    setVerifying2FA(true);
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      await axios.post(
        `${appConfig.baseURL}/user/2fa/verify`,
        { code: verifyCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTwoFactorEnabled(true);
      setShow2FAModal(false);
      setVerifyCode("");
      setOtpauthUrl("");
      setSecretKey("");
      toast.success("✅ Google 2FA enabled successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid code. Please try again.",
      );
    } finally {
      setVerifying2FA(false);
    }
  };

  const openDisableModal = () => setShowDisableModal(true);

  const confirmDisable2FA = async () => {
    if (disableCode.length !== 6) {
      toast.error("Please enter the 6-digit code from Google Authenticator");
      return;
    }

    setDisabling2FA(true);
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      await axios.post(
        `${appConfig.baseURL}/user/2fa/disable`,
        { code: disableCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTwoFactorEnabled(false);
      setShowDisableModal(false);
      setDisableCode("");
      toast.success("Google 2FA has been disabled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setDisabling2FA(false);
    }
  };

  const copySecret = async () => {
    await navigator.clipboard.writeText(secretKey);
    toast.success("Secret key copied!");
  };
  // ===========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8 lg:py-10">
      <h1 className="droxen-font text-2xl sm:text-3xl lg:text-4xl text-black pt-2 sm:pt-4 lg:pt-6 mb-4 sm:mb-6">Settings</h1>
      {/* <div className="theme-card-style border-gradient text-gray-800 p-5 rounded-md min-h-[80vh]"> */}
        {/* Tabs */}
        <div className="flex flex-nowrap items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: "personal", label: "Personal Details" },
            { key: "password", label: "Password Details" },
            { key: "security", label: "Security" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-4 sm:px-6 py-3 text-xs sm:text-sm gued-font whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "text-black border-b-2 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] rounded-t"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===================== PERSONAL DETAILS ===================== */}
        {activeTab === "personal" && (
          <div className="space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_15px_0px_#00000026] overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl gued-font text-gray-900">
                  Personal Information
                </h3>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-black border border-[#D1D5DC] bg-[#DCFCE7] rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-black border border-[#D1D5DC] bg-[#DCFCE7] rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 bg-[#DCFCE7] rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 bg-[#DCFCE7] rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg bg-[#DCFCE7] focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      readOnly
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg bg-[#DCFCE7] cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium gued-font text-[#364153] mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <SlLocationPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 text-black border border-gray-300 rounded-lg bg-[#DCFCE7] focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-end gap-3 border-t">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-2 gued-font border border-gray-300 rounded-lg text-[#364153] hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-500 transition-colors text-black gued-font text-sm rounded"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* KYC Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg gued-font text-gray-900">
                  KYC Verification
                </h3>
                <p className="text-xs sm:text-sm gued-font text-gray-500">
                  Complete your verification to access all features
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-50 text-[#0082ED]">
                        <HiOutlineDocumentText size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm gued-font text-gray-900">
                          Government-Issued ID
                        </h4>
                        <p className="text-sm gued-font text-gray-500">
                          Passport, Driver's License, or National ID
                        </p>
                      </div>
                    </div>

                    {kycStatus === "approved" ? (
                      <span className="inline-flex self-start sm:self-auto items-center gap-1 px-3 py-1 text-sm rounded-full bg-green-50 text-[#0082ED] font-medium gued-font">
                        <FiCheckCircle /> Verified
                      </span>
                    ) : kycStatus === "rejected" ? (
                      <span className="inline-flex self-start sm:self-auto items-center gap-1 px-3 py-1 text-sm rounded-full bg-red-50 text-red-600 font-medium gued-font">
                        <FiAlertCircle /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex self-start sm:self-auto items-center gap-1 px-3 py-1 text-sm rounded-full bg-orange-50 text-orange-600 font-medium gued-font">
                        <FiAlertCircle /> Pending Review
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank & Wallet Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-5 sm:p-8 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-50">
                    <LuBuilding2 className="text-[#0082ED] text-lg" />
                  </div>
                  <h3 className="text-lg gued-font text-gray-900">
                    Bank Details
                  </h3>
                </div>
                <div className="text-center text-gray-500 gued-font py-10">
                  Bank details coming soon...
                </div>
              </div>

              {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-50 text-[#0082ED]">
                    <LuWallet className="text-lg" />
                  </div>
                  <h3 className="text-lg gued-font text-gray-900">
                    Crypto Wallet Address
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={formData.walletAddress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto flex text-black items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                  >
                    <FaCopy /> {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <button
                  onClick={sendUpdateOtp}
                  disabled={
                    sendingOtp ||
                    (formData.walletAddress && formData.walletAddress !== "NA")
                  }
                  className={`mt-6 w-full py-3 text-black rounded-xl font-medium gued-font transition-all ${
                    formData.walletAddress && formData.walletAddress !== "NA"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-500"
                  }`}
                >
                  {formData.walletAddress && formData.walletAddress !== "NA"
                    ? "Wallet Address Already Set"
                    : sendingOtp
                      ? "Sending OTP..."
                      : "Change Wallet Address"}
                </button>
                {formData.walletAddress && (
                  <p className="text-center text-xs gued-font text-gray-500 mt-3">
                    To change wallet address, please contact support
                  </p>
                )}
              </div> */}
            </div>
          </div>
        )}

        {/* ===================== PASSWORD DETAILS ===================== */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="max-w-xl space-y-6">
            {["currentPassword", "newPassword", "confirmPassword"].map(
              (field, idx) => (
                <div className="relative" key={idx}>
                  <label className="text-sm mb-1 flex items-center gap-2 text-[#0082ED]">
                    <FaKey className="text-[#0082ED]" />{" "}
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={
                      showPassword[field.replace("Password", "").toLowerCase()]
                        ? "text"
                        : "password"
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none text-gray-800 pr-10"
                  />
                  <span
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [field.replace("Password", "").toLowerCase()]:
                          !prev[field.replace("Password", "").toLowerCase()],
                      }))
                    }
                    className="absolute right-2 top-7 text-gray-500 cursor-pointer"
                  >
                    {showPassword[
                      field.replace("Password", "").toLowerCase()
                    ] ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </span>
                </div>
              ),
            )}
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-500 transition-colors text-black gued-font text-sm rounded"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* ===================== SECURITY TAB ===================== */}
        {activeTab === "security" && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-green-50">
                  <HiOutlineShieldCheck className="text-[#0082ED] text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl gued-font text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-500">
                    Protect your account with Google Authenticator
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="text-lggued-font">
                    Google Authenticator
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium gued-font mt-2 ${twoFactorEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {twoFactorEnabled ? <>✅ Enabled</> : <>⛔ Disabled</>}
                  </span>
                </div>

                {twoFactorEnabled ? (
                  <button
                    onClick={openDisableModal}
                    disabled={disabling2FA}
                    className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium transition disabled:opacity-70"
                  >
                    {disabling2FA ? "Disabling..." : "Disable 2FA"}
                  </button>
                ) : (
                  <button
                    onClick={generate2FA}
                    disabled={generating2FA}
                    className="w-full md:w-auto px-8 py-3 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-500 transition-colors text-black gued-font rounded-2xl font-medium hover:brightness-105 transition disabled:opacity-70"
                  >
                    {generating2FA
                      ? "Generating QR Code..."
                      : "Enable Google 2FA"}
                  </button>
                )}
              </div>

              {twoFactorEnabled && (
                <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-2xl text-green-800 gued-font text-sm">
                  Your account is now protected with 2FA. You will be asked for
                  a verification code every time you log in.
                </div>
              )}
            </div>
          </div>
        )}
      {/* </div> */}
    </div>  

      {/* ===================== 2FA ENABLE MODAL (Fully Responsive) ===================== */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]  px-4">
          <div className="bg-white rounded-3xl w-full max-w-[380px] sm:max-w-md lg:max-w-lg p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl gued-font text-gray-900">
                Set up Google 2FA
              </h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="text-3xl text-gray-400 hover:text-gray-600 leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="font-medium gued-font text-gray-700 mb-2">
                  1. Install Google Authenticator
                </div>
                <p className="text-sm gued-font text-gray-500">
                  App Store or Google Play Store
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="font-medium gued-font text-gray-700 mb-4">
                  2. Scan this QR Code
                </div>
                <div className="p-5 bg-white border-2 border-dashed border-gray-200 rounded-2xl shadow-inner">
                  <QRCode
                    value={otpauthUrl}
                    size={190}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <div className="font-medium gued-font text-gray-700">
                    3. Or enter key manually
                  </div>
                  <button
                    onClick={copySecret}
                    className="text-blue-600 text-gray-600 hover:underline flex items-center gap-1 gued-font text-sm"
                  >
                    <FaCopy /> Copy
                  </button>
                </div>
                <div className="bg-gray-100 p-4 text-gray-800 rounded-2xl font-mono text-sm break-all select-all border">
                  {secretKey}
                </div>
              </div>

              <div>
                <label className="block font-medium gued-font text-gray-700 mb-2">
                  4. Enter 6-digit code from app
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full text-center text-gray-800 text-2xl sm:text-4xl tracking-[6px] sm:tracking-[10px] font-mono border border-gray-300 rounded-2xl py-4 sm:py-5 focus:outline-none focus:border-blue-500"
                  placeholder="123456"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setShow2FAModal(false)}
                className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium gued-font text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={verifyAndEnable2FA}
                disabled={verifying2FA || verifyCode.length !== 6}
                className="flex-1 py-4 bg-gradient-to-r from-[#2460F5] to-[#3B1DDA] text-white rounded-2xl font-medium disabled:opacity-60 transition"
              >
                {verifying2FA ? "Verifying..." : "Verify & Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== IMPROVED 2FA DISABLE MODAL ===================== */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-[340px] sm:max-w-md p-6 sm:p-8 shadow-2xl">
            <h3 className="text-red-600 text-2xl gued-font mb-2">
              Disable 2FA?
            </h3>
            <p className="text-gray-600 gued-font mb-8">
              This will remove the extra security layer from your account.
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium gued-font text-gray-700 mb-3">
                Enter your current 2FA code
              </label>
              <input
                type="text"
                maxLength={6}
                value={disableCode}
                onChange={(e) =>
                  setDisableCode(e.target.value.replace(/\D/g, ""))
                }
                className="w-full text-center text-gray-800 text-2xl sm:text-4xl tracking-[6px] sm:tracking-[10px] font-mono border border-gray-300 rounded-2xl py-4 sm:py-5"
                placeholder="123456"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setShowDisableModal(false);
                  setDisableCode("");
                }}
                className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium gued-font text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisable2FA}
                disabled={disabling2FA || disableCode.length !== 6}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium disabled:opacity-60 transition"
              >
                {disabling2FA ? "Disabling..." : "Yes, Disable 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet OTP Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full">
            <h3 className="text-xl text-gray-800 gued-font mb-4">
              Update Wallet Address
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 font-medium gued-font mb-1">
                  New Wallet Address
                </label>
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-2xl"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium gued-font mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-2xl text-center text-xl sm:text-2xl"
                  placeholder="123456"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium gued-font mb-1">
                  Remark (Optional)
                </label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-2xl"
                  placeholder="My personal wallet"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => setShowWalletModal(false)}
                className="flex-1 py-3 text-gray-800 border border-gray-300 rounded-2xl gued-font font-medium"
              >
                Cancel
              </button>
              <button
                onClick={updateWalletAddress}
                disabled={updatingWallet || !newWalletAddress || !otp}
                className="flex-1 py-3 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-500 text-black rounded-2xl font-medium"
              >
                {updatingWallet ? "Updating..." : "Verify & Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyProfile;
