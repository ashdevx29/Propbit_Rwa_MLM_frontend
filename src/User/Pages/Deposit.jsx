import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FaCopy, FaWallet, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import QRCode from "react-qr-code";
import "./connect";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseUnits,
  JsonRpcProvider,
} from "ethers";
import axios from "axios";
// import { DEPOSIT_ABI, USDT_ABI } from "./utils/mainnetDepositABI";
import { DEPOSIT_ABI, USDT_ABI } from "./utils/testnetDepositABI";
import { appConfig } from "../../config/appConfig";
import { Wallet } from "lucide-react";
import Wallets from "./Wallets";
import { useDemoMode } from '../Contexts/DemoModeContext';
import { getDemoData } from '../Data/demoData';

const PUBLIC_RPC_URL = appConfig.PUBLIC_RPC_URL;
const publicProvider = new JsonRpcProvider(PUBLIC_RPC_URL);
const MAX_DEPOSIT_USD = 100000000;

const Deposit = () => {
  const { isDemoMode } = useDemoMode();
  const [method, setMethod] = useState("wallet");
  const [depositType, setDepositType] = useState("usdt");
  const [amount, setAmount] = useState("");
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [swapToTokens, setSwapToTokens] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider("eip155");
  const [showQrCode, setShowQrCode] = useState(false);
  const [depositAddress, setDepositAddress] = useState(null);
  const [qrCodeSrc, setQrCodeSrc] = useState(null);
  const [userId, setUserId] = useState(null);

  const walletAddress = address || (isDemoMode ? getDemoData("deposits").walletAddress : "Not connected");

  // Use demo data if demo mode is active
  const displayUsdtBalance = isDemoMode ? getDemoData("deposits").usdtBalance : usdtBalance;

  // Fetch user ID
  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (token) {
      console.log("Fetching user ID with token:", token);
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${appConfig.baseURL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User profile response:", res.data);
          setUserId(res.data.data.profile.user_id); // Corrected to user_id
        } catch (error) {
          console.error("Failed to fetch user ID", error);
          if (error.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            // Optionally, clear tokens and redirect to login
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            // window.location.href = "/login"; // Uncomment if needed
          } else {
            toast.error("Failed to fetch user profile. Please try logging in again.");
          }
        }
      };
      fetchUser();
    } else {
      toast.error("No authentication token found. Please log in.");
    }
  }, []);

  console.log("User id:", userId);  

  // Fetch USDT balance when wallet is connected
  const fetchBalance = useCallback(async () => {
    if (isConnected && address) {
      try {
        const provider = new BrowserProvider(walletProvider);
        const usdtContract = new Contract(appConfig.USDT_ADDRESS, USDT_ABI, provider);
        const balance = await usdtContract.balanceOf(address);
        setUsdtBalance(formatUnits(balance, 18));
      } catch (error) {
        handleError("Failed to fetch USDT balance.", error);
        setUsdtBalance(null);
      }
    } else {
      setUsdtBalance(null);
    }
  }, [isConnected, address, walletProvider]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Validate amount in real-time
  const validateAmount = useCallback(
    (value) => {
      const parsedAmount = parseFloat(value);
      if (parsedAmount <= 0) {
        setValidationError("Amount must be greater than zero!");
        return false;
      }
      if (parsedAmount < appConfig.MIN_INVESTMENT_USD) {
        setValidationError(
          `Amount must be at least ${appConfig.MIN_INVESTMENT_USD} INR!`
        );
        return false;
      }
      if (parsedAmount > MAX_DEPOSIT_USD) {
        setValidationError(
          `Amount exceeds maximum deposit limit of ${MAX_DEPOSIT_USD} INR!`
        );
        return false;
      }
      if (usdtBalance !== null && parsedAmount > parseFloat(usdtBalance)) {
        setValidationError("Insufficient USDT balance!");
        return false;
      }
      setValidationError("");
      return true;
    },
    [usdtBalance]
  );

  useEffect(() => {
    validateAmount(amount);
  }, [amount, validateAmount]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      icon: <FaCheckCircle className="text-blue-700" />,
    });
  };

  const handleConnectWallet = () => {
    open();
  };

  const checkNetwork = useCallback(async () => {
    if (!walletProvider) {
      toast.error(
        "Wallet provider unavailable. Please try reconnecting your wallet.",
        {
          icon: <FaTimesCircle className="text-red-400" />,
        }
      );
      return false;
    }
    try {
      const provider = new BrowserProvider(walletProvider);
      const network = await provider.getNetwork();
      if (network.chainId !== appConfig.chainID) {
        toast.error(
          "Incorrect network! Please switch to Binance Smart Chain Testnet.",
          {
            icon: <FaTimesCircle className="text-red-400" />,
          }
        );
        return false;
      }
      return true;
    } catch (error) {
      handleError("Failed to verify network.", error);
      return false;
    }
  }, [walletProvider]);

  const handleError = (message, error) => {
    console.error(message, error);
    toast.error(message, {
      icon: <FaTimesCircle className="text-red-400" />,
      autoClose: 3000,
    });
  };

  const handleGenerateQR = async () => {
    if (!userId) {
      handleError("User not authenticated. Please log in.");
      return;
    }
    if (!validateAmount(amount)) return;

    setIsLoading(true);
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      handleError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${appConfig.baseURL}/user/deposit/qr`,
        {
          amount_usd: parseFloat(amount),
          currency: depositType.toUpperCase(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;

      console.log("QR Code generation response:", data);

      if (data.status === "success") {
        const addressIn = data.data.address_in; // Assuming the response has data.address_in
        console.log("Deposit Address:", addressIn);
        setDepositAddress(addressIn);
        setQrCodeSrc(true); // Flag to show QR code
        toast.success("QR code generated successfully!", {
          icon: <FaCheckCircle className="text-[#0082ED]" />,
        });
      } else {
        handleError(data.message || "Failed to create deposit QR.");
      }
    } catch (error) {
      handleError("Failed to generate QR code.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected) {
      handleError("Please connect your wallet first!");
      return;
    }

    if (depositType === "emgt") {
      handleError("EMGT deposits are not supported yet. Please select USDT.");
      return;
    }

    if (!validateAmount(amount)) return;

    if (!(await checkNetwork())) return;

    setIsLoading(true);
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const usdtContract = new Contract(appConfig.USDT_ADDRESS, USDT_ABI, signer);
      const depositContract = new Contract(
        appConfig.DEPOSIT_ADDRESS,
        DEPOSIT_ABI,
        signer
      );

      const balance = await usdtContract.balanceOf(address);
      const amountWei = parseUnits(amount, 18);
      if (balance < amountWei) {
        handleError("Insufficient USDT balance in your wallet!");
        return;
      }

      const transactionToastId = toast.info(
        "Processing transaction: Approving USDT...",
        {
          autoClose: false,
        }
      );
      const approveTx = await usdtContract.approve(appConfig.DEPOSIT_ADDRESS, amountWei);
      await approveTx.wait();
      toast.update(transactionToastId, {
        render: "Processing transaction: Depositing to contract...",
        type: "info",
        autoClose: false,
      });
      const depositTx = await depositContract.deposit(amountWei);
      const receipt = await depositTx.wait();
      toast.dismiss(transactionToastId);

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        handleError("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        `${appConfig.baseURL}/user/userDeposit`,
        {
          amount: parseFloat(amount),
          walletAddress: address,
          transactionHash: receipt.hash,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Deposit response:", response.data);

      if (response.data.status === 'success') {
        toast.success("Deposit successful!", {
          icon: <FaCheckCircle className="text-[#0082ED]" />,
          autoClose: 3000,
        });
        setAmount("");
        await fetchBalance(); // Refresh balance
      } else {
        handleError(response.data.status);
      }
    } catch (error) {
      let errorMessage = "Deposit failed. Please try again.";
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        errorMessage = "Transaction rejected by user.";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas fees.";
      } else if (error.message.includes("execution reverted")) {
        errorMessage = "Transaction failed: Smart contract error.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      handleError(errorMessage, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Wallets />
      </div>
      <div className="theme-card-style border-gradient text-gray-800 p-5 rounded-md max-w-2xl mx-auto">
        <div className="flex justify-center mb-6 border-b border-gray-200 gap-4">
          <button
            className={`px-4 py-2 rounded-t ${method === 'qr' ? 'text-white border-b-2 border-sky-400 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]' : 'bg-[linear-gradient(135deg,#ffffff_0%,#0082ED_100%)]'}`}
            onClick={() => setMethod('qr')}
          >
            Deposit via QR
          </button>

          <button
            className={`px-4 py-2 rounded-t md:text-base text-sm ${method === "wallet"
              ? "text-white border-b-2 border-sky-400 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]"
              : "bg-[linear-gradient(135deg,#ffffff_0%,#0082ED_100%)]"
              }`}
            onClick={() => setMethod("wallet")}
          >
            Deposit via Wallet
          </button>
        </div>

        {method === "qr" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Select Token
              </label>
              <select
                value={depositType}
                onChange={(e) => setDepositType(e.target.value)}
                className="w-full bg-transparent border border-slate-800 px-4 py-2 rounded text-dark focus:outline-none"
              >
                <option value="usdt" className="bg-gray-700">
                  Deposit in USDT
                </option>
                {/* <option value="emgt" className="bg-gray-700">
                  Deposit in EMGT
                </option> */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Enter Amount (INR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full bg-white border ${validationError ? "border-red-500" : "border-gray-300"
                  } px-4 py-2 rounded text-gray-800 focus:outline-none`}
                placeholder={`Minimum ${appConfig.MIN_INVESTMENT_USD} INR`}
                disabled={isLoading}
              />
              {validationError && (
                <p className="text-red-400 text-xs mt-1">{validationError}</p>
              )}
            </div>
            <button
              onClick={handleGenerateQR}
              className="w-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-gradient-to-r hover:from-[#00E8A6] hover:to-[#0082ED] py-2 rounded text-sm font-semibold text-white disabled:bg-[#001D35] disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading || !!validationError || !amount}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate QR"
              )}
            </button>
            {qrCodeSrc && (
              <div className="mt-4">
                <div className="bg-white p-4 rounded flex justify-center">
                  <QRCode value={depositAddress} fgColor="#000000" bgColor="#ffffff" size={192} />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-1">
                    Deposit Address
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded border border-slate-600">
                    <span className="text-base truncate">{depositAddress}</span>
                    <button
                      onClick={() => copyToClipboard(depositAddress)}
                      className="ml-auto text-sky-400 hover:text-sky-300"
                      title="Copy to clipboard"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
                <p className="text-yellow-400 text-sm mt-2">
                  âš ï¸ Pay the exact amount on Binance Smart Chain. Otherwise, funds will be lost.
                </p>
                <p className="text-yellow-400 text-sm mt-2">
                  âš ï¸ Payment receipt may take 3-5 minutes.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mt-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-gradient-to-r hover:from-[#00E8A6] hover:to-[#0082ED] rounded text-sm font-semibold"
                onClick={handleConnectWallet}
              >
                <FaWallet /> {isConnected ? "Connected" : "Connect Wallet"}
              </button>
              {isConnected && (
                <>
                  <span className="text-blue-700 text-sm">
                    Wallet: {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  {displayUsdtBalance !== null && (
                    <span className="text-sm">
                      <span className="font-semibold">USDT Balance: </span>
                      <span>{parseFloat(displayUsdtBalance).toFixed(2)} USDT</span>
                    </span>
                  )}
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Enter Amount (INR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full bg-white border ${validationError ? "border-red-500" : "border-gray-300"
                  } px-4 py-2 rounded text-gray-800 focus:outline-none`}
                placeholder={`Minimum ${appConfig.MIN_INVESTMENT_USD} INR`}
                disabled={!isConnected || isLoading}
              />
              {validationError && (
                <p className="text-red-400 text-xs mt-1">{validationError}</p>
              )}
            </div>
            <button
              onClick={handleDeposit}
              className="w-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-gradient-to-r hover:from-[#00E8A6] hover:to-[#0082ED] py-2 rounded text-sm font-semibold text-white disabled:bg-[#001D35] disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!isConnected || isLoading || !!validationError}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Deposit"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Deposit;

// import React, { useState } from "react";
// import { AiOutlineHome } from "react-icons/ai";


// export default function DepositPage() {
//   const [amount, setAmount] = useState("");

//   const balance = 1040500;
//   const invested = 1440500;
//   const panchas = 2;

//   return (
//     <div className="bg-gray-100 min-h-screen p-4 md:p-8">
//       {/* Heading */}
//       <h2 className="text-lg md:text-xl text-black droxen-font">
//         DEPOSIT SECURELY. INVEST CONFIDENTLY.
//       </h2>
//       <p className="text-[#4B5563] text-lg mt-1 mb-6">
//         Top up your wallet to start investing in premium real estate assets
//         across the globe.
//       </p>

//       {/* Top Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6">
//         <div className=" bg-[linear-gradient(105.57deg,_#85EEB3_50.12%,_#287751_165.2%)] text-white p-6 rounded-xl shadow">
//           <p className="text-[14px] opacity-80 text-[#0F172A]">
//             Available Balance
//           </p>
//           <h3 className="text-[24px] text-[#0F172A]  font-normal">
//             â‚¹ {balance.toLocaleString()}
//           </h3>
//         </div>

//         <div className=" bg-[linear-gradient(105.57deg,_#85EEB3_50.12%,_#287751_165.2%)] text-white p-4 rounded-xl shadow">
//           <p className="text-[14px] opacity-80 text-[#0F172A]">
//             Total Invested
//           </p>
//           <h3 className="text-[24px] text-[#0F172A] font-normal">
//             â‚¹ {invested.toLocaleString()}
//           </h3>
//         </div>

//         <div className=" bg-[linear-gradient(105.57deg,_#85EEB3_50.12%,_#287751_165.2%)] text-white p-4 rounded-xl shadow">
//           <p className="text-[14px] opacity-80 text-[#0F172A]">Panchas</p>
//           <h3 className="text-[24px] text-[#0F172A]  font-normal">{panchas}</h3>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* LEFT SECTION */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Deposit Amount */}
//           <div className="bg-white p-5 rounded-xl shadow ">
//             <h4 className="font-normal text-[20px] mb-3 text-black">
//               <i className="fa-solid fa-money-bills text-[#4BDD96]"></i> Deposit
//               Amount
//             </h4>
//             <label className="text-[#334155] mb-8 text-[16px]">
//               {" "}
//               Enter Amount (INR)
//             </label>
//             <input
//               type="number"
//               placeholder="INR   Min. 1.000"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-black "
//             />
//             <p className="text-[#64748B] text-[14px]">
//               Minimum deposit amount is AED 1,000 per transaction.
//             </p>
//             <div className="flex flex-wrap gap-2 mt-3">
//               {[1000, 5000, 10000, 25000].map((val) => (
//                 <button
//                   key={val}
//                   onClick={() => setAmount(val)}
//                   className="px-3 py-1 border rounded-md text-sm text-[#0F172A] hover:bg-gray-100"
//                 >
//                   +{val}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="bg-white p-5 rounded-xl shadow">
//             <h4 className="font-normal mb-3 text-[20px] text-black">
//               {" "}
//               <i className="text-[#4BDD96] fa-solid fa-wallet"></i> Payment
//               Method
//             </h4>

//             <div className="space-y-3">
//               <div className="border-2 border-green-400 bg-green-50 p-4 rounded-lg flex justify-between items-center text-black">
//                 <div className="flex gap-2 ">
//                   {"  "}
//                   <span>
//               <AiOutlineHome className="text-green-400 text-2xl" />{" "}
//                   </span>
//                   <div>
//                     {"  "}
//                     <p> Bank Transfer </p>
//                     <p className="text-gray-600">Fast processing</p>
//                   </div>
//                 </div>
//                 <span className="text-[#0082ED]">
//                   <i className="fa-regular fa-circle-check text-[#4BDD96]"></i>
//                 </span>
//               </div>

//   <div className="border-2 border-[#E2E8F0]  p-4 rounded-lg flex justify-between items-center text-black">
//                 <div className="flex gap-2">
//                   {"  "}
//                   <span>
//                     <i className="fa-regular fa-credit-card text-[#64748B] mb-4"></i>{" "}
//                   </span>
//                   <div>
//                     {"  "}
//                     <p> Debit / Credit Card </p>
//                     <p className="text-gray-600">Instant credit (2.5% processing fee)</p>
//                   </div>
//                 </div>
//                 <span className="text-[#0082ED]">
//                  <i className="fa-regular fa-circle text-gray-600"></i>
//                 </span>
//               </div>

//               <div className="border-2 border-[#E2E8F0]  p-4 rounded-lg flex justify-between items-center text-black">
//                 <div className="flex gap-2">
//                   {"  "}
//                   <span>
//                  <i className="fa-solid fa-earth-africa text-[#64748B]"></i>{" "}
//                   </span>
//                   <div>
//                     {"  "}
//                     <p> International Wire Transfer </p>
//                     <p className="text-gray-600">Supports INR (3-5 business days)</p>
//                   </div>
//                 </div>
//                 <span className="text-[#0082ED]">
//               <i className="fa-regular fa-circle text-gray-600"></i>
//                 </span>
//               </div>

            
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="space-y-6">
//           {/* Info */}
//           <div className="bg-green-50 p-4 rounded-xl text-sm text-gray-700 shadow flex gap-4">
//             <i className="fa-solid fa-circle-info text-[#4BDD96]"></i>
//             <div className="flex-col gap-5">
//               <h5 className=" text-black text-[17px] font-normal max-w-[273px] mb-3">
//                 {" "}
//                 Deposits are typically credited within 24 hours.{" "}
//               </h5>
//               <p className="text-[14px] max-w-[248px]">
//                 Funds are held securely in regulated escrow accounts to ensure
//                 maximum investor protection.
//               </p>
//             </div>
//           </div>

//           {/* Summary */}
//           <div className="bg-white p-5 rounded-xl shadow text-black">
//             <h4 className="font-normal mb-3 text-[18px]">Summary</h4>

//             <div className="flex justify-between text-sm mb-2">
//               <span className="text-[14px] text-[#64748B]">Top-up amount</span>
//               <span className="text-[14px]">INR {amount || 0}</span>
//             </div>

//             <div className="flex justify-between text-sm mb-2">
//               <span className="text-[14px] text-[#64748B]">
//                 Transaction fee
//               </span>
//               <span className="text-[#4BDD96] text-[14px]">Free</span>
//             </div>

//             <div className="flex justify-between font-semibold text-lg mt-3">
//               <span className="text-[16px] text-[#0F172A]">Total to Pay</span>
//               <span className="text-[24px]">INR {amount || 0}</span>
//             </div>

//             <button className=" text-[16px] w-full mt-4 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-[#308f61] text-black py-3 rounded-lg transition">
//               Add Funds Securely â†’
//             </button>

//             <p className="text-[12px] text-gray-400 text-center mt-3">
//               <i className="fa-solid fa-lock"></i> Bank-level encryption
//               protected
//             </p>
//             <div className="flex items-center justify-center text-gray-400 gap-4">
//               <i className="fa-solid fa-shield"></i>{" "}
//               <i className="fa-solid fa-shield-halved"></i>{" "}
//               <i className="fa-solid fa-shield"></i>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

