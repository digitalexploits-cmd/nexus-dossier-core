// One-click download helpers for credentials and evidence cards.
// Certificates: pull the original PDF from Google Drive via the direct
// download endpoint. Evidence cards: mint a small PDF client-side with
// embedded document metadata (title, author, subject, keywords).

import { jsPDF } from "jspdf";
import type { OfficialCertification } from "@/data/officialCertifications";
import type { EvidenceCard } from "@/data/content";
import { BRAND } from "@/data/content";

/** Google Drive direct-download endpoint for a file id. */
export const driveDownloadUrl = (id: string) =>
  `https://drive.google.com/uc?export=download&id=${id}`;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);

/** Trigger a browser download for a URL under a suggested filename. */
const triggerDownload = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  // Drive requires target=_blank fallback for some browsers/large files.
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/** One-click download for a certification — pulls the original PDF from Drive. */
export const downloadCertificate = (c: OfficialCertification) => {
  const filename = `${slug(`${c.issuer}-${c.title}`)}.pdf`;
  triggerDownload(driveDownloadUrl(c.driveId), filename);
};

/**
 * Generate a metadata-embedded PDF summary for an evidence card and
 * trigger a one-click download. If the card has an `href` that ends in
 * `.pdf` we defer to that file instead.
 */
export const downloadEvidenceCard = (e: EvidenceCard) => {
  if (e.href && /\.pdf($|\?)/i.test(e.href)) {
    triggerDownload(e.href, `${slug(e.title)}.pdf`);
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "letter" });

  // Embedded document metadata.
  doc.setProperties({
    title: e.title,
    subject: `Evidence card ${e.id.toUpperCase()} — ${e.type} — ${e.status}`,
    author: `${BRAND.founder} · ${BRAND.company}`,
    keywords: [
      "Nexus",
      "Evidence Vault",
      `Bay ${e.bay}`,
      e.type,
      e.status,
      `Audience:${e.audience}`,
      e.id.toUpperCase(),
    ].join(", "),
    creator: `${BRAND.platform} · ${BRAND.company}`,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 54;
  let y = margin;

  // Header band
  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, pageW, 96, "F");
  doc.setTextColor(140, 210, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    `05 · EVIDENCE VAULT · ${e.id.toUpperCase()}`,
    margin,
    40,
  );
  doc.setTextColor(238, 246, 255);
  doc.setFontSize(18);
  doc.text(e.title, margin, 72, { maxWidth: pageW - margin * 2 });

  y = 132;
  doc.setDrawColor(80, 160, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 24;

  // Meta grid
  const meta: Array<[string, string]> = [
    ["BAY", `${e.bay} — ${e.type}`],
    ["STATUS", e.status],
    ["AUDIENCE", e.audience],
    ["ISSUED", new Date().toISOString().slice(0, 10)],
  ];
  doc.setFontSize(8);
  meta.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * ((pageW - margin * 2) / 2);
    const yy = y + row * 34;
    doc.setTextColor(140, 165, 190);
    doc.setFont("helvetica", "bold");
    doc.text(label, x, yy);
    doc.setTextColor(238, 246, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(value, x, yy + 14);
    doc.setFontSize(8);
  });
  y += 90;

  // Claim
  doc.setTextColor(140, 165, 190);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CLAIM", margin, y);
  y += 16;
  doc.setTextColor(238, 246, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const claimLines = doc.splitTextToSize(e.claim, pageW - margin * 2);
  doc.text(claimLines, margin, y);
  y += claimLines.length * 16 + 24;

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - margin;
  doc.setDrawColor(80, 160, 255);
  doc.line(margin, footerY - 24, pageW - margin, footerY - 24);
  doc.setFontSize(8);
  doc.setTextColor(140, 165, 190);
  doc.text(
    `${BRAND.company} · ${BRAND.platform} · ${BRAND.contactEmail}`,
    margin,
    footerY - 8,
  );
  doc.text(
    `Generated ${new Date().toISOString()}`,
    pageW - margin,
    footerY - 8,
    { align: "right" },
  );

  doc.save(`${slug(`${e.id}-${e.title}`)}.pdf`);
};
