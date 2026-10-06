import { CORES, LOGO_MM } from "../../constants/brand";
import { IMAGENS } from "../../constants/imagens";
import { MESES } from "../../constants/cafe";
import { escapeHtml as esc, pad2 } from "../../utils/format";

// Dimensões da arte (proporção A4 retrato)
export const CAL_W = 900;
export const CAL_H = 1273;

const { red, red700, ink, cream, line, yellow } = CORES;
const DISP = "'Archivo','Arial Black',Arial,sans-serif";
const BODY = "Arial,Helvetica,sans-serif";

// Gera a arte do calendário de aniversariantes do mês (formato "dia | nome").
export function construirCalendarioSVG({ mes, lista }) {
  const W = CAL_W, H = CAL_H;
  const cx0 = 100, cx1 = 860, barW = 64;

  const sidebar =
    `<rect x="0" y="0" width="${barW}" height="${H}" fill="${red}"/>` +
    `<text x="${barW / 2}" y="${H * 0.6}" transform="rotate(-90 ${barW / 2} ${H * 0.6})" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="24" letter-spacing="6" fill="${yellow}">ANIVERSARIANTES</text>`;

  const header =
    `<text x="${cx0}" y="98" font-family="${DISP}" font-weight="800" font-size="40" letter-spacing="-1" fill="${ink}">ANIVERSARIANTES</text>` +
    `<text x="${cx0}" y="128" font-family="${DISP}" font-weight="700" font-size="13" letter-spacing="3" fill="#8a8284">PARABÉNS A TODOS QUE FAZEM ANIVERSÁRIO NESTE MÊS</text>`;

  const badgeW = 196, badgeH = 44, bX = cx1 - badgeW, bY = 64;
  const badge =
    `<rect x="${bX}" y="${bY}" width="${badgeW}" height="${badgeH}" rx="${badgeH / 2}" fill="${yellow}"/>` +
    `<text x="${bX + badgeW / 2}" y="${bY + badgeH / 2 + 6}" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="18" fill="${red700}">${esc(MESES[mes])}</text>`;

  const rule = `<rect x="${cx0}" y="150" width="${cx1 - cx0}" height="4" rx="2" fill="${red}"/>`;

  // Ilustração do topo: espaço reservado até ser referenciada em src/constants/imagens.js
  const iY = 180, iH = 230;
  const ilustracao = IMAGENS.aniversario.ilustracao
    ? `<image href="${IMAGENS.aniversario.ilustracao}" x="${cx0}" y="${iY}" width="${cx1 - cx0}" height="${iH}" preserveAspectRatio="xMidYMid meet"/>`
    : `<rect x="${cx0}" y="${iY}" width="${cx1 - cx0}" height="${iH}" rx="14" fill="#FAFAFA" stroke="#CFC8C9" stroke-width="2" stroke-dasharray="8 6"/>` +
      `<text x="${(cx0 + cx1) / 2}" y="${iY + iH / 2 + 6}" text-anchor="middle" font-family="${BODY}" font-size="16" fill="#A49C9D">Ilustração do calendário</text>`;

  // Lista "dia | nome" — 1, 2 ou 3 colunas conforme a quantidade
  const lTop = iY + iH + 40, lBottom = 1150;
  let corpo = "";
  if (lista.length === 0) {
    corpo = `<text x="${(cx0 + cx1) / 2}" y="${lTop + 120}" text-anchor="middle" font-family="${BODY}" font-size="16" fill="#a49c9d">Adicione os aniversariantes para montar o calendário.</text>`;
  } else {
    const cols = lista.length > 48 ? 3 : lista.length > 16 ? 2 : 1;
    const porCol = Math.ceil(lista.length / cols);
    const gap = 24;
    const colW = (cx1 - cx0 - gap * (cols - 1)) / cols;
    const rowH = Math.min(46, (lBottom - lTop) / porCol);
    const fs = Math.max(11, Math.min(22, rowH * 0.48));

    lista.forEach((p, i) => {
      const c = Math.floor(i / porCol), r = i % porCol;
      const x = cx0 + c * (colW + gap), y = lTop + r * rowH;
      const ty = y + rowH / 2 + fs * 0.35;
      if (r % 2 === 1) corpo += `<rect x="${x}" y="${y}" width="${colW}" height="${rowH}" fill="${cream}"/>`;
      corpo += `<line x1="${x}" y1="${y + rowH}" x2="${x + colW}" y2="${y + rowH}" stroke="${line}" stroke-width="1"/>`;
      corpo += `<text x="${x + 14}" y="${ty}" font-family="${DISP}" font-size="${fs}" fill="${ink}">` +
        `<tspan font-weight="800" fill="${red}">${pad2(p.dia)}</tspan>` +
        `<tspan fill="#B7B0B1" font-weight="400"> | </tspan>` +
        `<tspan font-family="${BODY}" font-weight="600">${esc(p.nome)}</tspan></text>`;
    });
  }

  const logo = `<image href="${LOGO_MM}" x="${cx1 - 170}" y="1170" width="170" height="88" preserveAspectRatio="xMaxYMid meet"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>` +
    sidebar + header + badge + rule + ilustracao + corpo + logo + `</svg>`;
}
