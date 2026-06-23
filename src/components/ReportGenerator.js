import jsPDF from 'jspdf';

/**
 * Generate a PDF report for a completed assessment
 */
export function generateReport(result) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Helper
  const centerText = (text, yPos, size = 12) => {
    doc.setFontSize(size);
    const textWidth = doc.getStringUnitWidth(text) * size / doc.internal.scaleFactor;
    doc.text(text, (pageWidth - textWidth) / 2, yPos);
  };

  const addLine = () => {
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
  };

  // ── Header ───────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Dark Navy
  centerText('VORSPED HIRING ASSESSMENT', y, 18);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  centerText('Assessment Report', y, 12);
  y += 12;

  addLine();

  // ── Candidate Info ────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text('Candidate Information', 20, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const info = [
    ['Name', result.candidateName || 'N/A'],
    ['Stream', result.streamName || 'N/A'],
    ['Date', new Date(result.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })],
    ['Duration', `${result.timeTaken || 0} minutes`],
    ['Credential Code', result.credentialCode || 'N/A'],
  ];

  info.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, y);
    y += 7;
  });

  y += 5;
  addLine();

  // ── Score Summary ──────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text('Score Summary', 20, y);
  y += 12;

  const hasCoding = result.codingTotal > 0;

  if (hasCoding) {
    // 3 Score Boxes (SWE)
    const boxWidth = (pageWidth - 50) / 3;

    // Box 1: Aptitude
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(20, y - 5, boxWidth, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Aptitude Score', 24, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text(`${result.aptitudeScore} / ${result.aptitudeTotal}`, 24, y + 16);

    // Box 2: Domain MCQ
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(20 + boxWidth + 5, y - 5, boxWidth, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Domain MCQ', 20 + boxWidth + 9, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(147, 51, 234); // Purple
    doc.text(`${result.domainScore} / ${result.domainTotal}`, 20 + boxWidth + 9, y + 16);

    // Box 3: Coding
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(20 + (boxWidth * 2) + 10, y - 5, boxWidth, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Coding Score', 20 + (boxWidth * 2) + 14, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74); // Green
    doc.text(`${result.codingScore} / ${result.codingTotal}`, 20 + (boxWidth * 2) + 14, y + 16);
  } else {
    // 2 Score Boxes (Non-coding)
    const boxWidth = (pageWidth - 45) / 2;

    // Box 1: Aptitude
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(20, y - 5, boxWidth, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Aptitude Score', 25, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text(`${result.aptitudeScore} / ${result.aptitudeTotal}`, 25, y + 16);

    // Box 2: Domain MCQ
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(pageWidth / 2 + 2.5, y - 5, boxWidth, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Domain Score', pageWidth / 2 + 7.5, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(147, 51, 234); // Purple
    doc.text(`${result.domainScore} / ${result.domainTotal}`, pageWidth / 2 + 7.5, y + 16);
  }

  y += 40;

  // Overall Score Box
  const overallScore = result.aptitudeScore + result.domainScore + (result.codingScore || 0);
  const overallTotal = result.aptitudeTotal + result.domainTotal + (result.codingTotal || 0);
  const percentage = ((overallScore / overallTotal) * 100).toFixed(1);
  const passed = percentage >= 50;

  doc.setFillColor(passed ? 240 : 254, passed ? 253 : 242, passed ? 244 : 242);
  doc.roundedRect(20, y - 5, pageWidth - 40, 35, 3, 3, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Overall Score', 25, y + 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text(`${overallScore} / ${overallTotal}  (${percentage}%)`, 25, y + 20);

  // Status badge
  doc.setFontSize(12);
  doc.setTextColor(passed ? 34 : 239, passed ? 197 : 68, passed ? 94 : 68);
  doc.text(passed ? '✓ QUALIFIED' : '✗ NOT QUALIFIED', pageWidth - 65, y + 20);

  y += 50;
  addLine();

  // ── Category Breakdowns ────────────────────────────
  if (result.aptitudeDetails && result.aptitudeDetails.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.text('Aptitude Performance Breakdown', 20, y);
    y += 10;

    const aptCategories = {};
    result.aptitudeDetails.forEach(d => {
      if (!aptCategories[d.category]) aptCategories[d.category] = { correct: 0, total: 0 };
      aptCategories[d.category].total++;
      if (d.isCorrect) aptCategories[d.category].correct++;
    });

    // Table header
    doc.setFillColor(248, 250, 252);
    doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Topic Category', 25, y + 1);
    doc.text('Correct / Total', 110, y + 1);
    doc.text('Accuracy %', 160, y + 1);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    Object.entries(aptCategories).forEach(([cat, data]) => {
      const pct = ((data.correct / data.total) * 100).toFixed(0);
      doc.text(cat, 25, y);
      doc.text(`${data.correct} / ${data.total}`, 110, y);
      doc.text(`${pct}%`, 160, y);
      y += 7;
    });
  }

  y += 10;

  // Domain Breakdown Table
  if (result.domainDetails && result.domainDetails.length > 0) {
    // If y is too low, add a new page
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.text('Domain Performance Breakdown', 20, y);
    y += 10;

    const domCategories = {};
    result.domainDetails.forEach(d => {
      if (!domCategories[d.category]) domCategories[d.category] = { correct: 0, total: 0 };
      domCategories[d.category].total++;
      if (d.isCorrect) domCategories[d.category].correct++;
    });

    // Table header
    doc.setFillColor(248, 250, 252);
    doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Domain Subject Area', 25, y + 1);
    doc.text('Correct / Total', 110, y + 1);
    doc.text('Accuracy %', 160, y + 1);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    Object.entries(domCategories).forEach(([cat, data]) => {
      const pct = ((data.correct / data.total) * 100).toFixed(0);
      doc.text(cat, 25, y);
      doc.text(`${data.correct} / ${data.total}`, 110, y);
      doc.text(`${pct}%`, 160, y);
      y += 7;
    });
  }

  // ── Footer ──────────────────────────────────────────
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  centerText('Vorsped Talent Evaluation System', 280, 8);
  centerText(`Report generated on ${new Date().toLocaleString('en-IN')}`, 285, 8);

  // Save
  const fileName = `${result.streamId || 'Hiring'}_Report_${(result.candidateName || 'candidate').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
