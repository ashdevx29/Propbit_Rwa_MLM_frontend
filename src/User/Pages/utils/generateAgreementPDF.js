import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const waitForAssets = async (element) => {
  if (!element) return;

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {}
  }

  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
};

export const generateAgreementPDF = async ({
  rowData,
  kycData,
  elementId = "investment-agreement-template",
  fileName,
}) => {
  const rootElement = document.getElementById(elementId);
  if (!rootElement) {
    throw new Error("Agreement template element not found.");
  }

  // 🔥 IMPORTANT: We now expect 2 sections inside template
  const page1 = rootElement.querySelector("#agreement-page-1");
  const page2 = rootElement.querySelector("#agreement-page-2");

  if (!page1) {
    throw new Error("Page 1 template not found.");
  }

  await waitForAssets(rootElement);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  // =======================
  // ✅ PAGE 1
  // =======================
  const canvas1 = await html2canvas(page1, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const img1 = canvas1.toDataURL("image/png", 1.0);

  pdf.addImage(
    img1,
    "PNG",
    margin,
    margin,
    contentWidth,
    (canvas1.height * contentWidth) / canvas1.width,
    undefined,
    "FAST"
  );

  // =======================
  // ✅ PAGE 2 (ONLY IF NEEDED)
  // =======================
  const signatureImage =
    kycData?.signature ||
    kycData?.signatureImage ||
    kycData?.signature_url ||
    null;

  if (signatureImage && page2) {
    await waitForAssets(page2);

    pdf.addPage();

    const canvas2 = await html2canvas(page2, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const img2 = canvas2.toDataURL("image/png", 1.0);

    pdf.addImage(
      img2,
      "PNG",
      margin,
      margin,
      contentWidth,
      (canvas2.height * contentWidth) / canvas2.width,
      undefined,
      "FAST"
    );
  }

  // =======================
  // FILE NAME
  // =======================
  const propertyIdentifier =
    rowData?.propertyId || rowData?.investmentId || "investment";

  const finalFileName =
    fileName || `agreement_${propertyIdentifier}.pdf`;

  pdf.save(finalFileName);
};

export default generateAgreementPDF;