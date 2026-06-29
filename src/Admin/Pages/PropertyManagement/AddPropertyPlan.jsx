import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTable, usePagination } from "react-table";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../Service/adminApi";
import { appConfig } from "../../../config/appConfig";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const InvestmentPlan = () => {
 

  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Resolve image URL properly
  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "/no-image.png";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${appConfig.baseURL}/uploads/${imagePath.replace(/^\/uploads\//, "")}`;
  };

  const { data, isLoading, isError } = useQuery({
  queryKey: ["properties"],
  queryFn: async () => {
    const res = await adminApi.getProperties();

    // ✅ FIXED PATH
    const properties = res?.data?.properties || [];
    const role = res?.data?.role || {};

    console.log("Fetched properties:", properties);

    return {
      properties: properties.map((item) => ({
        property_id: item.property_id || item._id,
        propertyName: item.title,
        category: item.category,
        image: item.images?.length > 0
          ? resolveImageUrl(item.images[0])
          : "",
        images: item.images?.map(img => resolveImageUrl(img)) || [],
        propertyValue: item.total_value_usd,

        // ✅ include both
        canEdit: item.canEdit,
        

        status: item.status,
      })),
      role,
    };
  }, // 🔥 THIS COMMA WAS MISSING

  onError: (err) => {
    toast.error(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch properties"
    );
  },

  staleTime: 5 * 60 * 1000,
});
const investmentPlans = data?.properties || [];
const role = data?.role || "";

  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    setFilteredPlans(investmentPlans);
  }, [investmentPlans]);

  const handleSearch = useCallback(
    debounce((value) => {
      if (value === "") {
        setFilteredPlans(investmentPlans);
      } else {
        const filtered = investmentPlans.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(value.toLowerCase())
          )
        );
        setFilteredPlans(filtered);
      }
    }, 300),
    [investmentPlans]
  );

  const { mutate: deleteProperty, isPending: isDeleting } = useMutation({
    mutationFn: (id) => adminApi.deleteProperty(id),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries(["properties"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty(id);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [[
        "S.No.", "Property ID", "Property Name", "Category",
        "Property Value", "Total Property", "Status"
      ]],
      body: filteredPlans.map((row, index) => [
        index + 1,
        row.property_id,
        row.propertyName,
        row.category,
        row.propertyValue,
        // row.totalProperty,
        row.status,
      ]),
    });
    doc.save("properties.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPlans.map((row, index) => ({
        "S.No.": index + 1,
        "Property ID": row.property_id,
        "Property Name": row.propertyName,
        "Category": row.category,
        "Property Value": row.propertyValue,
        // "Total Property": row.totalProperty,
        "Status": row.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");
    XLSX.writeFile(workbook, "properties.xlsx");
  };

  const isMutating = isDeleting;

  const columns = useMemo(
    () => [
      {
        Header: "S.No.",
        accessor: (_row, i) => i + 1,
        id: "serial",
      },
      {
        Header: "Property ID",
        accessor: "property_id",
      },
      {
        Header: "Property Name",
        accessor: "propertyName",
        Cell: ({ value }) => (
          <div className="max-w-[180px] truncate" title={value}>
            {value}
          </div>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => (
          <span className="px-2 py-1 rounded bg-blue-100 text-[#00a455] text-xs font-semibold">
            {value.replace("_", " ")}
          </span>
        ),
      },
      {
        Header: "Property Image",
        accessor: "image",
        Cell: ({ value }) =>
          value ? (
            <img
              src={value}
              alt="Property"
              className="w-12 h-12 rounded object-cover border"
              onError={(e) => { e.target.src = "/no-image.png"; }}
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          ),
      },
      {
        Header: "Property Value",
        accessor: "propertyValue",
      },
      // {
      //   Header: "Total Property",
      //   accessor: "totalProperty",
      // },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              value === "AVAILABLE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Action",
        Cell: ({ row }) => {
          const isSales = role === "sales_executive";
          const isAdmin = role === "admin";
          const canEdit = row.original?.canEdit;

          const disableEdit = isSales || !canEdit;
          const disableDelete = !isAdmin;

          return (
            <div className="flex gap-2">

              {/* EDIT BUTTON */}
              <button
                onClick={() =>
                  !disableEdit &&
                  navigate(
                    `/admin/property-management/add-property-plan/edit-property/${row.original.property_id}`
                  )
                }
                disabled={disableEdit}
                className={`px-3 py-1.5 rounded transition ${
                  disableEdit
                    ? "bg-gray-400 cursor-not-allowed text-white opacity-70"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FaEdit />
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={() =>
                  !disableDelete && handleDelete(row.original.property_id)
                }
                disabled={disableDelete}
                className={`px-3 py-1.5 rounded transition ${
                  disableDelete
                    ? "bg-gray-400 cursor-not-allowed text-white opacity-70"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                <FaTrash />
              </button>

            </div>
          );
        },
      }
    ],
    [navigate, role]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredPlans,
      initialState: { pageIndex: 0, pageSize: 10 },   // ← Changed to 10
    },
    usePagination
  );
  const totalRecords = filteredPlans.length;
  return (
    <div className="p-1 sm:p-3 flex-1 max-w-[1240px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl droxen-font font-bold text-[#000]">Property Plans</h2>
        <button
          onClick={() =>
            role !== "sales_executive" &&
            navigate("/admin/property-management/add-property-plan/add-property")
          }
          disabled={role === "sales_executive"}
          className={`flex items-center text-xs sm:text-lg gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded transition ${
            role === "sales_executive"
              ? "bg-gray-400 cursor-not-allowed text-white opacity-70"
              : "bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-white hover:brightness-110"
          }`}
        >
          <FaPlus /> Add Property
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xs sm:text-sm disabled:opacity-50 transition"
            disabled={isLoading || isMutating}
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-xs sm:text-sm disabled:opacity-50 transition"
            disabled={isLoading || isMutating}
          >
            Export Excel
          </button>
        </div>

        <div className="flex items-center justify-end w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search plans..."
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
          />
          <button
            onClick={() => handleSearch(searchInput)}
            className="ml-2 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-white px-4 py-2 rounded hover:brightness-110 text-sm transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table
          {...getTableProps()}
          className="min-w-[1600px] w-full text-sm border"
        >
          <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] text-black uppercase">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="p-3 border whitespace-nowrap font-medium"
                    key={column.id}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-600">
                  Loading properties...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-red-600">
                  Error loading data. Please try again.
                </td>
              </tr>
            ) : page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-700">
                  No properties found
                </td>
              </tr>
            ) : (
              page.map((row, index) => {
                prepareRow(row);
                const rowKey = row.original.property_id || `row-${index}`;
                return (
                  <tr
                    {...row.getRowProps()}
                    key={rowKey}
                    className="hover:bg-gray-50 border-b last:border-b-0"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="p-3 border whitespace-nowrap"
                        key={cell.column.id}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div className="text-gray-600">
          {totalRecords === 0
            ? "Showing 0 to 0"
            : `Showing ${pageIndex * pageSize + 1} to`}
          {Math.min((pageIndex + 1) * pageSize, totalRecords)}{" "}
          of {totalRecords} entries
        </div>

        <div className="space-x-2 flex">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            First
          </button>

          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Next
          </button>

          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 border text-xs rounded disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlan;