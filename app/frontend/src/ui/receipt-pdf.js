// Recibo de pago en PDF de una sola página (FUN-02).
//
// Sin dependencias externas: genera un PDF 1.4 válido con Helvetica y texto en
// WinAnsi/Latin-1 (suficiente para español). No hace peticiones: los datos ya
// vienen de `payments`, protegidos por RLS. Nunca incluye notas internas.

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT = 56;

/** Convierte un carácter a WinAnsi aproximado (Latin-1); los demás se sustituyen. */
function toLatin1(text) {
  return String(text ?? '')
    .split('')
    .map((char) => {
      const code = char.codePointAt(0);
      return code <= 255 ? char : '?';
    })
    .join('');
}

function escapePdfString(text) {
  return toLatin1(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

function byteLength(text) {
  let length = 0;
  for (let index = 0; index < text.length; index++) {
    length += text.charCodeAt(index) <= 255 ? 1 : 2;
  }
  return length;
}

function pdfBytes(text) {
  const bytes = new Uint8Array(byteLength(text));
  let offset = 0;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    if (code <= 255) {
      bytes[offset++] = code;
    } else {
      // Los caracteres fuera de Latin-1 ya se sustituyeron al escapar.
      bytes[offset++] = 0x3f;
      if (code > 0xffff) bytes[offset++] = 0x3f;
    }
  }
  return bytes;
}

function textLine(lines, value, y, { size = 11, bold = false, x = LEFT } = {}) {
  lines.push(
    `BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfString(value)}) Tj ET`,
  );
}

function rule(lines, y) {
  lines.push(
    `0.6 w ${LEFT} ${y} m ${PAGE_WIDTH - LEFT} ${y} l S`,
  );
}

function field(lines, label, value, y) {
  textLine(lines, label, y, { size: 9, bold: true });
  textLine(lines, value, y - 15, { size: 11 });
}

/**
 * Datos esperados: { receipt_no, paid_at, amount, method, period_start,
 * period_end, status, student_name, student_code, group_name, plan,
 * void_reason }. Devuelve Uint8Array lista para descargar.
 */
export function buildReceiptPdf(receipt) {
  const data = receipt || {};
  const isVoided = data.status === 'voided';
  const lines = [];

  textLine(lines, 'ECOEMS', PAGE_HEIGHT - 70, { size: 22, bold: true });
  textLine(lines, 'Recibo de pago', PAGE_HEIGHT - 96, { size: 13 });

  if (isVoided) {
    textLine(lines, 'PAGO ANULADO', PAGE_HEIGHT - 122, { size: 14, bold: true });
  }

  rule(lines, PAGE_HEIGHT - 136);

  field(lines, 'FOLIO', data.receipt_no || data.id || 'SIN FOLIO', PAGE_HEIGHT - 164);
  field(lines, 'ALUMNO', data.student_name || '—', PAGE_HEIGHT - 210);
  field(
    lines,
    'CODIGO Y GRUPO',
    `${data.student_code || '—'}${data.group_name ? ` · ${data.group_name}` : ''}`,
    PAGE_HEIGHT - 256,
  );
  field(lines, 'FECHA DE PAGO', data.paid_at || '—', PAGE_HEIGHT - 302);
  field(lines, 'METODO', data.method || '—', PAGE_HEIGHT - 348);
  field(
    lines,
    'PERIODO CUBIERTO',
    data.period_start || data.period
      ? `${data.period_start || data.period}${data.period_end ? ` — ${data.period_end}` : ''}`
      : 'No especificado',
    PAGE_HEIGHT - 394,
  );
  field(lines, 'PLAN', data.plan || 'No especificado', PAGE_HEIGHT - 440);
  field(lines, 'ESTADO', isVoided ? 'Anulado' : 'Pagado', PAGE_HEIGHT - 486);

  if (isVoided && data.void_reason) {
    field(lines, 'MOTIVO DE ANULACION', data.void_reason, PAGE_HEIGHT - 532);
  }

  rule(lines, 250);
  textLine(lines, 'Importe pagado', 226, { size: 12, bold: true });
  textLine(lines, toLatin1(data.amount || '—'), 226, { size: 16, bold: true, x: 420 });
  rule(lines, 208);

  textLine(
    lines,
    'Documento generado por la plataforma ECOEMS. Conserve este recibo para sus registros.',
    176,
    { size: 9 },
  );
  textLine(lines, `Folio: ${data.receipt_no || data.id || 'SIN FOLIO'}`, 158, { size: 9 });

  const stream = lines.join('\n') + '\n';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      '/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${byteLength(stream)} >>\nstream\n${stream}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];

  let pdf = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n';
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets[index + 1] = byteLength(pdf);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = byteLength(pdf);
  const size = objects.length + 1;
  pdf += `xref\n0 ${size}\n0000000000 65535 f\r\n`;
  for (let index = 1; index < size; index++) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n\r\n`;
  }
  pdf += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return pdfBytes(pdf);
}

export function receiptFilename(receipt) {
  const raw = String(receipt?.receipt_no || receipt?.id || 'recibo');
  const safe = raw.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return `recibo-${safe || 'ecoems'}.pdf`;
}

/** Descarga el recibo en el navegador. Solo se llama desde un evento de usuario. */
export function downloadReceiptPdf(receipt) {
  const blob = new Blob([buildReceiptPdf(receipt)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = receiptFilename(receipt);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
