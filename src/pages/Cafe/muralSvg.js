import { CORES } from "../../constants/brand";
import { IMAGENS } from "../../constants/imagens";
import { MESES, TAREFAS } from "../../constants/cafe";
import { escapeHtml as esc } from "../../utils/format";

// Dimensões do mural (proporção A4 retrato)
export const MURAL_W = 900;
export const MURAL_H = 1273;

const { red, red700, ink, cream, line, yellow } = CORES;
const DISP = "'Archivo','Arial Black',Arial,sans-serif";
const BODY = "Arial,Helvetica,sans-serif";

// Gera o mural padronizado como SVG (base do PNG/PDF e da pré-visualização).
export function construirMuralSVG({ mes, ano, porDia, sabado, linhas }) {
  const W = MURAL_W, H = MURAL_H;
  const cx0 = 100, cx1 = 860, barW = 64;
  const tableTop = 176, headerH = 34, bandTop = 1055;
  const bodyTop = tableTop + headerH;
  const rows = Math.max(linhas.length, 1);
  const rowH = Math.min(38, Math.max(20, (bandTop - bodyTop - 8) / rows));
  const fs = Math.max(11, Math.min(15, rowH * 0.42));
  const colDia = 118, colData = 340, colResp = 566;
  const respLabel = porDia === 2 ? "DUPLA RESPONSÁVEL" : "RESPONSÁVEL";
  const badge = `${MESES[mes]} / ${ano}`;

  const sidebar =
    `<rect x="0" y="0" width="${barW}" height="${H}" fill="${red}"/>` +
    `<text x="${barW / 2}" y="${H * 0.6}" transform="rotate(-90 ${barW / 2} ${H * 0.6})" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="24" letter-spacing="6" fill="${yellow}">CRONOGRAMA CAFÉ</text>`;

  const header =
    `<text x="${cx0}" y="98" font-family="${DISP}" font-weight="800" font-size="40" letter-spacing="-1" fill="${ink}">CRONOGRAMA DO CAFÉ</text>` +
    `<text x="${cx0}" y="128" font-family="${DISP}" font-weight="700" font-size="13" letter-spacing="3" fill="#8a8284">ESCALA DE RESPONSÁVEIS · DIAS ÚTEIS${sabado ? " + SÁBADO" : ""}</text>`;

  const badgeW = 196, badgeH = 44, bX = cx1 - badgeW, bY = 64;
  const badgeSvg =
    `<rect x="${bX}" y="${bY}" width="${badgeW}" height="${badgeH}" rx="${badgeH / 2}" fill="${yellow}"/>` +
    `<text x="${bX + badgeW / 2}" y="${bY + badgeH / 2 + 6}" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="18" fill="${red700}">${esc(badge)}</text>`;

  const rule = `<rect x="${cx0}" y="150" width="${cx1 - cx0}" height="4" rx="2" fill="${red}"/>`;

  const thY = tableTop + headerH / 2 + 5;
  const thText = (x, t) =>
    `<text x="${x}" y="${thY}" font-family="${DISP}" font-weight="700" font-size="13" letter-spacing="1.5" fill="#fff">${t}</text>`;
  const thead =
    `<rect x="${cx0}" y="${tableTop}" width="${cx1 - cx0}" height="${headerH}" rx="4" fill="${ink}"/>` +
    thText(colDia, "DIA") + thText(colData, "DATA") + thText(colResp, respLabel);

  let corpo = "";
  if (linhas.length === 0) {
    corpo = `<text x="${(cx0 + cx1) / 2}" y="${bodyTop + 120}" text-anchor="middle" font-family="${BODY}" font-size="16" fill="#a49c9d">Adicione participantes para gerar a escala.</text>`;
  } else {
    linhas.forEach((r, i) => {
      const y = bodyTop + i * rowH;
      const alt = i % 2 === 1;
      const ty = y + rowH / 2 + fs * 0.35;
      if (alt) corpo += `<rect x="${cx0}" y="${y}" width="${cx1 - cx0}" height="${rowH}" fill="${cream}"/>`;
      corpo += `<line x1="${cx0}" y1="${y}" x2="${cx1}" y2="${y}" stroke="${line}" stroke-width="1"/>`;
      if (alt) corpo += `<rect x="${colData - 18}" y="${y + rowH / 2 - 4}" width="8" height="8" rx="1.5" fill="${yellow}"/>`;
      corpo += `<text x="${colDia}" y="${ty}" font-family="${DISP}" font-weight="700" font-size="${fs}" fill="${ink}">${esc(r.dia)}</text>`;
      corpo += `<text x="${colData}" y="${ty}" font-family="${BODY}" font-size="${fs}" fill="#4a4344">${esc(r.data)}</text>`;
      if (r.nomes.length === 2) {
        corpo += `<text x="${colResp}" y="${ty}" font-family="${BODY}" font-size="${fs}" fill="${ink}">` +
          `<tspan font-weight="600">${esc(r.nomes[0])}</tspan>` +
          `<tspan fill="${red}" font-weight="700"> + </tspan>` +
          `<tspan font-weight="600">${esc(r.nomes[1])}</tspan></text>`;
      } else {
        corpo += `<text x="${colResp}" y="${ty}" font-family="${BODY}" font-weight="600" font-size="${fs}" fill="${ink}">${esc(r.nomes[0] || "")}</text>`;
      }
    });
    const yFim = bodyTop + linhas.length * rowH;
    corpo += `<line x1="${cx0}" y1="${yFim}" x2="${cx1}" y2="${yFim}" stroke="${line}" stroke-width="1"/>`;
  }

  // Mascote: espaço reservado até a imagem ser referenciada em src/constants/imagens.js
  const mx = 118, my = 1078, mw = 200, mh = 170;
  const mascote = IMAGENS.cafe.mascote
    ? `<image href="${IMAGENS.cafe.mascote}" x="${mx}" y="${my}" width="${mw}" height="${mh}" preserveAspectRatio="xMidYMid meet"/>`
    : `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="14" fill="#FAFAFA" stroke="#CFC8C9" stroke-width="2" stroke-dasharray="8 6"/>` +
      `<text x="${mx + mw / 2}" y="${my + mh / 2 + 5}" text-anchor="middle" font-family="${BODY}" font-size="13" fill="#A49C9D">Imagem do mascote</text>`;

  const tbX = 470, tbY = 1085, tbW = 390, tbH = 152;
  const tarefas =
    `<rect x="${tbX}" y="${tbY}" width="${tbW}" height="${tbH}" rx="14" fill="#FFFDF6" stroke="${yellow}" stroke-width="2"/>` +
    `<text x="${tbX + 22}" y="${tbY + 34}" font-family="${DISP}" font-weight="700" font-size="15" letter-spacing="1" fill="${red700}"><tspan fill="${yellow}">★ </tspan>TAREFAS DO DIA</text>` +
    TAREFAS.map((t, i) =>
      `<circle cx="${tbX + 26}" cy="${tbY + 66 + i * 28}" r="4" fill="${red}"/>` +
      `<text x="${tbX + 40}" y="${tbY + 71 + i * 28}" font-family="${BODY}" font-size="14" fill="${ink}">${esc(t)}</text>`
    ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>` +
    sidebar + header + badgeSvg + rule + thead + corpo + mascote + tarefas + `</svg>`;
}
