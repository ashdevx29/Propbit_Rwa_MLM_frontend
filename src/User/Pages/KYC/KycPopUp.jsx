// components/KycPopup.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MdLockOutline, } from "react-icons/md";
import { GoShieldLock } from "react-icons/go";
import { LuShieldCheck } from "react-icons/lu";
import { appConfig } from "../../../config/appConfig";

export default function KycPopup({ isKycDone }) {
  const [show, setShow] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [isApprovedFromReport, setIsApprovedFromReport] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkKycStatusFromReport = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        if (!token) {
          if (mounted) {
            setIsApprovedFromReport(Boolean(isKycDone));
            setStatusChecked(true);
          }
          return;
        }

        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "20");

        const response = await axios.get(
          `${appConfig.baseURL}/user/get-kyc-history?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const history = response?.data?.data?.history || [];
        const hasApprovedStatus = history.some(
          (item) => String(item?.status || "").toLowerCase() === "approved"
        );

        if (mounted) {
          setIsApprovedFromReport(hasApprovedStatus);
          setStatusChecked(true);
        }
      } catch (error) {
        if (mounted) {
          setIsApprovedFromReport(Boolean(isKycDone));
          setStatusChecked(true);
        }
      }
    };

    checkKycStatusFromReport();

    return () => {
      mounted = false;
    };
  }, [isKycDone]);

  const isKycApproved = isKycDone || isApprovedFromReport;

  // Show popup periodically if KYC not done
  useEffect(() => {
    if (!statusChecked || isKycApproved) return;

    const interval = setInterval(() => {
      setShow(true);
    }, 20000); // every 20 sec

    return () => clearInterval(interval);
  }, [statusChecked, isKycApproved]);

  // Initial delay on page load
  useEffect(() => {
    if (statusChecked && !isKycApproved) {
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusChecked, isKycApproved]);

  if (!statusChecked || !show || isKycApproved) return null;

  const handleRemindLater = () => {
    setShow(false);
  };

  if (location.pathname.includes("kyc-submit")) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        
        {/* Top Section */}
        <div className="bg-green-100 flex justify-center items-center py-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow">
            <svg
              className="w-6 h-6 text-[#0082ED]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2l4 -4" />
              <path d="M12 3l7 4v5c0 5 -3.5 9 -7 9s-7 -4 -7 -9V7l7 -4z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Complete Your KYC Verification
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            To start investing in premium real estate and ensure account
            security, please complete your identity verification.
          </p>

          {/* Buttons */}
          <a href="kyc-submit">
            <button
                className="w-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-green-500 text-black py-3 rounded-lg font-medium transition"
            >
                Complete KYC Now
            </button>
          </a>
          <button
            onClick={handleRemindLater}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Remind Me Later
          </button>

          {/* Footer */}
          <div className="flex justify-center gap-4 mt-6 text-xs text-gray-400">
            <span className="flex items-center gap-1">
                <MdLockOutline className="text-gray-400 text-sm" />
                    SECURE
            </span>
            <span className="flex items-center gap-1">
                <GoShieldLock  className="text-gray-400 text-sm" />
                    ENCRYPTED
            </span>
            <span className="flex items-center gap-1">
                <LuShieldCheck className="text-gray-400 text-sm" />
                    VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
