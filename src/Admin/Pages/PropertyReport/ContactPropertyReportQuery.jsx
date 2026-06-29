import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaTimes } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminApi } from "../../Service/adminApi";   // Uncomment when API is ready
import { getPaginationRowModel } from "@tanstack/react-table";

// Reusable Styles
const styles = {
  badge: {
    base: "px-2 py-1 rounded font-medium text-xs",
    green: "bg-green-100 text-green-800 border border-green-300",
    red: "bg-red-100 text-red-800 border border-red-300",
  },
  button: {
    primary: "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black px-4 py-2 rounded hover:bg-[#0e9d52]",
    secondary: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",
    exportPDF: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
    exportExcel: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
    disabled: "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 rounded",
    close: "absolute right-5 top-5 bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600",
  },
};

// Dummy Data (API ready hone tak ke liye)
const dummyProperties = [
  {
    propertyId: "6654637392ab4c6f9d1e8a21",
    landSquareFeet: 1200,
    landPrice: 250000,
    firstName: "Akshay",
    lastName: "Daharwal",
    mobileNumber: "9876543210",
    email: "akshay@gmail.com",
  },
  {
    propertyId: "6654637392ab4c6f9d1e8a22",
    landSquareFeet: 850,
    landPrice: 180000,
    firstName: "Priya",
    lastName: "Sharma",
    mobileNumber: "8765432109",
    email: "priya.sharma@gmail.com",
  },
  {
    propertyId: "6654637392ab4c6f9d1e8a23",
    landSquareFeet: 1500,
    landPrice: 320000,
    firstName: "Rahul",
    lastName: "Verma",
    mobileNumber: "7654321098",
    email: "rahul.verma@gmail.com",
  },
];

const ContactReport = () => {
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
 const [viewProperty, setViewProperty] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const queryClient = useQueryClient();

  // ==================== FETCH DATA (Dummy for now) ====================
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["getPropertyData", pagination.pageIndex, pagination.pageSize, searchInput],
  //   queryFn: async () => {
  //     // TODO: Jab API ban jaye to yahan uncomment kar dena
  //     // const page = pagination.pageIndex + 1;
  //     // const limit = pagination.pageSize;
  //     // const res = await adminApi.getPropertyData(page, limit, searchInput);
  //     // const responseData = res?.data || {};
  //     // return {
  //     //   properties: responseData?.properties || responseData?.data || [],
  //     //   totalPages: responseData?.totalPages || 1,
  //     // };

  //     // Currently returning dummy data
  //     let filtered = dummyProperties;

  //     if (searchInput) {
  //       const term = searchInput.toLowerCase();
  //       filtered = dummyProperties.filter((prop) =>
  //         prop.propertyId.toLowerCase().includes(term) ||
  //         `${prop.firstName} ${prop.lastName}`.toLowerCase().includes(term) ||
  //         prop.email.toLowerCase().includes(term) ||
  //         prop.mobileNumber.includes(term)
  //       );
  //     }

  //     return {
  //       properties: filtered,
  //       totalPages: 1,
  //     };
  //   },
  //   refetchOnWindowFocus: false,
  //   staleTime: 5 * 60 * 1000,
  // });
  
   const { data, isLoading, isError } = useQuery({

    
  queryKey: ["contactFormData", searchInput],
  
  queryFn: async () => {
    const res = await adminApi.getContactFormData(searchInput);
    
    return {
        properties: Array.isArray(res?.data)
        ? res.data                
        : res?.data?.data || [], 
      totalPages: 1,
    };
  },
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000,
});

  const fetchData = data?.properties || [];
  const pageCount = data?.totalPages || 1;

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchInput]);

  // ==================== COLUMNS ====================
  const columns = useMemo(() => [
    {
      accessorKey: "sNo",
      header: "S.No.",
      cell: ({ row, table }) =>
        table.getRowModel().rows.findIndex(r => r.id === row.id) +
        1 +
        table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize,    
    },
    {
      accessorKey: "propertyId",
      header: "Property ID",
      cell: ({ getValue }) => <span className="font-mono text-sm font-medium">{getValue()}</span>,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => {
        const full = `${row.original.firstName || ""} ${row.original.lastName || ""}`.trim();
        return full || "N/A";
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile Number",
    },
    {
      accessorKey: "email",
      header: "Email Address",
    },
   {
  id: "action",
  header: "Action",
  cell: ({ row }) => (
    <button
      onClick={() => handleView(row.original)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm transition"
    >
      View
    </button>
  ),
}
  ], []);

  const table = useReactTable({
    data: fetchData,
    columns,
    state: { pagination },
    onPaginationChange: (updater) => {
      setPagination((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

   const totalPages = table.getPageCount();

  // ==================== EDIT HANDLERS ====================
  const { mutate: updateProperty, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ id, data }) => {
      // TODO: Jab API ready ho to uncomment kar dena
      return await adminApi.updatePropertyData(id, data);
      
      return { success: true }; // Dummy success
    },
    onSuccess: () => {
      toast.success("Property updated successfully.");
      queryClient.invalidateQueries(["getPropertyData"]);
      setEditProperty(null);
    },
    onError: () => toast.error("Failed to update property."),
  });

const handleView = (property) => {
  setViewProperty(property);
};

  // const handleEditChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditProperty((prev) => ({ ...prev, [name]: value }));
  // };

  // const saveEdit = () => {
  //   if (window.confirm("Are you sure you want to save changes?")) {
  //     updateProperty({
  //       id: editProperty.propertyId,
  //       data: editProperty,
  //     });
  //   }
  // };

  // const cancelEdit = () => {
  //   if (window.confirm("Cancel editing? Changes will be lost.")) {
  //     setEditProperty(null);
  //   }
  // };

  // ==================== EXPORT FUNCTIONS ====================
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const exportData = fetchData.map((row) => ({
        "Property ID": row.propertyId,
        "First Name": row.firstName,
        "Last Name": row.lastName,
        "Full Name": `${row.firstName || ""} ${row.lastName || ""}`.trim(),
        "Mobile Number": row.mobileNumber,
        "Email Address": row.email,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Properties");
      XLSX.writeFile(wb, "Property_Management.xlsx");
      toast.success("Exported to Excel successfully!");
    } catch (err) {
      toast.error("Failed to export to Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const cols = ["Property ID", "Full Name", "Mobile", "Email"];
      const rows = fetchData.map((row) => [
        row.propertyId,
        `${row.firstName || ""} ${row.lastName || ""}`.trim() || "N/A",
        row.mobileNumber,
        row.email,
      ]);

      autoTable(doc, {
        head: [cols],
        body: rows,
        startY: 20,
        theme: "striped",
        headStyles: { fillColor: [74, 222, 151], textColor: [0, 0, 0] },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      doc.save("Property_Management.pdf");
      toast.success("Exported to PDF successfully!");
    } catch (err) {
      toast.error("Failed to export to PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading properties...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-600 text-center">Error loading data. Please try again.</div>;
  }

  return (
    <div className="p-4 max-w-[1240px] mx-auto">
      <h2 className="text-3xl font-bold droxen-font mb-6 ">Contact Form Reports</h2>

      {/* Export & Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3">
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            placeholder="Search by Property ID, Name or Email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#4ADD97]"
          />
          <button className={styles.button.primary} onClick={() => {}}>
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-left font-semibold border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getPaginationRowModel().rows.length > 0 ? (
              table.getPaginationRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b last:border-none">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div className="text-gray-600">
          {fetchData.length === 0
            ? "Showing 0 to 0"
            : `Showing ${pagination.pageIndex * pagination.pageSize + 1} to`}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            fetchData.length
          )}{" "}
          of {fetchData.length} entries
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
            disabled={pagination.pageIndex + 1 >= totalPages}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Next
          </button>

          <button
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={pagination.pageIndex + 1 >= totalPages}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {viewProperty && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
      
      <button
        onClick={() => setViewProperty(null)}
        className={styles.button.close}
      >
        <FaTimes size={18} />
      </button>

      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-[#0082ED]">
          View Property Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "propertyId",
            "firstName",
            "lastName",
            "mobile",
            "email",
          ].map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>

              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
                {viewProperty[key] || "N/A"}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={() => setViewProperty(null)}
            className={styles.button.secondary}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ContactReport;