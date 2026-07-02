import { jsPDF } from 'jspdf';

type ScreeningReportData = {
  childName?: string;
  ageMonths?: number;
  gender?: string;
  answers?: number[];
  riskPercentage?: number;
  riskLevel?: string;
  totalScore?: number;
  questions?: Array<{ id: number; prompt: string }>;
};

const questionLabels = [
  'Eye contact and social attention',
  'Response to name',
  'Pretend play enjoyment',
  'Use of gestures',
  'Understanding emotions and intentions',
  'Repetition of phrases or sounds',
  'Sensitivity to routine changes',
  'Intense interests',
  'Back-and-forth conversation',
  'Support needs in daily settings',
];

export const generateClinicalReport = (data: ScreeningReportData) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 50;

  doc.setFillColor(14, 116, 144);
  doc.rect(0, 0, pageWidth, 90, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Autism Early Screening Clinical Report', margin, 32);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Pediatric Development Assessment Summary', margin, 54);
  doc.text('Prepared for clinical review and follow-up planning', margin, 72);

  y = 120;
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Child Details', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  y += 20;
  doc.text(`Child Name: ${data.childName || 'Not provided'}`, margin, y);
  y += 16;
  doc.text(`Age: ${data.ageMonths || 'Not provided'} months`, margin, y);
  y += 16;
  doc.text(`Gender: ${data.gender || 'Not provided'}`, margin, y);

  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Screening Score Matrix', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 16;

  const answers = data.answers || [];
  const questions = data.questions || [];
  const tableStartX = margin;
  const col1 = 40;
  const col2 = 290;
  const col3 = 360;

  doc.setDrawColor(200, 200, 200);
  doc.line(tableStartX, y, pageWidth - margin, y);
  y += 8;

  questions.forEach((question, index) => {
    const answer = answers[index] ?? 0;
    const label = question.prompt || questionLabels[index] || `Question ${index + 1}`;
    const value = answer === 1 ? 'Yes' : 'No';

    doc.text(`${index + 1}.`, tableStartX, y + 4);
    doc.text(label, tableStartX + col1, y + 4);
    doc.text(value, col2, y + 4);
    doc.text(`${answer}`, col3, y + 4);
    y += 16;
  });

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Score:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.totalScore ?? answers.filter(Boolean).length}`, margin + 70, y);
  y += 18;
  doc.text('AI Risk Percentage:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.riskPercentage ?? 0}%`, margin + 110, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  doc.text('Risk Level:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.riskLevel || 'Not available'}`, margin + 70, y);

  y += 36;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 110, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Medical Disclaimer', margin + 12, y + 24);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  const disclaimer = [
    'This screening report is intended for informational and educational purposes only.',
    'It is not a diagnosis and should not replace a formal clinical evaluation.',
    'Please consult a certified pediatrician or licensed medical professional for any diagnosis, treatment decision, or follow-up care.',
  ];

  disclaimer.forEach((line, index) => {
    doc.text(line, margin + 12, y + 46 + index * 14);
  });

  doc.save(`screening-report-${Date.now()}.pdf`);
};
