// Copia texto puro. Erros são ignorados (ex.: permissão negada).
export async function copiarTexto(texto) {
  try { await navigator.clipboard.writeText(texto); } catch { /* ignora */ }
}

// Copia HTML formatado (cola renderizado em clientes de e-mail); cai para texto se não suportado.
export async function copiarHTML(html) {
  try {
    await navigator.clipboard.write([new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([html], { type: "text/plain" }),
    })]);
  } catch {
    await copiarTexto(html);
  }
}
