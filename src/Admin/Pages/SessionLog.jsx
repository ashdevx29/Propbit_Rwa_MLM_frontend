import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../Service/adminApi";
import { toast } from "react-toastify";

const SessionLog = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // derive logged-in user info from storage / token
  const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role") || "";
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    null;

  const parseJwt = (t) => {
    try {
      const payload = t.split(".")[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decodeURIComponent(
        decoded
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      ));
    } catch (e) {
      return null;
    }
  };

  const jwtPayload = token ? parseJwt(token) : null;
  const loggedUser = {
    id: jwtPayload?.id || jwtPayload?._id || jwtPayload?.userId || jwtPayload?.user_id || jwtPayload?.sub || null,
    role: storedRole || jwtPayload?.role || "",
  };

  const { data: sessions = [], isLoading, isError, error } = useQuery({
    queryKey: ["sessionLog"],
    queryFn: async () => {
      const res = await adminApi.getSessionLog();
      const sessionsData = res?.data?.loginLogs;
      if (!Array.isArray(sessionsData)) {
        throw new Error("Invalid response: sessions array not found");
      }
      return sessionsData;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Dynamic columns based on response
  const columns = useMemo(() => {
    const baseColumns = [{ Header: "S.No.", accessor: "sno" }];
    if (sessions.length > 0) {
      const sampleSession = sessions[0];
      const dynamicColumns = Object.keys(sampleSession)
        .filter((key) => key !== "_id")
        .map((key) => ({
          Header: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
          accessor: key,
          Cell: key.toLowerCase().includes("time")
            ? ({ value }) => new Date(value).toLocaleString()
            : key.toLowerCase().includes("amount")
            ? ({ value }) => `₹${ Number(value).toFixed(2) } `
            : undefined,
        }));
      return [...baseColumns, ...dynamicColumns];
    }
    return baseColumns;
  }, [sessions]);

  // Role-based visibility: admin sees all, others see only their own logs
 const filteredByRoleSessions = useMemo(() => {
  if (!loggedUser.role || String(loggedUser.role) === "admin") return sessions;

  return sessions.filter(
    (session) => String(session.adminId) === String(loggedUser.id)
  );
}, [sessions, loggedUser]);

  const filteredSessions = useMemo(() => {
    if (!searchInput) return filteredByRoleSessions;
    return filteredByRoleSessions.filter((item) =>
      Object.keys(item)
        .filter((key) => key !== "_id")
        .some((key) =>
          String(item[key]).toLowerCase().includes(searchInput.toLowerCase())
        )
    );
  }, [searchInput, filteredByRoleSessions]);

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredSessions.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!filteredSessions.length) {
      toast.error("No data to export", { position: "top-right" });
      return;
    }
    const tableColumn = columns.map((col) => col.Header);
    const tableRows = filteredSessions.map((item, index) => [
      index + 1,
      ...columns
        .filter((col) => col.accessor !== "sno")
        .map((col) =>
          col.Cell ? col.Cell({ value: item[col.accessor] }) : item[col.accessor]
        ),
    ]);
    const doc = new jsPDF();
    doc.text("Admin Session Log", 14, 10);
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save("admin_session_log.pdf");
  };

  // Export Excel
  const handleExportExcel = () => {
    if (!filteredSessions.length) {
      toast.error("No data to export", { position: "top-right" });
      return;
    }
    const excelData = filteredSessions.map((item, index) => {
      const row = { "S.No.": index + 1 };
      columns
        .filter((col) => col.accessor !== "sno")
        .forEach((col) => {
          row[col.Header] = col.Cell
            ? col.Cell({ value: item[col.accessor] })
            : item[col.accessor];
        });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AdminSessionLog");
    XLSX.writeFile(workbook, "admin_session_log.xlsx");
  };

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#0082ED]">
          Session Log
        </h2>
        <p className="text-gray-600">Loading session log...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 max-w-[1260px] mx-auto">
        <h2 className="text-2xl font-bold mb-4 droxen-font">
          Session Log
        </h2>
        <p className="text-red-600">
          Error: {error?.message || "Failed to load session log data."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 droxen-font">
        Session Log
      </h2>

      {/* Export + Search Controls */}
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
            placeholder="Search..."
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
            aria-label="Search session log records"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000] uppercase">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="px-4 py-2 whitespace-nowrap">
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.length > 0 ? (
              currentRows.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-2 whitespace-nowrap">
                      {col.accessor === "sno"
                        ? startIndex + index + 1
                        : col.Cell
                        ? col.Cell({ value: item[col.accessor] })
                        : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-6 py-8 text-gray-500 text-sm"
                >
                  No session log records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div className="text-gray-600">
          {filteredSessions.length === 0
            ? "Showing 0 to 0"
            : `Showing ${(currentPage - 1) * rowsPerPage + 1} to`}
          {Math.min(currentPage * rowsPerPage, filteredSessions.length)}{" "}
          of {filteredSessions.length} entries
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

export default SessionLog;