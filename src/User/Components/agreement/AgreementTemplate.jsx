import PropTypes from "prop-types";
import moment from "moment";
import logo from "../../../assets/assetsPage/logo.png";
import AgreementPage from "./Agreement";

const getValue = (value, fallback = "NA") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-6 text-sm">
    <span className="font-semibold text-[#1F2937] min-w-[180px]">{label}</span>
    <span className="text-[#0082ED] text-right break-words">{value}</span>
  </div>
);

const Card = ({ title, children }) => (
  <section
    className="border border-gray-200 rounded-lg p-5 bg-white"
    style={{ breakInside: "avoid" }}
  >
    <h2 className="font-bold text-base mb-4 border-b pb-1">{title}</h2>
    {children}
  </section>
);

const AgreementTemplate = ({ rowData = {}, kycData = {} }) => {
  const createdDate = rowData?.createdAt
    ? moment(rowData.createdAt).format("DD MMM YYYY, hh:mm A")
    : "NA";

  const firstName =
    kycData?.firstNameAsPerID ||
    kycData?.first_name ||
    kycData?.firstName ||
    "NA";

  const lastName =
    kycData?.lastNameAsPerID ||
    kycData?.last_name ||
    kycData?.lastName ||
    "NA";

  const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();

  const signatureImage =
    kycData?.signature ||
    kycData?.signatureImage ||
    kycData?.signature_url ||
    null;

  const today = moment().format("DD MMM YYYY");
  const agreementId =
    rowData?.propertyId || rowData?.investmentId || "NA";
  const investmentType = getValue(rowData?.investmentType);

  const isFraction = String(investmentType)
    .toUpperCase()
    .includes("FRACTION");

  const unitsOrSlots = isFraction
    ? getValue(
        rowData?.slotsBought ??
          rowData?.tokensBought ??
          rowData?.areaBought
      )
    : getValue(
        rowData?.areaBought ?? rowData?.tokensBought
      );



  const unitsOrSlotsLabel = isFraction ? "slots" : "Sqft";

  return (
    <div
      id="agreement-template-root"
      className="w-[794px] bg-white text-[#111827] font-serif"
    >
      {/* ================= PAGE 1 ================= */}
      <div id="agreement-page-1">
        <AgreementPage
          showHeader
          headerData={{
            logo,
            date: today,
            id: agreementId,
          }}
        >
          <Card title="1. Agreement Terms">
            <p>
              This Investment Agreement is made on {today} between{" "}
              <strong>GGL UNITRA</strong> and the investor{" "}
              <strong>{fullName}</strong>.
            </p>

            <p className="mt-3">
              The investor hereby confirms the purchase of{" "}
              <strong>
                {unitsOrSlots} {unitsOrSlotsLabel}
              </strong>{" "}
              in the property identified as{" "}
              <strong>{agreementId}</strong> under the{" "}
              <strong>{investmentType}</strong> model.
            </p>

            <p className="mt-3">
              This document serves as an official record of
              ownership and participation.
            </p>

            <p className="mt-3">
              The investor agrees to all platform policies and
              applicable regulations.
            </p>

            <p className="mt-3">
              This agreement is digitally generated and legally
              binding.
            </p>
          </Card>

          <Card title="2. Property Details">
            <div className="space-y-2">
              <Row label="Property ID:" value={getValue(rowData?.propertyId)} />
              <Row label="Investment Type:" value={investmentType} />
              <Row
                label="Amount:"
                value={getValue(
                  rowData?.amountInr !== "NA"
                    ? rowData?.amountInr
                    : rowData?.amountUsd
                )}
              />
              <Row label="Total Area:" value={getValue(rowData?.totalArea)} />
              <Row label="Per Sqft Price:" value={getValue(rowData?.pricePerSqft)} />
              <Row
                label="Slots Bought:"
                value={getValue(
                  rowData?.slotsBought ??
                    rowData?.tokensBought ??
                    rowData?.areaBought
                )}
              />
              <Row label="Price per Slot:" value={getValue(rowData?.pricePerSlot)} />
              <Row label="Status:" value={getValue(rowData?.status)} />
              <Row label="Created At:" value={createdDate} />
            </div>
          </Card>

          <Card title="3. Investor (KYC)">
            <div className="space-y-2">
              <Row label="First Name:" value={firstName} />
              <Row label="Last Name:" value={lastName} />
            </div>
          </Card>
        </AgreementPage>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div id="agreement-page-2">
        <AgreementPage
          showHeader
          headerData={{
            logo,
            date: today,
            id: agreementId,
          }}
        >
          <Card title="4. Signatures">
            <div className="flex justify-between mt-16 min-h-[200px]">
              {/* Investor */}
              <div className="text-center w-1/2">
                {signatureImage ? (
                  <img
                    src={signatureImage}
                    alt="Investor Signature"
                    className="h-16 max-w-[160px] mx-auto mb-2 object-contain"
                  />
                ) : (
                  <div className="h-16 flex items-center justify-center text-gray-400 italic">
                    {fullName}
                  </div>
                )}

                <div className="border-t mt-4 pt-2 text-xs">
                  Investor
                </div>
              </div>

              {/* Company */}
              <div className="text-center w-1/2">
                <div className="h-16"></div>

                <div className="border-t mt-4 pt-2 text-xs">
                  Authorized Signatory <br />
                  <span className="text-gray-500">
                    For GGL UNITRA
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </AgreementPage>
      </div>
    </div>
  );
};

AgreementTemplate.propTypes = {
  rowData: PropTypes.object,
  kycData: PropTypes.object,
};

export default AgreementTemplate;