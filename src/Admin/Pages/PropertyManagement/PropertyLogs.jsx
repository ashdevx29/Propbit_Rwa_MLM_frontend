import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../Service/adminApi";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const rowsPerPageDefault = 10;

const formatDate = (d) => {
  if (!d) return "N/A";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

const PropertyLogs = () => {
  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/admin" replace />;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = rowsPerPageDefault;

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: logsRaw = [], isLoading, isError, error } = useQuery({
    queryKey: ["propertyLogs", debouncedSearch],
    queryFn: async () => {
      // Try to use backend filter by propertyId if provided
      const res = await adminApi.getPropertyLogs(debouncedSearch || "");
      // Attempt to extract logs array from common response shapes
      const payload = res?.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.propertyLogs)) return payload.propertyLogs;
      if (Array.isArray(payload?.logs)) return payload.logs;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Ensure we always have array
  const logs = Array.isArray(logsRaw) ? logsRaw : [];

  // Client-side filter by property_id if backend didn't filter
  const filteredLogs = useMemo(() => {
    if (!debouncedSearch) return logs;
    return logs.filter((l) => String(l.property_id || "").toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [logs, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / rowsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredLogs.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const mapActionLabel = (action) => {
    if (!action) return "N/A";
    const a = String(action).toLowerCase();
    if (a.includes("add")) return "Add";
    if (a.includes("edit")) return "Edit";
    if (a.includes("delete")) return "Delete";
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const handleExportPDF = () => {
    if (!filteredLogs.length) {
      toast.error("No data to export", { position: "top-right" });
      return;
    }
    const head = ["Sr. No.", "Property ID", "User ID", "User Role", "Action", "Date"];
    const body = filteredLogs.map((item, idx) => [
      idx + 1,
      item.property_id || "N/A",
      item.user_id || "N/A",
      item.user_role || "N/A",
      mapActionLabel(item.action),
      formatDate(item.timestamp),
    ]);

    const doc = new jsPDF();
    doc.text("Property Logs", 14, 10);
    autoTable(doc, { head: [head], body });
    doc.save("property_logs.pdf");
  };

  const handleExportExcel = () => {
    if (!filteredLogs.length) {
      toast.error("No data to export", { position: "top-right" });
      return;
    }
    const excelData = filteredLogs.map((item, idx) => ({
      "Sr. No.": idx + 1,
      "Property ID": item.property_id || "N/A",
      "User ID": item.user_id || "N/A",
      "User Role": item.user_role || "N/A",
      Action: mapActionLabel(item.action),
      Date: formatDate(item.timestamp),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PropertyLogs");
    XLSX.writeFile(workbook, "property_logs.xlsx");
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#0082ED]">Property Logs</h2>
        <p className="text-gray-600">Loading property logs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-2xl font-bold mb-4 droxen-font">Property Logs</h2>
        <p className="text-red-600">Error: {error?.message || "Failed to load property logs."}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 droxen-font">Property Logs</h2>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <button
            onClick={handleExportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 text-sm"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
          >
            Export Excel
          </button>
        </div>

        <div className="flex items-center justify-end">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Property ID..."
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
            aria-label="Search property logs by property id"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000] uppercase">
            <tr>
              <th className="px-4 py-2">Sr. No.</th>
              <th className="px-4 py-2">Property ID</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">User Role</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.length > 0 ? (
              currentRows.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{startIndex + idx + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.property_id || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.user_id || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.user_role || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{mapActionLabel(item.action)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(item.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center px-6 py-8 text-gray-500 text-sm">
                  No property log records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div className="text-gray-600">
          {filteredLogs.length === 0
            ? "Showing 0 to 0"
            : `Showing ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, filteredLogs.length)} of ${filteredLogs.length} entries`}
        </div>

        <div className="space-x-2 flex">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            First
          </button>

          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Next
          </button>

          <button
            onClick={() => setCurrentPage(totalPages || 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyLogs;
