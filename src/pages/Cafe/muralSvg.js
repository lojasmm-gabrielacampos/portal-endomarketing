import { IMAGENS } from "../../constants/imagens";
import { MESES, TAREFAS } from "../../constants/cafe";
import { escapeHtml as esc } from "../../utils/format";
import { construirSequencia } from "./escala";

// Dimensões do mural (proporção A4 retrato)
export const MURAL_W = 900;
export const MURAL_H = 1273;

// Paleta do layout "Cronograma do Café"
const C = {
  red: "#D62111",
  redDeep: "#B4160A",
  redSide: "#C81A0E",
  gold: "#F4B000",
  goldSoft: "#F0A500",
  ink: "#211C18",
  headerBg: "#1F1B18",
  cream: "#FBF5EC",
  creamLine: "#EFE7DA",
  muted: "#7A736B",
};
const FONT = "Montserrat,'Segoe UI',Arial,sans-serif";

// Largura aproximada de um texto em caixa alta (para centralizar faixas e o selo).
const largura = (t, fs, ls = 0, k = 0.7) => t.length * (fs * k + ls);

// Xícara (mascote padrão quando não há imagem em src/constants/imagens.js)
const XICARA =
  `<g fill="none" stroke="#C9C0B4" stroke-width="6" stroke-linecap="round" opacity=".85">` +
  `<path d="M92 44 C82 34,102 28,92 16"/><path d="M118 44 C108 34,128 28,118 16"/></g>` +
  `<ellipse cx="110" cy="178" rx="82" ry="18" fill="${C.redDeep}"/>` +
  `<ellipse cx="110" cy="173" rx="82" ry="16" fill="${C.red}"/>` +
  `<ellipse cx="110" cy="171" rx="60" ry="11" fill="${C.redDeep}"/>` +
  `<path d="M158 96 c34 0,34 46,0 46" fill="none" stroke="${C.red}" stroke-width="14"/>` +
  `<path d="M158 104 c22 0,22 30,0 30" fill="none" stroke="${C.gold}" stroke-width="6"/>` +
  `<path d="M52 78 h108 l-9 74 a20 20 0 0 1 -20 17 H81 a20 20 0 0 1 -20 -17 Z" fill="${C.red}"/>` +
  `<path d="M52 78 h108 l-2 16 H54 Z" fill="${C.redDeep}"/>` +
  `<ellipse cx="106" cy="86" rx="49" ry="9" fill="#5A2E12"/>` +
  `<ellipse cx="106" cy="85" rx="42" ry="6" fill="#7B4322"/>` +
  `<circle cx="90" cy="120" r="5" fill="#2A1710"/><circle cx="122" cy="120" r="5" fill="#2A1710"/>` +
  `<path d="M92 133 q14 12,28 0" fill="none" stroke="#2A1710" stroke-width="4" stroke-linecap="round"/>` +
  `<circle cx="80" cy="130" r="6" fill="${C.gold}" opacity=".55"/><circle cx="132" cy="130" r="6" fill="${C.gold}" opacity=".55"/>` +
  `<path d="M182 60 l4 10 11 1 -8 8 2 11 -9 -6 -9 6 2 -11 -8 -8 11 -1 Z" fill="${C.gold}"/>`;

// Gera o mural padronizado como SVG (base do PNG/PDF e da pré-visualização).
export function construirMuralSVG({ mes, ano, porDia, sabado, linhas }) {
  const W = MURAL_W, H = MURAL_H;
  const barW = 51;                 // barra lateral (12 mm)
  const x0 = 99, x1 = 853;         // área de conteúdo
  const cw = x1 - x0;
  const respLabel = porDia === 2 ? "DUPLA RESPONSÁVEL" : "RESPONSÁVEL";
  const badge = `${MESES[mes]} / ${ano}`.toUpperCase();

  const defs =
    `<defs>` +
    `<filter id="sBadge" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${C.gold}" flood-opacity=".32"/></filter>` +
    `<filter id="sBox" x="-10%" y="-15%" width="120%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="${C.gold}" flood-opacity=".16"/></filter>` +
    `</defs>`;

  // Barra lateral vermelha com texto vertical dourado
  const sidebar =
    `<rect x="0" y="0" width="${barW}" height="${H}" fill="${C.redSide}"/>` +
    `<text x="${barW / 2}" y="${H / 2}" transform="rotate(-90 ${barW / 2} ${H / 2})" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${FONT}" font-weight="800" font-size="13.6" letter-spacing="5.7" fill="${C.gold}">CRONOGRAMA CAFÉ</text>`;

  // Cabeçalho: título, subtítulo e selo do mês
  const header =
    `<text x="${x0}" y="61" font-family="${FONT}" font-weight="900" font-size="26" letter-spacing="-0.26" fill="${C.ink}">` +
    `CRONOGRAMA DO CAFÉ</text>` +
    `<text x="${x0}" y="103" font-family="${FONT}" font-weight="600" font-size="10.2" letter-spacing="2.45" fill="${C.muted}">` +
    `ESCALA DE RESPONSÁVEIS · DIAS ÚTEIS${sabado ? " + SÁBADO" : ""}</text>`;

  const bFs = 13.6, bH = 35, bW = Math.round(largura(badge, bFs, 0.68, 0.72) + 34), bX = x1 - bW, bY = 39;
  const badgeSvg =
    `<rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" rx="${bH / 2}" fill="${C.gold}" filter="url(#sBadge)"/>` +
    `<text x="${bX + bW / 2}" y="${bY + bH / 2}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="800" font-size="${bFs}" letter-spacing="0.68" fill="#3A2A00">${esc(badge)}</text>`;

  const rule = `<rect x="${x0}" y="118" width="${cw}" height="3.4" rx="1.7" fill="${C.red}"/>`;

  // Tabela
  const tableTop = 135, headH = 31, bodyTop = tableTop + headH;
  const colDia = x0 + 16, colData = x0 + 152, colResp = x0 + 322;
  const thY = tableTop + headH / 2;
  const th = (x, t) =>
    `<text x="${x}" y="${thY}" dominant-baseline="central" font-family="${FONT}" font-weight="700" font-size="10.2" letter-spacing="1.43" fill="#fff">${t}</text>`;
  const thead =
    `<rect x="${x0}" y="${tableTop}" width="${cw}" height="${headH}" rx="5.7" fill="${C.headerBg}"/>` +
    th(colDia, "DIA") + th(colData, "DATA") + th(colResp, respLabel);

  // Rodapé (mascote + tarefas) ancorado na parte de baixo
  const footBottom = H - 34;
  const boxW = 329, boxH = 124, boxX = x1 - boxW, boxY = footBottom - boxH;
  const espacoTabela = boxY - 16 - bodyTop;

  let corpo = "";
  if (linhas.length === 0) {
    corpo = `<text x="${x0 + cw / 2}" y="${bodyTop + 120}" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#a49c9d">Adicione participantes para gerar a escala.</text>`;
  } else {
    const seq = construirSequencia(mes, ano, sabado, linhas);
    const nDias = seq.filter((s) => s.tipo === "dia").length;
    const nFaixas = seq.length - nDias;
    const k = Math.min(1, espacoTabela / (nDias * 34 + nFaixas * 31));
    const rowH = 34 * k, faixaH = 31 * k, faixaPad = 3.4 * k;
    const fs = Math.min(13, rowH * 0.4);
    const fsF = Math.min(10.2, faixaH * 0.36);

    let y = bodyTop, i = 0;
    seq.forEach((s) => {
      if (s.tipo === "dia") {
        const shaded = i % 2 === 1;
        const ty = y + rowH / 2;
        if (shaded) {
          corpo += `<rect x="${x0}" y="${y}" width="${cw}" height="${rowH}" fill="${C.cream}"/>`;
          corpo += `<rect x="${colData}" y="${ty - 5.6}" width="10.2" height="10.2" rx="2.3" fill="${C.goldSoft}"/>`;
        }
        corpo += `<line x1="${x0}" y1="${y + rowH - 0.5}" x2="${x1}" y2="${y + rowH - 0.5}" stroke="${C.creamLine}" stroke-width="1"/>`;
        corpo += `<text x="${colDia}" y="${ty}" dominant-baseline="central" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="${C.ink}">${esc(s.dia)}</text>`;
        corpo += `<text x="${colData + 19}" y="${ty}" dominant-baseline="central" font-family="${FONT}" font-weight="500" font-size="${fs}" fill="${C.muted}">${esc(s.data)}</text>`;
        if (s.nomes.length === 2) {
          corpo += `<text x="${colResp}" y="${ty}" dominant-baseline="central" font-family="${FONT}" font-weight="600" font-size="${fs}" fill="${C.ink}">` +
            `<tspan>${esc(s.nomes[0])}</tspan>` +
            `<tspan dx="${fs * 0.8}" fill="${C.red}" font-weight="800">+</tspan>` +
            `<tspan dx="${fs * 0.8}">${esc(s.nomes[1])}</tspan></text>`;
        } else {
          corpo += `<text x="${colResp}" y="${ty}" dominant-baseline="central" font-family="${FONT}" font-weight="600" font-size="${fs}" fill="${C.ink}">${esc(s.nomes[0] || "")}</text>`;
        }
        y += rowH; i++;
        return;
      }

      // Faixas: fim de semana (vermelha) ou feriado (dourada tracejada)
      const fds = s.tipo === "fds";
      const by = y + faixaPad, bh = faixaH - faixaPad * 2, cy = by + bh / 2;
      const rotulo = (fds ? s.rotulo : `Feriado · ${s.nome}`).toUpperCase();
      const lsR = fsF * (fds ? 0.28 : 0.2), lsD = fsF * (fds ? 0.12 : 0.1), gap = 13.6;
      const datas = s.datas.toUpperCase();
      const wTxt = largura(rotulo, fsF, lsR, 0.66) + gap + largura(datas, fsF, lsD, 0.6);
      const tx = x0 + cw / 2 - wTxt / 2;
      const cor = fds ? "#fff" : "#7A5A00";
      corpo += fds
        ? `<rect x="${x0}" y="${by}" width="${cw}" height="${bh}" rx="4.5" fill="${C.red}"/>`
        : `<rect x="${x0 + 0.5}" y="${by + 0.5}" width="${cw - 1}" height="${bh - 1}" rx="4.5" fill="#FCEFC7" stroke="${C.goldSoft}" stroke-width="1" stroke-dasharray="3 2"/>`;
      if (fds) {
        corpo += `<rect x="${tx - gap - 32}" y="${cy - 1.1}" width="32" height="2.3" rx="1.1" fill="#fff" opacity=".5"/>`;
        corpo += `<rect x="${tx + wTxt + gap}" y="${cy - 1.1}" width="32" height="2.3" rx="1.1" fill="#fff" opacity=".5"/>`;
      }
      corpo += `<text x="${tx}" y="${cy}" dominant-baseline="central" font-family="${FONT}" font-size="${fsF}" fill="${cor}">` +
        `<tspan font-weight="800" letter-spacing="${lsR}">${esc(rotulo)}</tspan>` +
        `<tspan dx="${gap}" font-weight="600" letter-spacing="${lsD}"${fds ? ` opacity=".92"` : ""}>${esc(datas)}</tspan></text>`;
      y += faixaH;
    });
  }

  // Mascote: imagem de src/constants/imagens.js ou a xícara padrão
  const mw = 113, mh = 108, mx = x0, my = footBottom - mh;
  const mascote = IMAGENS.cafe.mascote
    ? `<image href="${IMAGENS.cafe.mascote}" x="${mx}" y="${my}" width="${mw}" height="${mh}" preserveAspectRatio="xMidYMax meet"/>`
    : `<svg x="${mx}" y="${my}" width="${mw}" height="${mh}" viewBox="0 0 220 210">${XICARA}</svg>`;

  const tarefas =
    `<rect x="${boxX + 1.1}" y="${boxY + 1.1}" width="${boxW - 2.2}" height="${boxH - 2.2}" rx="11" fill="#FFFDF7" stroke="${C.gold}" stroke-width="2.3" filter="url(#sBox)"/>` +
    `<text x="${boxX + 20}" y="${boxY + 27}" font-family="${FONT}" font-weight="800" font-size="11.9" letter-spacing="1.67" fill="${C.red}">` +
    `<tspan fill="${C.gold}" font-size="13.6" letter-spacing="0">★</tspan><tspan dx="9">TAREFAS DO DIA</tspan></text>` +
    TAREFAS.map((t, i) => {
      const cy = boxY + 52 + i * 23;
      return `<circle cx="${boxX + 24}" cy="${cy}" r="4" fill="${C.red}"/>` +
        `<text x="${boxX + 38}" y="${cy}" dominant-baseline="central" font-family="${FONT}" font-weight="600" font-size="13.6" fill="${C.ink}">${esc(t)}</text>`;
    }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    defs +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>` +
    sidebar + header + badgeSvg + rule + thead + corpo + mascote + tarefas + `</svg>`;
}
