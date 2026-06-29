import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminApi } from "../Service/adminApi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
// icons intentionally omitted; buttons use text labels

const styles = {
  badge: {
    base: "px-2 py-1 rounded font-medium text-xs",
    green: "bg-green-100 text-green-800 border border-green-300",
    red: "bg-red-100 text-red-800 border border-red-300",
    blue: "bg-blue-100 text-blue-800 border border-blue-300",
  },
  button: {
    primary: "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-[#000] px-4 py-2 rounded hover:bg-[#0e9d52]",
    exportPDF: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
    exportExcel: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
    disabled: "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 rounded",
    block: "bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700",
    unblock: "bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700",
  },
};

const AdminUserRoles = () => {
  const [selectedRole, setSelectedRole] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  // Restrict page to admin only
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ FETCH USERS (server-side pagination via managers-sales endpoint)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["managersSales", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const page = pagination.pageIndex + 1;
      const limit = pagination.pageSize;
      const res = await adminApi.getManagerSalesByRole(page, limit);
      const responseData = res?.data?.data ?? res?.data; // support wrappers
      const users = responseData?.users || responseData?.users || [];
      if (!Array.isArray(users)) throw new Error("Invalid response: users array not found");
      const totalPages = responseData?.totalPages ?? responseData?.totalPages ?? -1;
      const totalUsers = responseData?.totalUsers ?? responseData?.totalUsers ?? users.length;
      return { users, totalPages, totalUsers };
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || "Failed to load user data.";
      toast.error(message);
    },
  });

  const fetchData = data?.users || [];
  const pageCount =
    Number.isFinite(Number(data?.totalPages)) && Number(data?.totalPages) > 0
      ? Number(data?.totalPages)
      : -1;
  const hasKnownPageCount = pageCount > 0;
  const canGoNext = hasKnownPageCount
    ? pagination.pageIndex + 1 < pageCount
    : fetchData.length === pagination.pageSize;
  const totalEntries =
    !hasKnownPageCount
      ? pagination.pageIndex * pagination.pageSize + fetchData.length
      : pageCount <= 1
      ? fetchData.length
      : pagination.pageIndex + 1 >= pageCount
      ? pagination.pageIndex * pagination.pageSize + fetchData.length
      : pageCount * pagination.pageSize;

  // ✅ FILTER
  const filteredUsers = useMemo(() => {
    if (selectedRole === "all") return fetchData;
    return fetchData.filter((u) => u.role === selectedRole);
  }, [fetchData, selectedRole]);

  // ✅ ENABLE / DISABLE MUTATION
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await adminApi.updateManagerSalesStatus(id, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully.");
      queryClient.invalidateQueries(["managersSales"]);
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.data?.message || err?.message || "Failed to update user.";
      toast.error(message);
    },
  });

  const handleToggleBlock = (user) => {
    // const id = user.user_id || user.id;
    const id = user.user_id || user._id; 
    const isBlocked = !!user.isBlocked;
    updateUser({ id, data: { isBlocked: !isBlocked } });
  };

  // ✅ BADGES
  const getStatusBadge = (isBlocked) =>
    isBlocked ? `${styles.badge.base} ${styles.badge.red}` : `${styles.badge.base} ${styles.badge.green}`;

  const getRoleBadge = (role) => {
    if (role === "property_manager") return `${styles.badge.base} ${styles.badge.blue}`;
    if (role === "sales_executive") return `${styles.badge.base} ${styles.badge.green}`;
    return styles.badge.base;
  };

  // ✅ EXPORT FUNCTIONS
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      let allUsers = [];
      let page = 1;
      let totalPages = 1;
      const limit = 10;
      while (page <= totalPages) {
        const res = await adminApi.getManagerSalesByRole(page, limit);
        const responseData = res?.data?.data ?? res?.data;
        const usersPage = responseData?.users || [];
        if (!Array.isArray(usersPage)) throw new Error("Invalid response: users array not found");
        allUsers = [...allUsers, ...usersPage];
        totalPages = responseData?.totalPages || 1;
        page++;
      }

      let exportList = allUsers;
      if (selectedRole !== "all") {
        exportList = allUsers.filter((u) => u.role === selectedRole);
      }

      const normalizedAll = exportList.map((u, i) => ({
        "S.No": i + 1,
        Role: u.role,
        ID: u.user_id || u.id,
        "Email Address": u.email || "-",
        "Account Status": u.isBlocked ? "Blocked" : "Active",
      }));

      if (normalizedAll.length === 0) return toast.warn("No data to export.");
      const ws = XLSX.utils.json_to_sheet(normalizedAll);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      XLSX.writeFile(wb, "UserRoles.xlsx");
      toast.success("Exported to Excel successfully.");
    } catch (err) {
      toast.error("Failed to export to Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      let allUsers = [];
      let page = 1;
      let totalPages = 1;
      const limit = 10;
      while (page <= totalPages) {
        const res = await adminApi.getManagerSalesByRole(page, limit);
        const responseData = res?.data?.data ?? res?.data;
        const usersPage = responseData?.users || [];
        if (!Array.isArray(usersPage)) throw new Error("Invalid response: users array not found");
        allUsers = [...allUsers, ...usersPage];
        totalPages = responseData?.totalPages || 1;
        page++;
      }

      let exportList = allUsers;
      if (selectedRole !== "all") {
        exportList = allUsers.filter((u) => u.role === selectedRole);
      }

      if (exportList.length === 0) return toast.warn("No data to export.");
      const doc = new jsPDF();
      const cols = ["S.No", "Role", "Email Address",  "Account Status"];
      const rows = exportList.map((u, i) => [
        i + 1,
        u.role,
       
        u.email || "-",
       
        u.isBlocked ? "Blocked" : "Active",
      ]);
      autoTable(doc, {
        head: [cols],
        body: rows,
        startY: 20,
        theme: "striped",
        headStyles: { fillColor: [16, 57, 68], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
      });
      doc.save("UserRoles.pdf");
      toast.success("Exported to PDF successfully.");
    } catch (err) {
      toast.error("Failed to export to PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // ✅ TABLE COLUMNS
  const normalizedUsers = useMemo(() => {
    return filteredUsers.map((user, index) => ({
      sNo: pagination.pageIndex * pagination.pageSize + index + 1,
      role: user.role,
     
      email: user.email || "-",
      
      isBlocked: !!user.isBlocked,
      raw: user,
    }));
  }, [filteredUsers, pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(() => {
    return [
      { accessorKey: "sNo", header: "S.No.", cell: ({ getValue }) => String(getValue()) },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const val = getValue();
          return <span className={getRoleBadge(val)}>{val}</span>;
        },
      },
      
      { accessorKey: "email", header: "Email Address" },
      
      {
        accessorKey: "isBlocked",
        header: "Account Status",
        cell: ({ getValue }) => (
          <span className={getStatusBadge(getValue())}>{getValue() ? "Blocked" : "Active"}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleBlock(r.raw)}
                className={r.isBlocked ? styles.button.unblock : styles.button.block}
                disabled={isUpdating}
              >
                {r.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          );
        },
      },
    ];
  }, [isUpdating, pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data: normalizedUsers,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading users</p>;

  return (
    <div className="p-2 max-w-[1240px] mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Roles</h2>

      {/* FILTER + EXPORT */}
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4ADD97]"
        >
          <option value="all">All</option>
          <option value="property_manager">Property Manager</option>
          <option value="sales_executive">Sales Executive</option>
        </select>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className={isExporting ? styles.button.disabled : styles.button.exportPDF}
          >
            {isExporting ? "Exporting..." : "Export PDF"}
          </button>
          <button
            onClick={exportToExcel}
            disabled={isExporting}
            className={isExporting ? styles.button.disabled : styles.button.exportExcel}
          >
            {isExporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow-md border border-gray-200 p-2 md:p-4">
        <table className="min-w-[1800px] w-full text-sm border" role="grid">
          <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-2 border">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div className="text-gray-600">
          {totalEntries === 0
            ? "Showing 0 to 0"
            : `Showing ${pagination.pageIndex * pagination.pageSize + 1} to`}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalEntries)} of {totalEntries} entries
        </div>

        <div className="space-x-2 flex">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            First
          </button>

          <button
            onClick={() => table.previousPage()}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!canGoNext}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Next
          </button>

          <button
            onClick={() => hasKnownPageCount && table.setPageIndex(pageCount - 1)}
            disabled={!hasKnownPageCount || pagination.pageIndex + 1 >= pageCount}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserRoles;