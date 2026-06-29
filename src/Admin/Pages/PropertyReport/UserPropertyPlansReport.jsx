import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../Service/adminApi";
import { toast } from "react-toastify";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const InvestmentReport = () => {
  // Filters - Same as other pages
  const [userIdFilter, setUserIdFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [userIdInput, setUserIdInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Server-side pagination
  const { 
    data: apiResponse = { investments: [], totalPages: 1, totalRecords: 0 }, 
    isFetching, 
    isError 
  } = useQuery({
    queryKey: ["investmentReport", pagination.pageIndex, userIdFilter, startDate, endDate],
    queryFn: async () => {
      const pageNum = pagination.pageIndex + 1;
      const res = await adminApi.getAllInvestments(pageNum, pagination.pageSize, startDate, endDate, userIdFilter); // Your existing API
      console.log(`ðŸ“¡ Investment Page ${pageNum} fetched:`, res?.data);

      return {
        investments: res?.data?.investments || res?.data?.history || [],
        totalPages:
          res?.data?.totalPages ??
          res?.data?.pagination?.pages ??
          res?.data?.pages ??
          1,
        totalRecords: res?.data?.totalRecords || 0,
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const investments = apiResponse.investments;
  const pageCount = apiResponse.totalPages;
  const totalRecords = apiResponse.totalRecords;
  const currentPage = pagination.pageIndex + 1;

  const columns = useMemo(() => [
    {
      accessorKey: "sr",
      header: "S.No.",
      cell: ({ row }) => pagination.pageIndex * 10 + row.index + 1,
    },
    { accessorKey: "user_id", header: "User ID" },
    { accessorKey: "property_id", header: "Property ID" },
    { accessorKey: "investment_type", header: "Investment Type" },
    { 
      accessorKey: "amount_usd", 
      header: "Amount INR", 
      cell: ({ getValue }) => `₹${Number(getValue() || 0).toFixed(2)}` 
    },
    { 
      accessorKey: "units_bought", 
      header: "Units Bought", 
      cell: ({ getValue }) => Number(getValue() || 0).toFixed(4) 
    },
    { 
      accessorKey: "entry_price", 
      header: "Per Unit Price (slots/Area)", 
      cell: ({ getValue }) => `₹${Number(getValue() || 0).toFixed(2)}` 
    },
    { 
      accessorKey: "rental_Percentage", 
      header: "Rental / Stake", 
      cell: ({ getValue, row }) => `${Number(getValue() || row.original.rental_percentage || 0).toFixed(2)}%` 
    },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) =>
        getValue() ? new Date(getValue()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A",
    },
  ], [pagination.pageIndex]);

  const table = useReactTable({
    data: investments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const handleSearch = () => {
    setUserIdFilter(userIdInput.trim());
    setStartDate(startDateInput);
    setEndDate(endDateInput);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  // Fetch ALL records for export
  const fetchFullData = async () => {
    let all = [], page = 1, totalPages = 1;
    while (page <= totalPages) {
     const res = await adminApi.getAllInvestments(
  page,
  500,
  startDate,
  endDate,
  userIdFilter
);
      const data = res?.data || {};
      all = [...all, ...(data.investments || data.history || [])];
      totalPages = data.totalPages || 1;
      page++;
    }
    return all;
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const allData = await fetchFullData();
      if (!allData.length) return toast.error("No data to export");

      const doc = new jsPDF({ orientation: "landscape" });
      doc.text("Investment Report", 14, 15);

      const headers = ["S.No.", "User ID", "Property ID", "Investment Type", "Amount INR", "Units Bought", "Entry Price", "Rental / Stake", "Status", "Created At"];
      const chunkSize = 1000;

      for (let i = 0; i < allData.length; i += chunkSize) {
        const rows = allData.slice(i, i + chunkSize).map((item, idx) => [
          i + idx + 1,
          item.user_id || "N/A",
          item.property_id || "N/A",
          item.investment_type || "N/A",
          `₹${Number(item.amount_usd || 0).toFixed(2)}`,
          Number(item.units_bought || 0).toFixed(4),
          `₹${Number(item.entry_price || 0).toFixed(2)}`,
          `${Number(item.rental_Percentage || item.rental_percentage || 0).toFixed(2)}%`,
          item.status || "N/A",
          item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A",
        ]);

        autoTable(doc, {
          head: i === 0 ? [headers] : undefined,
          body: rows,
          startY: i === 0 ? 25 : doc.lastAutoTable?.finalY || 25,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [16, 57, 68], textColor: [255, 255, 255] },
        });
      }
      doc.save("investment-report.pdf");
      toast.success("PDF exported successfully");
    } catch (err) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const allData = await fetchFullData();
      if (!allData.length) return toast.error("No data to export");

      const excelData = allData.map((item, idx) => ({
        "S.No.": idx + 1,
        "User ID": item.user_id || "N/A",
        "Property ID": item.property_id || "N/A",
        "Investment Type": item.investment_type || "N/A",
        "Amount INR": `₹${Number(item.amount_usd || 0).toFixed(2)}`,
        "Units Bought": Number(item.units_bought || 0).toFixed(4),
        "Entry Price": `₹${Number(item.entry_price || 0).toFixed(2)}`,
        "Rental / Stake": `${Number(item.rental_Percentage || item.rental_percentage || 0).toFixed(2)}%`,
        "Status": item.status || "N/A",
        "Created At": item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A",
      }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(excelData), "InvestmentReport");
      XLSX.writeFile(wb, "investment-report.xlsx");
      toast.success("Excel exported successfully");
    } catch (err) {
      toast.error("Failed to export Excel");
    } finally {
      setIsExportingExcel(false);
    }
  };

  if (isError) return <div className="p-4 text-red-600 text-center">Error loading data</div>;

  return (
    <div className="p-4 max-w-[1260px] mx-auto">
      <h2 className="text-2xl font-bold droxen-font mb-4">Investment Report</h2>

      {/* Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">User ID</label>
            <input 
              type="text" 
              value={userIdInput} 
              onChange={e => setUserIdInput(e.target.value)} 
              placeholder="URWA00001" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADD97]" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
            <input 
              type="date" 
              value={startDateInput} 
              onChange={e => setStartDateInput(e.target.value)} 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADD97]" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
            <input 
              type="date" 
              value={endDateInput} 
              onChange={e => setEndDateInput(e.target.value)} 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADD97]" 
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch} 
              className="w-full bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:bg-[#0e2a3d] text-white py-2.5 rounded-xl text-sm font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button onClick={handleExportPDF} disabled={isExportingPDF} className={`flex-1 sm:flex-none flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold px-5 py-2.5 rounded-2xl shadow-lg active:scale-95 ${isExportingPDF ? "opacity-60 cursor-not-allowed" : ""}`}>
          {isExportingPDF ? "â³ Exporting..." : "Export PDF"}
        </button>
        <button onClick={handleExportExcel} disabled={isExportingExcel} className={`flex-1 sm:flex-none flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-5 py-2.5 rounded-2xl shadow-lg active:scale-95 ${isExportingExcel ? "opacity-60 cursor-not-allowed" : ""}`}>
          {isExportingExcel ? "â³ Exporting..." : "Export Excel"}
        </button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto bg-white rounded-lg shadow border min-h-[400px]">
        {isFetching && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 text-[#0082ED] font-medium">
              <div className="w-5 h-5 border-4 border-[#4ADD97] border-t-transparent rounded-full animate-spin" />
              Loading page {currentPage}...
            </div>
          </div>
        )}
        <table className="min-w-full text-sm">
          <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000] sticky top-0">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th key={header.id} className="p-3 text-left font-medium border-b whitespace-nowrap">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {investments.length === 0 && !isFetching ? (
              <tr><td colSpan={10} className="p-12 text-center text-gray-500">No records found</td></tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 border-b last:border-none">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Same as other pages */}
      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div className="text-gray-600">
          {totalRecords === 0
            ? "Showing 0 to 0"
            : `Showing ${pagination.pageIndex * pagination.pageSize + 1} to`}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRecords)}{" "}
          of {totalRecords} entries
        </div>

        <div className="space-x-2 flex">
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            First
          </button>

          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            disabled={pagination.pageIndex + 1 >= pageCount}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Next
          </button>

          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.max(pageCount - 1, 0) }))}
            disabled={pagination.pageIndex + 1 >= pageCount}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentReport;


