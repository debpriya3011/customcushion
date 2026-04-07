import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fetchImageAsBase64 = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to fetch image", e);
    return null;
  }
};

export const downloadInvoice = async (order: any) => {
  const doc = new jsPDF();
  
  // Try fetching logo
  let logoBase64: string | null = null;
  try {
    const setRes = await fetch('/api/settings');
    if (setRes.ok) {
      const settings = await setRes.json();
      if (settings.logoUrl) {
        logoBase64 = await fetchImageAsBase64(settings.logoUrl);
      }
    }
  } catch (e) {
    // ignore
  }

  // Header Logo
  if (logoBase64) {
    try {
       // A square/rectangular logo fit into roughly 40x40. We assume JPEG/PNG.
       doc.addImage(logoBase64, 'JPEG', 14, 10, 30, 30);
    } catch(err) {
       doc.setFontSize(22);
       doc.setTextColor(40, 40, 40);
       doc.text('CushionGuru', 14, 25);
    }
  } else {
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('CushionGuru', 14, 25);
  }

  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text('TAX INVOICE', 140, 25);

  const startY = 50;

  // 3 Columns: Order Info | Bill To | Ship To
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  // Column 1: Order Details
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details', 14, startY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${order.id}`, 14, startY + 6);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, startY + 12);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, startY + 18);
  doc.text(`Payment: ${order.paymentMethod || 'COD'}`, 14, startY + 24);

  // Address Parsers
  const rawShip = order.shippingAddr?.shipping || order.shippingAddr || {};
  const rawBill = order.shippingAddr?.billing || rawShip;
  
  const formatAddr = (addr: any) => {
    return [
      addr.fullName || order.user?.name || 'Customer',
      addr.address || '-',
      `${addr.city || ''}${addr.state ? ', ' + addr.state : ''} ${addr.zip || ''}`,
      addr.country || '',
      addr.phone ? `Phone: ${addr.phone}` : ''
    ].filter(Boolean);
  }

  const billLines = formatAddr(rawBill);
  const shipLines = formatAddr(rawShip);
  
  // Compare safely excluding methods, etc.
  const isSame = JSON.stringify(rawBill) === JSON.stringify(rawShip);

  // Column 2: Bill To
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 80, startY);
  doc.setFont('helvetica', 'normal');
  billLines.forEach((line, i) => doc.text(line, 80, startY + 6 + (i * 6)));

  // Column 3: Ship To
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To:', 140, startY);
  doc.setFont('helvetica', 'normal');
  if (isSame) {
    doc.text('Same as billing address', 140, startY + 6);
  } else {
    shipLines.forEach((line, i) => doc.text(line, 140, startY + 6 + (i * 6)));
  }

  const tableStartY = startY + 45;

  // Items
  const itemsArray = Array.isArray(order.items) ? order.items : [];
  
  const tableData = itemsArray.map((item: any) => [
    item.name,
    item.quantity.toString(),
    `$${Number(item.price || 0).toFixed(2)}`,
    `$${(Number(item.price || 0) * Number(item.quantity)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 20;
  
  const subtotal = itemsArray.reduce((acc: number, val: any) => acc + (Number(val.price || 0) * Number(val.quantity)), 0);
  const delivery = order.deliveryCharge || 0;
  const total = order.total || (subtotal + delivery);

  // Total Amount at Left
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('TOTAL AMOUNT:', 14, finalY + 15);
  doc.setFontSize(16);
  doc.text(`$${total.toFixed(2)}`, 14, finalY + 23);

  // Subtotal and Delivery on Right
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 140, finalY + 10);
  doc.text(`$${subtotal.toFixed(2)}`, 180, finalY + 10, { align: 'right' });
  
  doc.text('Delivery Charge:', 140, finalY + 16);
  doc.text(`$${delivery.toFixed(2)}`, 180, finalY + 16, { align: 'right' });

  // Thank You
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.text('Thank you for shopping with CushionGuru!', 14, finalY + 45);
  doc.text('For any questions or support, please contact us.', 14, finalY + 50);

  doc.save(`Invoice_${order.id.slice(-8).toUpperCase()}.pdf`);
};
