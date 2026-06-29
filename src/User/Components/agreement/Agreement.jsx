const AgreementPage = ({ children, showHeader = false, showFooter = true, headerData }) => {
  return (
    <div className="min-h-[1120px] flex flex-col bg-white">

      {/* HEADER (optional) */}
      {showHeader && (
        <div className="bg-gradient-to-r from-[#4ADD97]/40 to-[#3DB97D]/20 p-6 border-b">
          <div className="flex justify-between items-center">
            <img src={headerData.logo} alt="Logo" className="h-12" />

            <div className="text-right">
              <h1 className="text-xl font-bold tracking-wide">
                INVESTMENT AGREEMENT
              </h1>
              <p className="text-xs mt-1">Date: {headerData.date}</p>
              <p className="text-xs">Agreement ID: {headerData.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-8 flex-grow space-y-8 text-sm leading-6">
        {children}
      </div>

      {/* FOOTER */}
      {showFooter && (
        <div className="border-t pt-3 text-center text-xs text-gray-500 mb-4">
          <p>GGL UNITRA</p>
          <p>This is a legally binding agreement</p>
        </div>
      )}
    </div>
  );
};

export default AgreementPage;