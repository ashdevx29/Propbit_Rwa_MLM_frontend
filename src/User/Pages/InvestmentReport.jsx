import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { appConfig } from '../../config/appConfig';
import SkeletonLoader from '../Components/Comman/Skeletons';
import { useQuery } from '@tanstack/react-query';
import { useDemoMode } from '../Contexts/DemoModeContext';
import { getDemoData } from '../Data/demoData';
import AgreementTemplate from '../Components/agreement/AgreementTemplate';
import { generateAgreementPDF } from './utils/generateAgreementPDF';

const columnHelper = createColumnHelper();

const InvestmentReport = () => {
  const { isDemoMode } = useDemoMode();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [propertySearch, setPropertySearch] = useState('');

  const [tempStatus, setTempStatus] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempPropertySearch, setTempPropertySearch] = useState('');
  const [selectedAgreementRow, setSelectedAgreementRow] = useState(null);
  const [downloadingAgreementId, setDownloadingAgreementId] = useState(null);

  const fetchInvestments = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found. Please log in.');

    let url = `${appConfig.baseURL}/user/investments?page=${currentPage}&limit=${pageSize}`;
    if (statusFilter) url += `&status=${statusFilter}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (propertySearch) {
      const cleanSearch = encodeURIComponent(propertySearch.trim());
      url += `&propertyId=${cleanSearch}`;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiPlans = response.data.data.investments || [];

    return {
      investments: apiPlans.map(plan => ({
        investmentId: plan._id,
        propertyId: plan.property_id,
        amountUsd: plan.amount_usd,
        areaBought: plan.units_bought,
        amountInr: plan.amount_inr ?? 'NA',
        investmentType: plan.investment_type || 'NA',
        tokensBought: Number(plan.tokens_bought ?? plan.units_bought ?? 0),
        areaBoughtSqft: plan.investment_type === 'SQFT' ? (plan.area_bought_sqft ?? plan.units_bought ?? 'NA') : 'NA',
        slotsBought: plan.investment_type === 'SQFT' ? 'NA' : (plan.slots_bought ?? plan.tokens_bought ?? plan.units_bought ?? 'NA'),

        totalArea: plan.total_area || 'NA',
        pricePerSqft: plan.entry_price || 'NA',
        totalSlots: plan.investment_type === 'PER_SQFT_INVESTMENT' ? 'NA' : (plan.totalSlots || 'NA'),
        pricePerSlot: plan.investment_type === 'PER_SQFT_INVESTMENT' ? 'NA' : (plan.pricePerSlot || 'NA'),

        status: plan.status,
        createdAt: moment(plan.createdAt).utcOffset(330).format('YYYY-MM-DD HH:mm:ss'),
      })),
      total: response.data.data.total || 0,
    };
  };

  const { data = { investments: [], total: 0 }, isLoading, isError, error } = useQuery({
    queryKey: ['investments', currentPage, pageSize, statusFilter, startDate, endDate, propertySearch],
    queryFn: fetchInvestments,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !isDemoMode,
  });

  const { data: kycApiData = null } = useQuery({
    queryKey: ['user-kyc-for-investment-agreement'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.get(`${appConfig.baseURL}/user/get-kyc`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response?.data?.data?.kyc || null;
    },
    enabled: !isDemoMode,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const demoData = getDemoData('investmentReport');

  const filteredDemoData = useMemo(() => {
    let filtered = demoData;
    if (statusFilter) filtered = filtered.filter(row => row.status === statusFilter);
    if (startDate) filtered = filtered.filter(row => moment(row.createdAt).isSameOrAfter(moment(startDate)));
    if (endDate) filtered = filtered.filter(row => moment(row.createdAt).isSameOrBefore(moment(endDate)));
    if (propertySearch)
      filtered = filtered.filter(row =>
        String(row.propertyId)
          .toLowerCase()
          .includes(propertySearch.toLowerCase())
      );

    const startIndex = (currentPage - 1) * pageSize;

    return {
      investments: filtered.slice(startIndex, startIndex + pageSize),
      total: filtered.length,
    };
  }, [demoData, currentPage, pageSize, statusFilter, startDate, endDate, propertySearch]);

  const displayData = isDemoMode ? filteredDemoData : data;
  const totalPages = Math.ceil(displayData.total / pageSize);
  const demoUser = getDemoData('user');

  const selectedKycData = isDemoMode
    ? {
      firstNameAsPerID: demoUser?.name?.split(' ')?.[0] || 'Demo',
      lastNameAsPerID: demoUser?.name?.split(' ')?.slice(1).join(' ') || 'User',
    }
    : kycApiData;

  const hasKycData = Boolean(
    selectedKycData?.firstNameAsPerID
    || selectedKycData?.first_name
    || selectedKycData?.firstName,
  );

  const hasSignature = Boolean(
    selectedKycData?.signature
    || selectedKycData?.signatureImage
    || selectedKycData?.signature_url,
  );

  const canDownloadAgreement = (rowData) => {
    return Number(rowData?.tokensBought ?? rowData?.areaBought ?? 0) > 0 && hasKycData && hasSignature;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusFilter(tempStatus);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setPropertySearch(tempPropertySearch.trim());
    setCurrentPage(1);
  };

  const handleAgreementDownload = async (rowData) => {
    if (!canDownloadAgreement(rowData)) {
      toast.error('Agreement can be downloaded only for purchased tokens with completed KYC and signature.');
      return;
    }

    const uniqueRowId = rowData?.investmentId || rowData?.propertyId;
    const propertyIdentifier = rowData?.propertyId || rowData?.investmentId || 'investment';
    const toastId = toast.loading('Generating agreement PDF...');

    try {
      setDownloadingAgreementId(uniqueRowId);
      setSelectedAgreementRow(rowData);

      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      await generateAgreementPDF({
        rowData,
        kycData: selectedKycData,
        elementId: 'investment-agreement-template',
        fileName: `agreement_${propertyIdentifier}.pdf`,
      });

      toast.update(toastId, {
        render: 'Agreement downloaded successfully.',
        type: 'success',
        isLoading: false,
        autoClose: 2500,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err?.message || 'Failed to generate agreement.',
        type: 'error',
        isLoading: false,
      });
    } finally {
      setDownloadingAgreementId(null);
    }
  };

  const columns = [
    {
      id: 'sno',
      header: 'S.No',
      cell: ({ row }) => (
        <div className="text-left text-sm text-[#0082ED]">
          {row.index + 1 + (currentPage - 1) * pageSize}
        </div>
      ),
    },
    columnHelper.accessor('propertyId', { header: 'Property ID' }),
    columnHelper.accessor('amountUsd', { header: 'Amount INR', cell: info => `₹${info.getValue()}` }),
    columnHelper.accessor('areaBought', { header: 'Units Bought' }),

    columnHelper.accessor('totalArea', { header: 'Total Area' }),
    columnHelper.accessor('pricePerSqft', { header: 'Price / Sqft' }),
    columnHelper.accessor('totalSlots', { header: 'Total Slots' }),
    columnHelper.accessor('pricePerSlot', { header: 'Price / Slot' }),
    {
      id: 'agreement',
      header: 'Agreement',
      cell: ({ row }) => {
        const rowData = row.original;
        const rowIdentifier = rowData?.investmentId || rowData?.propertyId;
        const isDownloading = downloadingAgreementId === rowIdentifier;
        const canDownload = canDownloadAgreement(rowData);

        return (
          <button
            type="button"
            onClick={() => handleAgreementDownload(rowData)}
            disabled={!canDownload || Boolean(downloadingAgreementId)}
            className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition ${
              canDownload
                ? 'border-[#3DB97D] text-[#0F172A] hover:bg-[#4ADD97]/10'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            } ${isDownloading ? 'opacity-70' : ''}`}
            title={canDownload ? 'Download agreement PDF' : 'Tokens, KYC, and signature are required'}
          >
            <HiDownload className="text-base" />
            {isDownloading ? 'Preparing...' : 'PDF'}
          </button>
        );
      },
    },

    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            info.getValue() === 'ACTIVE'
              ? 'bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]/20 text-[#0F172A]'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', { header: 'Created At' }),
  ];

  const table = useReactTable({
    data: displayData.investments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(displayData.investments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'InvestmentReport');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'investment-report.xlsx');
  };

  return (
    <div className="theme-card-style border-gradient text-gray-800 p-6 rounded-md max-w-full mx-auto">
      <div className="flex justify-between mb-6 gap-4 flex-wrap-reverse">
        <h2 className="text-2xl text-[#0F172A] droxen-font">Property Investment Report</h2>
        <button
          onClick={exportToExcel}
          disabled={isLoading || table.getRowModel().rows.length === 0}
          className="px-5 py-2 h-fit text-base border flex items-center justify-center gap-2 border-gray-300 rounded bg-white hover:bg-gray-50 transition disabled:opacity-50"
        >
          <PiMicrosoftExcelLogo className="text-[#0082ED] text-xl" />
          <span>Export to Excel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8 items-end">
        <div>
          <label className="text-sm font-medium text-[#0082ED] mb-1 block">Search Property ID</label>
          <input
            type="text"
            value={tempPropertySearch}
            onChange={(e) => setTempPropertySearch(e.target.value)}
            placeholder="Search property ID..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#0082ED] mb-1 block">Status</label>
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[#0082ED] mb-1 block">Start Date</label>
          <input
            type="date"
            value={tempStartDate}
            onChange={(e) => setTempStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#0082ED] mb-1 block">End Date</label>
          <input
            type="date"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full max-w-[180px] px-6 py-3 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:opacity-90 text-[#0F172A] rounded-xl font-medium transition"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {isError && !isDemoMode ? (
        <p className="text-center text-red-500 py-12">{error?.message || 'Failed to load report'}</p>
      ) : isLoading && !isDemoMode ? (
        <SkeletonLoader variant="table" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)]/25 gued-font text-left border-b border-gray-200 text-[#0082ED] whitespace-nowrap">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-left px-6 py-4 border-b border-gray-200 font-bold"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 border-b last:border-none whitespace-nowrap">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 border-b border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {table.getRowModel().rows.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 py-16">No data found.</p>
          )}
        </div>
      )}

      <div className="mt-6 flex md:flex-row flex-col gap-4 items-center justify-between text-sm">
        <div>
          Page <span className="font-semibold">{currentPage}</span> of {totalPages || 1}
        </div>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none"
        >
          {[10, 20, 30, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>

      {selectedAgreementRow && (
        <div className="fixed -left-[10000px] top-0 pointer-events-none opacity-0">
          <div id="investment-agreement-template">
            <AgreementTemplate rowData={selectedAgreementRow} kycData={selectedKycData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentReport;

