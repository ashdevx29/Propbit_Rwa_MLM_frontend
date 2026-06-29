import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../Service/adminApi";
import { Link } from "react-router-dom";
import {
  FaUserCheck,
  FaHome,
  FaUsers,
  FaBuilding,
  FaHandHoldingUsd,
  FaHourglassHalf,
  FaCoins,
  FaBusinessTime,
  FaDollarSign,
} from "react-icons/fa";
import { PiBuildingApartmentFill, PiBuildingFill } from "react-icons/pi";

const glass = "bg-white bg-opacity-40 backdrop-blur-md border border-white border-opacity-80 shadow-xl";

const StatCard = ({ title, subtitle, value, icon: Icon, gradient, link }) => (
  <>

    <Link  >
      
    <div
      className="w-full p-5 rounded-xl bg-white border border-gray-200 shadow-md 
      transition duration-300 hover:shadow-xl hover:scale-[1.02]
      hover:bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]"
    >
      {/* Top Section (Icon + Title) */}
      <div className="flex items-center gap-3 mb-4">
        <div
          // className="rounded-lg p-2 flex items-center justify-center"
          // style={{ background: gradient }}
        >
          <Icon className="text-gray-800 text-xl" />
        </div>

        <div className="flex flex-col">
          <div className="text-gray-800 font-semibold gued-font text-sm md:text-base">
            {title}
          </div>
          {subtitle && (
            <div className="text-gray-500 text-xs">{subtitle}</div>
          )}
        </div>
      </div>

      {/* Value Section */}
      <div className="flex justify-center items-center mt-4">
        <div className="text-black font-gued text-2xl md:text-3xl">
          {value}
        </div>
      </div>
    </div>
    </Link>
  </>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b pb-2 z-1">
    <span className="font-medium">{label}</span>
    <span className="text-gray-600">{value || "N/A"}</span>
  </div>
);

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const rowsPerPage = 5;

  const { data: dashboardData = {}, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      try {
        const res = await adminApi.getDashboardData();
        
        if (res?.data?.status === "error") {
          console.error("API Error:", res.data.message);
          return {}; // fallback empty
        }

        return res?.data || {};
      } catch (err) {
        console.error("Dashboard API failed:", err);
        return {}; // prevent crash
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  //role define
  const role = localStorage.getItem("role");
  // Stats for StatCard
 
  const stats = useMemo(() => {

  const allStats = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers ?? 0,
      icon: FaUsers,
      gradient: "linear-gradient(135deg,#6190e8,#a7bfe8)",
      link: "/admin/user-management",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Active Users",
      value:
        (dashboardData.totalUsers ?? 0) -
        (dashboardData.totalInactiveUsers ?? 0),
      icon: FaUserCheck,
      gradient: "linear-gradient(135deg,#43cea2,#185a9d)",
      link: "/admin/user-management",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Total Properties",
      value: dashboardData.totalProperties ?? 0,
      icon: FaHome,
      gradient: "linear-gradient(135deg,#fc5c7d,#6a82fb)",
      link: "/admin/property-management",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },

    // Property Categories
    {
      title: "Per Sqft Properties",
      value: dashboardData.propertyCategoryCounts?.PER_SQFT_INVESTMENT ?? 0,
      icon: FaBuilding,
      gradient: "linear-gradient(135deg,#21d397,#7d5fff)",
      link: "/admin/property-management",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Fractional Properties",
      value: dashboardData.propertyCategoryCounts?.FRACTIONAL_BUY ?? 0,
      icon: PiBuildingApartmentFill,
      gradient: "linear-gradient(135deg,#f7971e,#ffd200)",
      link: "/admin/property-management",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "One Time Buy Properties",
      value: dashboardData.propertyCategoryCounts?.ONE_TIME_BUY ?? 0,
      icon: PiBuildingFill,
      gradient: "linear-gradient(135deg,#dd5e89,#f7bb97)",
      link: "/admin/property-management",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },

    // Investment
    {
      title: "Total Investment",
      value: dashboardData.totalInvestment
        ? `₹${Number(dashboardData.totalInvestment).toLocaleString()}`
        : "₹0",
      icon: FaCoins ,
      gradient: "linear-gradient(135deg,#43cea2,#185a9d)",
      link: "/admin/Investment-Report",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Per Sqft Investment",
      value: dashboardData.investmentCategoryCounts?.PER_SQFT_INVESTMENT
        ? `₹${Number(
            dashboardData.investmentCategoryCounts.PER_SQFT_INVESTMENT
          ).toLocaleString()}`
        : "₹0",
      icon: FaDollarSign,
      gradient: "linear-gradient(135deg,#af67e9,#f68d7f)",
      link: "/admin/Investment-Report",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Fractional Investment",
      value: dashboardData.investmentCategoryCounts?.FRACTIONAL_BUY
        ? `₹${Number(
            dashboardData.investmentCategoryCounts.FRACTIONAL_BUY
          ).toLocaleString()}`
        : "₹0",
      icon: FaHandHoldingUsd,
      gradient: "linear-gradient(135deg,#fc5c7d,#6a82fb)",
      link: "/admin/Investment-Report",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },

    // Queries
    {
      title: "One Time Buy Queries",
      value: dashboardData.oneTimeBuyQueries ?? 0,
      icon: FaHourglassHalf,
      gradient: "linear-gradient(135deg,#f7971e,#ffd200)",
      link: "/admin/property-management?type=ONE_TIME_BUY",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Total Properties Sold",
      value: dashboardData.totalPropertiesSold ?? 0,
      icon: FaBusinessTime ,
      gradient: "linear-gradient(135deg,#f7971e,#ffd200)",
      link: "/admin/property-management?type=ONE_TIME_BUY",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Sqft Properties Sold",
      value: dashboardData.propertyCategoryCounts?.PER_SQFT_INVESTMENT ?? 0,
      icon: FaBuilding,
      gradient: "linear-gradient(135deg,#f7971e,#ffd200)",
      link: "/admin/property-management?type=ONE_TIME_BUY",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
    {
      title: "Fractional Properties Sold",
      value: dashboardData.propertyCategoryCounts?.FRACTIONAL_BUY ?? 0,
      icon: PiBuildingApartmentFill,
      gradient: "linear-gradient(135deg,#f7971e,#ffd200)",
      link: "/admin/property-management?type=ONE_TIME_BUY",
      roles: ["admin" , "property_manager" , "sales_executive"],
    },
  ];

  return allStats.filter((stat) => stat.roles.includes(role));

}, [dashboardData, role]);


  console.log("Dashboard Data:", dashboardData); // Debug log

  // Latest Transactions Pagination
  const transactions = dashboardData.latestTransactions || [];
  const emgtTokenPrice = dashboardData.emgtTokenPrice ? dashboardData.emgtTokenPrice.price : "N/A";
  const totalTransactionPages = Math.ceil(transactions.length / rowsPerPage);
  const transactionStartIndex = (currentTransactionPage - 1) * rowsPerPage;
  const currentTransactions = transactions.slice(transactionStartIndex, transactionStartIndex + rowsPerPage);

  
  const handleTransactionPrevious = () => {
    if (currentTransactionPage > 1) setCurrentTransactionPage((prev) => prev - 1);
  };

  const handleTransactionNext = () => {
    if (currentTransactionPage < totalTransactionPages) setCurrentTransactionPage((prev) => prev + 1);
  };

  // Latest Users Pagination
  const users = dashboardData.latestUsers || [];
  const totalUserPages = Math.ceil(users.length / rowsPerPage);
  const userStartIndex = (currentUserPage - 1) * rowsPerPage;
  const currentUsers = users.slice(userStartIndex, userStartIndex + rowsPerPage);

  const handleUserPrevious = () => {
    if (currentUserPage > 1) setCurrentUserPage((prev) => prev - 1);
  };

  const handleUserNext = () => {
    if (currentUserPage < totalUserPages) setCurrentUserPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-white-100 via-blue-100 to-white z-1">
        <main className="flex-1 min-h-screen p-4 md:p-6 lg:ml-5 overflow-x-hidden overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold droxen-font text-[#0F172A]">
                Dashboard
              </h1>
            </header>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-white-100 via-blue-100 to-white z-1">
        <main className="flex-1 min-h-screen p-4 md:p-6 lg:ml-5 overflow-x-hidden overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold droxen-font text-[#0F172A]">
                Dashboard
              </h1>
            </header>
            <p className="text-red-600">Error: {error?.message || "Failed to load dashboard data."}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen  w-50  flex bg-gradient-to-br from-white-100 via-blue-100 to-white z-1">
      <main className="flex-1 min-h-screen     overflow-x-hidden overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold droxen-font text-[#0F172A]">
              Dashboard
            </h1>
          </header>

          <section className="grid gap-4 grid-cols-2 [@media(max-width:450px)]:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
            {stats.map((item, idx) => (
              <StatCard key={idx} {...item} />
            ))}
          </section>

          <section className="mt-10 flex flex-col lg:flex-row gap-6">
            {/* Latest Transactions */}
            {role === "admin" && (
              <div className={`${glass} w-full p-6 rounded-xl shadow-[inset_-7px_-6px_16.8px_-7px_#fff,inset_6px_10px_19.6px_-11px_#00000012,-12px_-11px_21px_4px_#fff,12px_11px_21.9px_#00000040]`}>
                <h3 className="text-2xl font-semibold mb-4 text-[#0F172A]">Latest Transactions</h3>

                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                  <table className="min-w-[600px] w-full text-sm text-left">
                    <thead>
                      <tr className="text-xs uppercase bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000]">
                        <th className="px-5 py-3">User ID</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Date</th>
                      </tr>
                    </thead>

                    <tbody className="text-gray-700">
                      {currentTransactions.length > 0 ? (
                        currentTransactions.map((txn, idx) => (
                          <tr key={txn._id || idx} className={`transition hover:bg-gray-100/60 ${idx % 2 === 0 ? "bg-white/40" : "bg-gray-50/50"} border-b border-gray-400`}>
                            <td className="px-5 py-4 font-medium">{txn.userId?.email || "N/A"}</td>
                            <td className="px-5 py-4">{txn.amount ? `₹${Number(txn.amount).toFixed(2)}` : "N/A"}</td>
                            <td className="px-5 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${txn.type === "deposit" ? "bg-green-100 text-[#0082ED]" : "bg-blue-100 text-blue-600"}`}>
                                {txn.type ? txn.type.charAt(0).toUpperCase() + txn.type.slice(1) : "N/A"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${txn.status === "completed" ? "bg-green-100 text-[#0082ED]" : "bg-yellow-100 text-yellow-800"}`}>
                                {txn.status ? txn.status.charAt(0).toUpperCase() + txn.status.slice(1) : "N/A"}
                              </span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center px-6 py-8 text-gray-500 text-sm">
                            No transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-6 mt-10">
            {role === "admin" && (
              <div className="bg-white/70 backdrop-blur-lg shadow-md rounded-2xl p-6 w-full shadow-[inset_-7px_-6px_16.8px_-7px_#fff,inset_6px_10px_19.6px_-11px_#00000012,-12px_-11px_21px_4px_#fff,12px_11px_21.9px_#00000040]">
                <h3 className="text-2xl font-semibold mb-5">Latest Sign Ups</h3>

                {currentUsers.length === 0 ? (
                  <div className="text-gray-500 text-center py-6">No users found.</div>
                ) : (
                  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <table className="min-w-[600px] w-full text-sm text-left">
                      <thead>
                        <tr className="text-xs uppercase bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000]">
                          <th className="px-5 py-3">ID</th>
                          <th className="px-5 py-3">User ID</th>
                          <th className="px-5 py-3">Email</th>
                          <th className="px-5 py-3">Joining Date</th>
                        </tr>
                      </thead>

                      <tbody className="text-gray-700">
                        {currentUsers.map((user, idx) => (
                          <tr key={user._id || idx} className={`transition hover:bg-gray-100/60 ${idx % 2 === 0 ? "bg-white/40" : "bg-gray-50/50"} border-b border-gray-400`}>
                            <td className="px-5 py-4 font-medium">{user._id || "N/A"}</td>
                            <td className="px-5 py-4">{user.username || "N/A"}</td>
                            <td className="px-5 py-4">{user.email || "N/A"}</td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-2 right-2 text-[#FFF] hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
              <div className="bg-[#2298D3] p-6 flex flex-col items-center text-white">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4"
                />
                <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                <span
                  className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${selectedUser.status === "Member" ? "bg-white text-[#2298D3]" : "bg-red-100 text-red-600"
                    }`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <div className="p-6 space-y-4 text-sm text-[#0082ED]">
                <InfoRow label="Referred By" value={selectedUser.referredBy} />
                <InfoRow label="User ID" value={selectedUser.id} />
                <InfoRow label="User Name" value={selectedUser.name} />
                <InfoRow label="Email ID" value={selectedUser.email} />
                {/* <InfoRow label="Contact No." value={selectedUser.phone} /> */}
                <InfoRow label="Joining Date" value={selectedUser.joiningDate} />
                {/* <InfoRow label="Address" value={selectedUser.address} /> */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;