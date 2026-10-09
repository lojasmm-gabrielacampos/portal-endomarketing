
import { IMAGENS } from "../../constants/imagens";
import { MESES } from "../../constants/cafe";
import { escapeHtml as esc } from "../../utils/format";

// Arte anual "Feliz Aniversário" (base: Aniversariantes_Anual.pdf, A4 retrato).
export const CAL_W = 900;
export const CAL_H = 1273;

// Cores medidas na arte original.
export const COR_ARTE = {
  vermelho: "#e1101b",
  amarelo: "#f9b804",
  amareloFaixa: "#fcde33",
  texto: "#1f1f1f",
};

// Janeiro vermelho, fevereiro amarelo, e assim por diante.
export const corDoMes = (mes) =>
  mes % 2 === 0 ? COR_ARTE.vermelho : COR_ARTE.amarelo;

// Arquivos das fontes da arte (.woff2/.ttf).
export const FONTES_ARTE = {
  titulo: null, // Bobby Jones (títulos dos meses)
  nome: null,   // DM Sans Regular (dias e nomes)
};

const FONTE_TITULO =
  "'Bobby Jones','Archivo Narrow','Archivo','Arial Narrow','Arial Black',sans-serif";
const FONTE_NOME = "'DM Sans',Arial,Helvetica,sans-serif";

// Grade 3 × 4 com as mesmas medidas da arte.
const GRADE = {
  x0: 35,
  y0: 199,
  w: 262,
  h: 229,
  gx: 22,
  gy: 24,
  cab: 42,
  borda: 4,
  raio: 11,
};

// Área dos nomes dentro de cada caixa.
const LISTA = {
  topo: 46,
  base: 8,
  padX: 14,
  gapCol: 12,
};

const FS_MAX = 19;
const FS_MIN = 12;
const FS_MIN_LOTADO = 12;
const ENTRELINHA = 1.5;

// Quantidade fixa de linhas em cada coluna.
const MAX_LINHAS = 6;

// Posições relativas ao início da coluna, em "em".
const RECUO_DIA = 1.2;
const RECUO_PONTO = 1.5;
const RECUO_NOME = 1.8;

export function caixaDoMes(mes) {
  const c = mes % 3;
  const l = Math.floor(mes / 3);

  return {
    x: GRADE.x0 + c * (GRADE.w + GRADE.gx),
    y: GRADE.y0 + l * (GRADE.h + GRADE.gy),
    w: GRADE.w,
    h: GRADE.h,
  };
}

const larguraColuna =
  (GRADE.w - LISTA.padX * 2 - LISTA.gapCol) / 2;

const alturaLista =
  GRADE.h - LISTA.topo - LISTA.base;

// Sempre considera 6 linhas por coluna.
const linhasPorColuna = () => MAX_LINHAS;

const larguraNome = (fs) =>
  larguraColuna - fs * RECUO_NOME;

let ctx;

function medir(texto, fs) {
  if (ctx === undefined) {
    try {
      ctx = document.createElement("canvas").getContext("2d");
    } catch {
      ctx = null;
    }
  }

  if (!ctx) return texto.length * fs * 0.56;

  ctx.font = `400 ${fs}px ${FONTE_NOME}`;
  return ctx.measureText(texto).width;
}

function caber(texto, fs, max) {
  if (medir(texto, fs) <= max) return texto;

  let a = 0;
  let b = texto.length;

  while (a < b) {
    const m = Math.ceil((a + b) / 2);

    if (
      medir(texto.slice(0, m).trimEnd() + "…", fs) <= max
    ) {
      a = m;
    } else {
      b = m - 1;
    }
  }

  return texto.slice(0, a).trimEnd() + "…";
}

// Decide o tamanho da fonte e a coluna de cada pessoa.
// A primeira coluna enche primeiro; o restante vai para a segunda.
// Cada coluna comporta até 6 linhas.

export function calcularLayout(meses) {
  return meses.map((lista) => {
    // Cada mês calcula seu próprio tamanho de fonte.
    let fs = FS_MAX;

    const linhas = MAX_LINHAS;
    const capacidade = linhas * 2;

    // Procura a maior fonte que acomode os nomes deste mês,
    // respeitando a altura disponível e as 6 linhas por coluna.
    const nomes = lista.slice(0, capacidade).map((p) => p.nome);

    while (fs > FS_MIN) {
      const cabeNaLargura = nomes.every(
        (nome) => medir(nome, fs) <= larguraNome(fs)
      );

      const cabeNaAltura =
        fs * ENTRELINHA * MAX_LINHAS <= alturaLista;

      if (cabeNaLargura && cabeNaAltura) break;

      fs -= 0.5;
    }

    const itens = lista.slice(0, capacidade).map((p, i) => {
      const col = i < linhas ? 0 : 1;

      const texto = caber(
        p.nome,
        fs,
        larguraNome(fs)
      );

      return {
        ...p,
        col,
        lin: col ? i - linhas : i,
        texto,
        truncado: texto !== p.nome,
      };
    });

    return {
      fs,
      linhas,
      itens,
      excedentes: lista.slice(capacidade),
    };
  });
}

function espacoImagem(href, x, y, w, h, rotulo) {
  if (href) {
    return `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="#cfc8c9" stroke-width="2" stroke-dasharray="7 6"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#a49c9d">${rotulo}</text>`
  );
}

function estiloFontes() {
  const face = (familia, url) =>
    url
      ? `@font-face{font-family:'${familia}';src:url("${url}");}`
      : "";

  const css =
    face("Bobby Jones", FONTES_ARTE.titulo) +
    face("DM Sans", FONTES_ARTE.nome);

  return css ? `<defs><style>${css}</style></defs>` : "";
}

export function construirCalendarioSVG({ meses }) {
  const W = CAL_W;
  const H = CAL_H;

  const { vermelho, amareloFaixa, texto } = COR_ARTE;
  const img = IMAGENS.aniversario || {};
  const layout = calcularLayout(meses);

  // Faixas dos cantos superiores.
  const faixas =
    `<path d="M0 0 H236 C168 26 86 58 0 88 Z" fill="${amareloFaixa}"/>` +
    `<path d="M0 0 H208 C142 20 66 40 0 58 Z" fill="${vermelho}"/>` +
    `<path d="M694 0 H${W} V68 C842 42 768 16 694 0 Z" fill="${vermelho}"/>`;

  // Espaços para as artes do cabeçalho.
  const cabecalho =
    espacoImagem(img.titulo, 305, 24, 300, 142, "Arte “Feliz Aniversário”") +
    espacoImagem(img.logo, 650, 72, 160, 48, "Logo Grupo MM");

  let caixas = "";

  layout.forEach((m, mes) => {
    const { x, y, w, h } = caixaDoMes(mes);
    const cor = corDoMes(mes);
    const { cab, borda, raio } = GRADE;

    caixas +=
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${raio}" fill="${cor}"/>` +
      `<rect x="${x + borda}" y="${y + cab}" width="${w - borda * 2}" height="${h - cab - borda}" rx="${raio - 4}" fill="#ffffff"/>` +
      `<text x="${x + w / 2}" y="${y + cab / 2 + 9}" text-anchor="middle" font-family="${FONTE_TITULO}" font-weight="700" font-size="26" letter-spacing="0.5" fill="#ffffff">${esc(MESES[mes].toLocaleUpperCase("pt-BR"))}</text>`;

    const pitch = m.fs * ENTRELINHA;

    m.itens.forEach((p) => {
      const cx =
        x + LISTA.padX + p.col * (larguraColuna + LISTA.gapCol);

      const by = (
        y +
        LISTA.topo +
        pitch * (p.lin + 0.5) +
        m.fs * 0.35
      ).toFixed(1);

      const base =
        `y="${by}" font-family="${FONTE_NOME}" font-size="${m.fs}" fill="${texto}"`;

      caixas +=
        `<text x="${(cx + m.fs * RECUO_DIA).toFixed(1)}" ${base} text-anchor="end">${p.dia}</text>` +
        `<text x="${(cx + m.fs * RECUO_PONTO).toFixed(1)}" ${base} text-anchor="middle">·</text>` +
        `<text x="${(cx + m.fs * RECUO_NOME).toFixed(1)}" ${base}>${esc(p.texto)}</text>`;
    });
  });

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    estiloFontes() +
    `<rect width="${W}" height="${H}" fill="#ffffff"/>` +
    faixas +
    cabecalho +
    caixas +
    `</svg>`
  );
}