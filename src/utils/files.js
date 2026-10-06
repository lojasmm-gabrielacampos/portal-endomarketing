// Lê um arquivo de imagem enviado pelo usuário e devolve o conteúdo como data URL.
export function lerImagemComoDataURL(file, onLoad) {
  if (!file || !file.type || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result);
  reader.readAsDataURL(file);
}

// Dispara o download de um Blob com o nome informado.
export function baixarBlob(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Baixa um arquivo a partir da URL (ex.: imagem em src/assets).
export async function baixarURL(url, nome) {
  const resp = await fetch(url);
  baixarBlob(await resp.blob(), nome);
}

// Extensão do arquivo a partir da URL (fallback: png).
export function extensaoDe(url) {
  const m = url.split("?")[0].match(/\.(\w+)$/);
  return m ? m[1] : "png";
}

// Converte uma URL em data URL em tempo de execução (necessário para que
// imagens apareçam dentro de SVGs desenhados no canvas / impressos).
async function urlParaDataURL(url) {
  const blob = await (await fetch(url)).blob();
  return new Promise((ok, erro) => {
    const r = new FileReader();
    r.onload = () => ok(r.result);
    r.onerror = erro;
    r.readAsDataURL(blob);
  });
}

// Troca, no markup, todo href/src que não seja data: pela imagem embutida.
async function embutirImagens(markup) {
  const urls = [...new Set([...markup.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((u) => !u.startsWith("data:") && !u.startsWith("#") && !u.startsWith("http://www.w3.org")))];
  let saida = markup;
  for (const u of urls) {
    try {
      const data = await urlParaDataURL(u);
      saida = saida.split(`"${u}"`).join(`"${data}"`);
    } catch { /* imagem indisponível: segue sem ela */ }
  }
  return saida;
}

// Desenha um SVG (string) em canvas e baixa como PNG.
async function svgParaPNG(svg, { largura, altura, nome, escala = 2 }) {
  // data: URL (e não blob:) para o Chrome não bloquear o canvas com <foreignObject>
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = largura * escala;
    canvas.height = altura * escala;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((b) => baixarBlob(b, nome), "image/png");
  };
  img.onerror = () => {
    alert("Não foi possível gerar o PNG neste navegador. Use “Imprimir / PDF”.");
  };
  img.src = url;
}

// Converte um SVG (string) em PNG e baixa (offline, sem dependências externas).
export async function exportarSvgComoPNG(svg, opcoes) {
  await svgParaPNG(await embutirImagens(svg), opcoes);
}

// Converte um trecho de HTML (ex.: a assinatura) em PNG.
export async function exportarHtmlComoPNG(html, { largura, altura, nome, margem = 16, escala = 2 }) {
  // Serializa como XHTML para poder ir dentro de um <foreignObject>
  const box = document.createElement("div");
  box.innerHTML = await embutirImagens(html);
  box.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  box.setAttribute("style", `padding:${margem}px;background:#fff;`);
  const xhtml = new XMLSerializer().serializeToString(box);
  const W = largura + margem * 2, H = altura + margem * 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`
    + `<foreignObject x="0" y="0" width="${W}" height="${H}">${xhtml}</foreignObject></svg>`;
  await svgParaPNG(svg, { largura: W, altura: H, nome, escala });
}

// Abre o SVG em uma janela de impressão (permite salvar em PDF, offline).
export async function imprimirSVG(svg, titulo = "Impressão") {
  const w = window.open("", "_blank");
  if (!w) { alert("Permita pop-ups para imprimir ou salvar em PDF."); return; }
  const svgFinal = await embutirImagens(svg);
  w.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${titulo}</title>` +
    `<style>@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0}svg{width:100%;height:auto;display:block}</style>` +
    `</head><body>${svgFinal}<scr` + `ipt>window.onload=function(){setTimeout(function(){window.print()},250)}</scr` + `ipt></body></html>`
  );
  w.document.close();
}
