export const pad2 = (n) => String(n).padStart(2, "0");

// Escapa texto para uso seguro dentro de HTML/SVG gerado como string.
export const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Máscara de telefone: (XX) XXXXX-XXXX (celular) ou (XX) XXXX-XXXX (fixo).
export function maskPhone(v) {
  const d = (v || "").replace(/\D/g, "").slice(0, 11); // só dígitos, máx. 11
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}
