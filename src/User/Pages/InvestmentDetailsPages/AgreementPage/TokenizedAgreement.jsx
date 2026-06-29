import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function TokenAgreementForm() {
  const sigRef = useRef();
  const companySigRef = useRef();

  const [form, setForm] = useState({
    date: "",
    investorName: "",
    passport: "",
    address: "",
    investmentAmount: "",
    tokenPrice: "",
    totalTokens: "",
    companyRep: "",
  });

  const [investorSignature, setInvestorSignature] = useState(null);
  const [companySignature, setCompanySignature] = useState(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setForm((p) => ({ ...p, date: today }));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const input =
    "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none";

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-16 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-blue-700 to-secondary text-white p-8 rounded-t-2xl">
          <h1 className="text-3xl font-bold">
            TOKENIZED PROPERTY INVESTMENT AGREEMENT
          </h1>
          <p className="opacity-80 text-sm">
            GGL UNITRA â€“ Smart Property Investment Platform
          </p>
        </div>

        {/* BODY */}
        <div className="p-10 text-black leading-relaxed space-y-8">

          <p>
            This Agreement is entered into on{" "}
            <span className="font-semibold">{form.date}</span>.
          </p>

          {/* ================= 1 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">1. Parties</h2>

            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
              <p className="font-semibold">Company</p>
              <p>GGL UNITRA / URBANRWA</p>
              <p>White Cloud Solutions LLC</p>
              <p>N9 Richard Holbrook Street, 74A ISANI, Tbilisi, Georgia</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Investor Name</label>
                <input
                  name="investorName"
                  value={form.investorName}
                  onChange={handleChange}
                  className={input}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Passport / ID</label>
                <input
                  name="passport"
                  value={form.passport}
                  onChange={handleChange}
                  className={input}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={input}
                />
              </div>
            </div>
          </div>

          {/* ================= 2 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              2. Purpose of Agreement
            </h2>
            <p>
              The Investor invests in tokenized real estate assets listed on
              the platform and receives tokens representing fractional economic
              interest.
            </p>
          </div>

          {/* ================= 3 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              3. Nature of Tokenized Property
            </h2>
            <p>3.1 Tokens represent economic interest.</p>
            <p>3.2 No direct physical ownership unless specified.</p>
            <p>3.3 Legal ownership remains with SPV / owner.</p>
          </div>

          {/* ================= 4 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              4. Investment Details
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Investment Amount (INR)
                </label>
                <input
                  name="investmentAmount"
                  value={form.investmentAmount}
                  onChange={handleChange}
                  className={input}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Token Price (INR)
                </label>
                <input
                  name="tokenPrice"
                  value={form.tokenPrice}
                  onChange={handleChange}
                  className={input}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Total Tokens</label>
                <input
                  name="totalTokens"
                  value={form.totalTokens}
                  onChange={handleChange}
                  className={input}
                />
              </div>
            </div>

            <p className="mt-4 text-sm">
              Tokens shall be credited after successful payment confirmation.
            </p>
          </div>

          {/* ================= 5 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              5. Monthly Returns
            </h2>
            <ul className="list-disc pl-6">
              <li>Rental income</li>
              <li>Operational profit share</li>
              <li>Other property-based income</li>
            </ul>
          </div>

          {/* ================= 6 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              6. Lock-In Period
            </h2>
            <p>25 months from allocation.</p>
          </div>

          {/* ================= 7 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              7. Platform Responsibilities
            </h2>
            <ul className="list-disc pl-6">
              <li>Token issuance & records</li>
              <li>Dashboard & reporting</li>
              <li>Return distribution</li>
              <li>Transparency</li>
            </ul>
          </div>

          {/* ================= 8 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              8. Investor Declarations
            </h2>
            <ul className="list-disc pl-6">
              <li>Funds legally sourced</li>
              <li>Risks understood</li>
              <li>Voluntary participation</li>
              <li>Information reviewed</li>
            </ul>
          </div>

          {/* ================= 9 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              9. Compliance & KYC
            </h2>
            <p>KYC / AML completion required.</p>
          </div>

          {/* ================= 10 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              10. Confidentiality
            </h2>
            <p>Information remains confidential unless required by law.</p>
          </div>

          {/* ================= 11 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              11. Governing Law
            </h2>
            <p>Laws of Georgia apply.</p>
          </div>

          {/* ================= 12 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              12. Termination
            </h2>
            <ul className="list-disc pl-6">
              <li>Completion of term</li>
              <li>Mutual consent</li>
              <li>Legal requirement</li>
              <li>Fraud or breach</li>
            </ul>
          </div>

          {/* ================= 13 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              13. Entire Agreement
            </h2>
            <p>Supersedes all prior discussions.</p>
          </div>

          {/* ================= 14 ================= */}
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">
              14. Signatures
            </h2>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Company */}
              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-2">
                  For GGL UNITRA / White Cloud Solutions LLC
                </p>

                <label className="text-sm font-medium">Representative Name</label>
                <input
                  name="companyRep"
                  value={form.companyRep}
                  onChange={handleChange}
                  className={input}
                />

                {!companySignature ? (
                  <>
                    <SignatureCanvas
                      ref={companySigRef}
                      penColor="black"
                      canvasProps={{
                        width: 300,
                        height: 120,
                        className: "border rounded bg-white mt-3",
                      }}
                    />
                    <button
                      onClick={() =>
                        setCompanySignature(
                          companySigRef.current.toDataURL()
                        )
                      }
                      className="mt-2 px-4 py-2 bg-gradient-to-br from-blue-700 to-secondary text-white rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <img src={companySignature} alt="" className="h-20 mt-3" />
                )}

                <p className="mt-2 text-sm">Date: {form.date}</p>
              </div>

              {/* Investor */}
              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-2">Investor</p>

                {!investorSignature ? (
                  <>
                    <SignatureCanvas
                      ref={sigRef}
                      penColor="black"
                      canvasProps={{
                        width: 300,
                        height: 120,
                        className: "border rounded bg-white",
                      }}
                    />
                    <button
                      onClick={() =>
                        setInvestorSignature(sigRef.current.toDataURL())
                      }
                      className="mt-2 px-4 py-2 bg-gradient-to-br from-blue-700 to-secondary text-white rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <img src={investorSignature} alt="" className="h-20" />
                )}

                <p className="mt-2 text-sm">Date: {form.date}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}




// import { useState, useRef, useEffect } from "react";
// import SignatureCanvas from "react-signature-canvas";

// export default function TokenAgreementForm() {
//   const sigRef = useRef();

//   const [form, setForm] = useState({
//     date: "",
//     investorName: "",
//     passport: "",
//     address: "",
//     investmentAmount: "",
//     tokenPrice: "",
//     totalTokens: "",
//   });

//   const [signature, setSignature] = useState(null);

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setForm((p) => ({ ...p, date: today }));
//   }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const saveSignature = () => {
//     if (!sigRef.current.isEmpty()) {
//       setSignature(sigRef.current.toDataURL("image/png"));
//     }
//   };

//   const clearSignature = () => {
//     sigRef.current.clear();
//     setSignature(null);
//   };

//   const inputStyle =
//     "border-b border-black focus:outline-none px-1 bg-transparent min-w-[120px]";

//   return (
//     <div className="min-h-screen bg-[#F4F6FB] py-16 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 text-black leading-relaxed">

//         {/* Title */}
//         <h1 className="text-center text-3xl font-bold">
//           TOKENIZED PROPERTY INVESTMENT AGREEMENT
//         </h1>
//         <p className="text-center mb-8">
//           (URBAN RWA â€“ Smart Property Investment Platform)
//         </p>

//         {/* Intro */}
//         <p className="mb-8">
//           This Tokenized Property Investment Agreement (â€œAgreementâ€) is entered
//           into on <span className="font-semibold">{form.date}</span>.
//         </p>

//         {/* Divider */}
//         <hr className="my-6" />

//         {/* 1 */}
//         <h2 className="font-semibold text-lg mb-3">1. Parties</h2>

//         <p className="font-semibold mt-3">Company</p>
//         <p>URBAN RWA / URBANRWA, operated by White Cloud Solutions LLC,</p>
//         <p>Office Address:</p>
//         <p>N9 Richard Holbrook Street, 74A ISANI, Tbilisi, Georgia</p>
//         <p>(hereinafter referred to as â€œURBANRWAâ€ or â€œPlatformâ€)</p>

//         <p className="font-semibold mt-6">Investor</p>
//         <p>
//           Name:{" "}
//           <input
//             name="investorName"
//             value={form.investorName}
//             onChange={handleChange}
//             className={inputStyle}
//           />
//         </p>
//         <p>
//           Passport / ID No.:{" "}
//           <input
//             name="passport"
//             value={form.passport}
//             onChange={handleChange}
//             className={inputStyle}
//           />
//         </p>
//         <p>
//           Address:{" "}
//           <input
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             className="border-b border-black focus:outline-none px-1 w-[60%]"
//           />
//         </p>
//         <p>(hereinafter referred to as â€œInvestorâ€)</p>

//         <hr className="my-6" />

//         {/* 2 */}
//         <h2 className="font-semibold text-lg mb-3">2. Purpose of Agreement</h2>
//         <p>
//           This Agreement defines the terms under which the Investor invests in
//           tokenized real estate assets listed on the URBANRWA platform and
//           receives digital property tokens representing a fractional economic
//           interest in the underlying property.
//         </p>

//         <hr className="my-6" />

//         {/* 3 */}
//         <h2 className="font-semibold text-lg mb-3">3. Nature of Tokenized Property</h2>
//         <p>3.1 Each token represents a fractional economic interest.</p>
//         <p>3.2 Tokens do not represent direct physical ownership unless stated.</p>
//         <p>3.3 Legal ownership remains with the property holding entity / SPV / owner.</p>

//         <hr className="my-6" />

//         {/* 4 */}
//         <h2 className="font-semibold text-lg mb-3">4. Investment Details</h2>

//         <p>
//           â€¢ Investment Amount: INR{" "}
//           <input
//             name="investmentAmount"
//             value={form.investmentAmount}
//             onChange={handleChange}
//             className={inputStyle}
//           />
//         </p>

//         <p>
//           â€¢ Token Price: INR{" "}
//           <input
//             name="tokenPrice"
//             value={form.tokenPrice}
//             onChange={handleChange}
//             className={inputStyle}
//           />{" "}
//           per token
//         </p>

//         <p>
//           â€¢ Total Tokens Issued:{" "}
//           <input
//             name="totalTokens"
//             value={form.totalTokens}
//             onChange={handleChange}
//             className={inputStyle}
//           />{" "}
//           Tokens
//         </p>

//         <p className="mt-3">
//           Tokens shall be credited to the Investorâ€™s URBANRWA account wallet
//           after successful payment confirmation.
//         </p>

//         <hr className="my-6" />

//         {/* 5 */}
//         <h2 className="font-semibold text-lg mb-3">5. Monthly Returns</h2>
//         <p>5.1 Investor eligible for monthly returns.</p>
//         <p className="mt-2">5.2 May include:</p>
//         <ul className="list-disc pl-6">
//           <li>Rental income</li>
//           <li>Operational profit share</li>
//           <li>Other property-based income</li>
//         </ul>
//         <p className="mt-2">
//           5.3 Returns credited to wallet or payout method as per policy.
//         </p>

//         <hr className="my-6" />

//         {/* 6 */}
//         <h2 className="font-semibold text-lg mb-3">6. Lock-In Period</h2>
//         <p>6.1 25 months from allocation.</p>
//         <p>6.2 Withdrawal restrictions apply.</p>
//         <p>6.3 Investor may hold or exit after completion.</p>

//         <hr className="my-6" />

//         {/* 7 */}
//         <h2 className="font-semibold text-lg mb-3">7. Platform Responsibilities</h2>
//         <ul className="list-disc pl-6">
//           <li>Manage token issuance</li>
//           <li>Provide dashboard & reports</li>
//           <li>Distribute returns</li>
//           <li>Maintain transparency</li>
//         </ul>

//         <hr className="my-6" />

//         {/* 8 */}
//         <h2 className="font-semibold text-lg mb-3">8. Investor Declarations</h2>
//         <ul className="list-disc pl-6">
//           <li>Funds legally sourced</li>
//           <li>Understands tokenized investment</li>
//           <li>Voluntary participation</li>
//           <li>Information reviewed</li>
//         </ul>

//         <hr className="my-6" />

//         {/* 9 */}
//         <h2 className="font-semibold text-lg mb-3">9. Compliance & KYC</h2>
//         <p>
//           Investor must complete KYC / AML. Failure may result in restrictions.
//         </p>

//         <hr className="my-6" />

//         {/* 10 */}
//         <h2 className="font-semibold text-lg mb-3">10. Confidentiality</h2>
//         <p>Information remains confidential unless required by law.</p>

//         <hr className="my-6" />

//         {/* 11 */}
//         <h2 className="font-semibold text-lg mb-3">11. Governing Law & Jurisdiction</h2>
//         <p>Laws of Georgia apply.</p>

//         <hr className="my-6" />

//         {/* 12 */}
//         <h2 className="font-semibold text-lg mb-3">12. Termination</h2>
//         <ul className="list-disc pl-6">
//           <li>Completion of term</li>
//           <li>Mutual consent</li>
//           <li>Legal requirement</li>
//           <li>Fraud or breach</li>
//         </ul>

//         <hr className="my-6" />

//         {/* 13 */}
//         <h2 className="font-semibold text-lg mb-3">13. Entire Agreement</h2>
//         <p>Supersedes all prior discussions.</p>

//         <hr className="my-6" />

//         {/* 14 */}
//         <h2 className="font-semibold text-lg mb-3">14. Investor Signature</h2>

//         {!signature ? (
//           <>
//             <SignatureCanvas
//               ref={sigRef}
//               penColor="black"
//               canvasProps={{
//                 width: 350,
//                 height: 120,
//                 className: "border rounded",
//               }}
//             />
//             <div className="flex gap-3 mt-2">
//               <button
//                 onClick={saveSignature}
//                 className="px-4 py-2 bg-black text-white rounded"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={clearSignature}
//                 className="px-4 py-2 border rounded"
//               >
//                 Clear
//               </button>
//             </div>
//           </>
//         ) : (
//           <img src={signature} alt="signature" className="h-24" />
//         )}

//         <p className="mt-3">
//           Date: <span className="font-semibold">{form.date}</span>
//         </p>

//       </div>
//     </div>
//   );
// }

