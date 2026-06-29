import { useEffect, useState } from "react";
import axios from "axios";
import { FaWallet, FaChartLine, FaChartArea, FaHome, FaBuilding, FaCity, FaHotel } from "react-icons/fa";
import { appConfig } from "../../config/appConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


const Dashboard = () => {
  const toNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
      const parsed = Number.parseFloat(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const [stats, setStats] = useState({
    totalInvestment: 0,
    totalProperties: 0,
    totalPerSqftInvestment: 0,
    totalFractionalInvestment: 0,
    changes: {
      totalInvestment: 0,
      totalProperties: 0,
      totalPerSqftInvestment: 0,
      totalFractionalInvestment: 0,
    },
  });

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // API
  const fetchDashboardData = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        setStats({
          totalInvestment: 0,
          totalProperties: 0,
          totalPerSqftInvestment: 0,
          totalFractionalInvestment: 0,
          changes: {
            totalInvestment: 0,
            totalProperties: 0,
            totalPerSqftInvestment: 0,
            totalFractionalInvestment: 0,
          },
        });
        setChartData([]);
        setTransactions([]);
        return;
      }

      const response = await axios.get(`${appConfig.baseURL}/user/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const dashboard = response?.data?.data || {};
      const dashboardChanges = dashboard?.changes || {};

      const totalInvestment = toNumber(dashboard?.totalSelfInvestment);
      // const totalProperties = toNumber(dashboard?.totalProperties);
      
      const totalProperties = toNumber(
  dashboard?.totalProperties || dashboard?.totalPropertiesBought
);

      const totalPerSqftInvestment = toNumber(dashboard?.totalReadyInvestment);
      const totalFractionalInvestment = toNumber(
        dashboard?.totalUnderconstructionInvestment
      );

      setStats({
        totalInvestment,
        totalProperties,
        totalPerSqftInvestment,
        totalFractionalInvestment,
        changes: {
          totalInvestment: toNumber(dashboardChanges?.totalSelfInvestment),
          totalProperties: toNumber(dashboardChanges?.totalProperties),
          totalPerSqftInvestment:
            toNumber(dashboardChanges?.totalPerSqftInvestment) || totalPerSqftInvestment,
          totalFractionalInvestment:
            toNumber(dashboardChanges?.totalFractionalInvestment) || totalFractionalInvestment,
        },
      });

      const chartSeries = dashboard?.investmentHistory || [];
      // ✅ MONTH GROUPING
      const monthlyMap = {};

      chartSeries.forEach((item) => {
        const date = new Date(item.date);

        if (isNaN(date)) return; // safety

        const key = `${date.getFullYear()}-${date.getMonth()}`; // unique month key

        if (!monthlyMap[key]) {
          monthlyMap[key] = 0;
        }

        monthlyMap[key] += toNumber(item.amount);
      });

      const normalizedChart = Array.isArray(chartSeries)
        ? chartSeries
            .map((item) => ({
              date: item?.date || item?.month || item?.label || "",
              value: toNumber(item?.value ?? item?.percentage ?? item?.amount),
            }))
            .filter((item) => item.date)
        : [];

      const maxChartValue = normalizedChart.reduce(
        (max, item) => (item.value > max ? item.value : max),
        0
      );

 
// ✅ CONVERT TO ARRAY
const chartForUi = Object.keys(monthlyMap)
  .sort() // important for order
  .map((key) => {
    const [year, month] = key.split("-");
    return {
      date: new Date(year, month),
      value: monthlyMap[key],
    };
  });
    

      setChartData(chartForUi);

      const recentTransactions =
        dashboard?.recentTransactions ||
        dashboard?.transactions?.recent ||
        dashboard?.lastInvestments ||
        [];

      const mappedTransactions = Array.isArray(recentTransactions)
        ? recentTransactions.map((item) => {
            const rawDate =
              item?.date ||
              item?.createdAt ||
              item?.investmentDate ||
              item?.investedAt;

            const dateObj = rawDate ? new Date(rawDate) : null;
            const date = dateObj && !Number.isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "-";

            const investmentType =
              item?.investment_type ||
              item?.type ||
              (item?.isFractional ? "Fractional" : "Per.Sqft");

            return {
              name:
                item?.propertyName ||
                item?.propertyTitle ||
                item?.name ||
                item?.title ||
                "-",
              date,
              amount: toNumber(
                item?.amount ??
                  item?.amount_usd ??
                  item?.investmentAmount ??
                  item?.investment
              ),
              status: item?.status || "Completed",
              type: investmentType,
            };
          })
        : [];

      setTransactions(mappedTransactions);
    } catch (err) {
      console.error(err);
      setChartData([]);
      setTransactions([]);
     setStats({
  totalInvestment: 0,
  totalProperties: 0,
  totalPerSqftInvestment: 0,
  totalFractionalInvestment: 0,
  changes: {
    totalInvestment: 0,
    totalProperties: 0,
    totalPerSqftInvestment: 0,
    totalFractionalInvestment: 0,
  },
});
    }
  };

  // HELPERS
  const formatCurrency = (val) =>
    Number(val || 0).toLocaleString("en-IN", {
  style: "currency",
  currency: "INR",
});

  const getTrendIcon = (val) => {
    if (val >= 0) {
      return <FaChartLine className="text-[#0082ED] text-sm" />;
    } else {
      return <FaChartArea className="text-red-500 text-sm rotate-180" />;
    }
  };

  const propertyIcons = [<FaHome />, <FaBuilding />, <FaCity />, <FaHotel />];

  const hasData = chartData && chartData.length > 0;

  // fallback months (last 6 months)
  const getLast6Months = () => {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        date: d,
        value: 0,
      });
    }

    return months;
  };

  const safeChartData = hasData ? chartData : getLast6Months();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];

      return (
        <div style={{
          background: "#111",
          borderRadius: "10px",
          padding: "10px 12px",
          color: "#fff",
          border: "none",
        }}>
          <p style={{ fontSize: "12px", color: "#f5eeee" }}>
            {new Date(label).toLocaleString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </p>

          <p style={{ fontWeight: "600", color: "#f4eeee" }}>
            ₹{Number(data.value).toLocaleString("en-IN")}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-4 sm:p-6 dmfont">

      {/* TOP CARDS */}
      <div className="dashboard-top-cards">
        {[
          {
            title: "Total Investment",
            value: formatCurrency(stats.totalInvestment),
            change: stats.changes.totalInvestment,
          },
          {
            title: "Total Properties",
            value: stats.totalProperties,
            change: stats.changes.totalProperties,
          },
          {
            title: "Total Per.SqFt Investment",
            value: formatCurrency(stats.totalPerSqftInvestment),
            change: stats.changes.totalPerSqftInvestment,
          },
          {
            title: "Total Fractional Investment",
            value: formatCurrency(stats.totalFractionalInvestment),
            change: stats.changes.totalFractionalInvestment,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-white shadow transition duration-300
           hover:bg-gradient-to-r hover:from-[#85EEB3] hover:to-[#0082ED]
            hover:shadow-lg hover:scale-[1.02]"
          >
            <p className="text-sm text-black gued-font opacity-80">{card.title}</p>
            <h2 className="text-xl sm:text-2xl mt- gued-font text-black">{card.value}</h2>

            <p
              className={`text-sm mt-2 flex gued-font items-center gap-1 ${
                card.change >= 0 ? "text-[#0082ED]" : "text-red-500"
              }`}
            >
              {getTrendIcon(card.change)}
              {Math.abs(card.change)}%
            </p>
          </div>
        ))}
      </div>

      {/* MIDDLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        {/* CHART */}
        <div className="md:col-span-4 bg-white p-5 rounded-xl shadow min-w-0">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-black gued-font">Investment Growth</h3>
              <p className="text-sm text-gray-500 gued-font">
                Performance over the last 12 months
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-black gued-font">
                {formatCurrency(stats.totalInvestment)}
              </h2>
              <p className="text-[#0082ED] text-sm gued-font">
                +{stats.changes.totalInvestment}% YoY
              </p>
            </div>
          </div>

         <div className="w-full h-[300px] relative">
            {!hasData && (
              <p className="absolute top-2 right-3 text-xs text-gray-400">
                No data available
              </p>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={safeChartData}
                barCategoryGap="60%"
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}  // ✅ ADD THIS
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#85EEB3" />
                    <stop offset="100%" stopColor="#287751" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleString("en-IN", { month: "short" })
                  }
                />

                <YAxis
                  width={80}   // ✅ ADD THIS (important)
                  tickFormatter={(val) => {
                    if (val >= 1e7) return `₹${(val / 1e7).toFixed(1)}Cr`;
                    if (val >= 1e5) return `₹${(val / 1e5).toFixed(1)}L`;
                    if (val >= 1e3) return `₹${(val / 1e3).toFixed(1)}K`;
                    return `₹${val}`;
                  }}
                  domain={[
                    0,
                    (dataMax) => {
                      if (dataMax <= 100000) return Math.ceil(dataMax / 10000) * 10000;        // 10K
                      if (dataMax <= 1000000) return Math.ceil(dataMax / 50000) * 50000;      // 50K
                      if (dataMax <= 10000000) return Math.ceil(dataMax / 100000) * 100000;   // 1L
                      return Math.ceil(dataMax / 1000000) * 1000000;                          // 10L+
                    },
                  ]}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={40}        // ✅ fixed width
                  maxBarSize={50}     // ✅ limit max width
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* DEPOSIT CARD */}
        {/* <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between relative">
          <div className="absolute top-5 right-5 text-[#0082ED]">
            <FaWallet />
          </div>

          <div>
            <h3 className="text-[16px] text-gray-800 gued-font">Quick Deposit</h3>
            <p className="text-sm text-gray-500 mt-2 gued-font">
              Total amount currently available for new property investments
            </p>

            <div className="bg-gray-100 p-5 rounded-xl mt-5">
              <p className="text-sm text-gray-400 gued-font">Total Deposited</p>
              <h2 className="text-2xl text-gray-900 mt-1 gued-font">
                {formatCurrency(stats.totalInvestment)}
              </h2>
            </div>
          </div>

          <button className="mt-6 flex items-center justify-center gap-2 
            bg-gradient-to-r from-[#85EEB3] to-[#287751] 
            text-black py-3 rounded-full shadow-md 
            hover:shadow-lg hover:scale-[1.02] transition duration-300 gued-font">
            + Add Deposit
          </button>
        </div> */}
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white p-5 rounded-xl shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 gued-font gued-font">Recent Transactions</h3>
          <button className="text-[#0082ED] text-sm gued-font">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                <th className="py-3 px-4 text-left gued-font">Property Name</th>
                <th className="py-3 px-4 text-left gued-font">Date</th>
                <th className="py-3 px-4 text-left gued-font">Buy Amount</th>
                <th className="py-3 px-4 text-left gued-font">Status</th>
                <th className="py-3 px-4 text-left gued-font">Investment Type</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 flex items-center gap-3 text-black">
                    <div className="w-9 h-9 rounded-md bg-green-100 flex items-center justify-center text-[#0082ED]">
                      {propertyIcons[i % propertyIcons.length]}
                    </div>
                    {t.name}
                  </td>

                  <td className="py-4 px-4 text-gray-500">{t.date}</td>
                  <td className="py-4 px-4 text-gray-800">{formatCurrency(t.amount)}</td>

                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      t.status === "Completed"
                        ? "bg-green-100 text-[#0082ED]"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-gray-800">
                    {t.type || "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;