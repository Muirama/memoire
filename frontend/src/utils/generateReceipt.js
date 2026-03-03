import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Génère et télécharge automatiquement un reçu PDF.
 *
 * @param {Object} order   - Données de la commande retournées par l'API
 * @param {Array}  items   - Articles du panier (avant clearCart)
 * @param {Object} customer - Infos client du formulaire
 */
export function generateReceipt({ order, items, customer }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-MG").format(price) + " Ar";

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 0;

  // ══════════════════════════════════════════════════
  // HEADER — Fond rouge Gascom
  // ══════════════════════════════════════════════════
  doc.setFillColor(229, 9, 20);
  doc.rect(0, 0, pageW, 42, "F");

  // Nom entreprise
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("GASCOM", margin, 20);

  // Sous-titre
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("E-Sport & Gaming Store", margin, 28);

  // RECU à droite
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("RECU", pageW - margin, 18, { align: "right" });

  // Numéro reçu
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N° #${order.id}`, pageW - margin, 26, { align: "right" });

  y = 55;

  // ══════════════════════════════════════════════════
  // DATE & HEURE
  // ══════════════════════════════════════════════════
  const dateCommande = order.createdAt ? new Date(order.createdAt) : new Date();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Date de la commande :", margin, y);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${formatDate(dateCommande)}  à  ${formatTime(dateCommande)}`,
    margin + 42,
    y,
  );

  y += 14;

  // ══════════════════════════════════════════════════
  // LIGNE SÉPARATRICE
  // ══════════════════════════════════════════════════
  doc.setDrawColor(229, 9, 20);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);

  y += 10;

  // ══════════════════════════════════════════════════
  // INFOS ACHETEUR
  // ══════════════════════════════════════════════════
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(229, 9, 20);
  doc.text("INFORMATIONS ACHETEUR", margin, y);

  y += 8;

  const infoRows = [
    ["Nom", customer.customerName],
    ["Email", customer.customerEmail],
    ["Téléphone", customer.customerPhone],
    ["Adresse", customer.customerAddress || "—"],
    ...(customer.notes ? [["Notes", customer.notes]] : []),
  ];

  infoRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`${label} :`, margin, y);

    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    // Gère le texte long (adresse, notes)
    const lines = doc.splitTextToSize(value, pageW - margin - 55);
    doc.text(lines, margin + 35, y);

    y += lines.length > 1 ? lines.length * 5 + 2 : 7;
  });

  y += 4;

  // ══════════════════════════════════════════════════
  // LIGNE SÉPARATRICE
  // ══════════════════════════════════════════════════
  doc.setDrawColor(229, 9, 20);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);

  y += 8;

  // ══════════════════════════════════════════════════
  // TABLEAU DES ARTICLES
  // ══════════════════════════════════════════════════
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(229, 9, 20);
  doc.text("DÉTAIL DE LA COMMANDE", margin, y);

  y += 5;

  const tableRows = items.map((item) => [
    item.name,
    item.category || "—",
    `${item.quantity}`,
    formatPrice(item.price),
    formatPrice(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Produit", "Catégorie", "Qté", "Prix unitaire", "Sous-total"]],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [30, 30, 30],
      lineColor: [220, 220, 220],
    },
    headStyles: {
      fillColor: [229, 9, 20],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 35, halign: "center" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 35, halign: "right" },
      4: { cellWidth: 35, halign: "right" },
    },
    alternateRowStyles: {
      fillColor: [252, 245, 245],
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  // ══════════════════════════════════════════════════
  // TOTAL GÉNÉRAL
  // ══════════════════════════════════════════════════
  const totalW = 90;
  const totalX = pageW - margin - totalW;

  // Fond total
  doc.setFillColor(229, 9, 20);
  doc.roundedRect(totalX, y, totalW, 13, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL À PAYER", totalX + 6, y + 8.5);
  doc.text(formatPrice(order.totalAmount), pageW - margin - 4, y + 8.5, {
    align: "right",
  });

  y += 22;

  // ══════════════════════════════════════════════════
  // STATUT COMMANDE
  // ══════════════════════════════════════════════════
  doc.setFillColor(240, 253, 244); // vert clair
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageW - margin * 2, 11, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(22, 163, 74);
  doc.text(
    `Statut : ${order.status || "En attente"}  —  Vous serez contacté prochainement.`,
    pageW / 2,
    y + 7,
    { align: "center" },
  );

  y += 20;

  // ══════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("Gascom E-Sport — Merci de votre confiance !", pageW / 2, y, {
    align: "center",
  });
  doc.text(
    `Reçu généré le ${formatDate(new Date())} à ${formatTime(new Date())}`,
    pageW / 2,
    y + 5,
    { align: "center" },
  );

  // ── Téléchargement automatique ────────────────────
  doc.save(`Recu_Gascom_${order.id}.pdf`);
}
