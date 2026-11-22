// Verificación del recibo PDF de FUN-02 (sin navegador ni dependencias).
// Uso: node scripts/test-receipt-pdf.mjs

import assert from "node:assert/strict";
import { buildReceiptPdf, receiptFilename } from "../frontend/src/ui/receipt-pdf.js";

const receipt = {
  id: "11111111-2222-3333-4444-555555555555",
  receipt_no: "REC-2026-000001",
  paid_at: "21 nov 2026",
  amount: "$1,200.00",
  method: "Transferencia",
  period_start: "01 nov 2026",
  period_end: "30 nov 2026",
  status: "paid",
  student_name: "Alumno Ñandú",
  student_code: "STG.001",
  group_name: "Grupo A",
  plan: "Mensual",
  notes: "NOTA_INTERNA_NO_DEBE_APARECER",
};

const bytes = buildReceiptPdf(receipt);
const pdf = Buffer.from(bytes).toString("latin1");

assert.ok(pdf.startsWith("%PDF-1.4"), "cabecera PDF");
assert.ok(pdf.trimEnd().endsWith("%%EOF"), "fin PDF");

const start = Number(pdf.match(/startxref\n(\d+)/)?.[1]);
assert.ok(Number.isInteger(start) && start > 0, "startxref presente");
assert.equal(pdf.slice(start, start + 4), "xref", "xref en la posición indicada");

const entries = pdf.slice(start).match(/\d{10} 00000 n\r/g) ?? [];
assert.equal(entries.length, 6, "seis objetos");
entries.forEach((entry, index) => {
  const offset = Number(entry.slice(0, 10));
  assert.ok(
    pdf.slice(offset).startsWith(`${index + 1} 0 obj`),
    `offset ${offset} apunta al objeto ${index + 1}`,
  );
});

for (const expected of [
  "REC-2026-000001",
  "Alumno Ñandú",
  "$1,200.00",
  "Transferencia",
  "Pagado",
]) {
  assert.ok(pdf.includes(expected), `falta en el PDF: ${expected}`);
}

assert.ok(!pdf.includes(receipt.notes), "notas internas filtradas");
assert.equal(receiptFilename(receipt), "recibo-REC-2026-000001.pdf");

const voided = Buffer.from(buildReceiptPdf({ ...receipt, status: "voided", void_reason: "Pago duplicado" }))
  .toString("latin1");
assert.ok(voided.includes("PAGO ANULADO"), "recibo anulado marcado");
assert.ok(voided.includes("Pago duplicado"), "motivo de anulación incluido");

console.log("OK · recibo PDF válido, sin notas internas y con estado de anulación.");
