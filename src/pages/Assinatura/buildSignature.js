import { CORES, EMPRESA_MM, LOGO_MM, MASCOTE } from "../../constants/brand";
import { escapeHtml as esc } from "../../utils/format";

const FF = "'Century Gothic','Trebuchet MS',Arial,sans-serif";
const RED = CORES.redAssinatura;
const W = 600;

// Monta o HTML da assinatura (tabelas + estilos inline) — padrão Grupo MM.
// Com foto e sem foto: o layout se ajusta automaticamente conforme `photo`.
// Obs.: para funcionar fora do app (Outlook/Gmail), LOGO_MM, MASCOTE e a foto
// precisam ser URLs públicas absolutas (referencie em src/constants/imagens.js).
export function buildSignature({ nome, depto, fone, photo }) {
  // foto redonda opcional (à esquerda)
  const photoCell = photo
    ? `<td width="84" style="vertical-align:middle;padding:24px 14px 24px 2px;">`
      + `<img src="${photo}" alt="${esc(nome)}" width="66" height="66" `
      + `style="display:block;border-radius:50%;object-fit:cover;border:0;"></td>`
    : "";

  // linha do telefone opcional (bolinha vermelha + número)
  const phoneLine = fone
    ? `<p style="margin:7px 0 0 0;font-family:${FF};font-size:13px;color:#3d3d3d;line-height:1.2;">`
      + `<span style="color:${RED};font-size:13px;line-height:1;vertical-align:middle;">&#9679;</span>&nbsp;`
      + `<span style="vertical-align:middle;">${esc(fone)}</span></p>`
    : "";

  return `<table width="${W}" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:${FF};max-width:${W}px;">
  <tr>
    <td width="4" bgcolor="${RED}" style="background-color:${RED};width:4px;font-size:0;line-height:0;">&nbsp;</td>
    <td width="16" style="font-size:0;line-height:0;">&nbsp;</td>
    ${photoCell}<td style="vertical-align:middle;padding-right:14px;">
      <p style="margin:0;font-family:${FF};font-size:16px;font-weight:bold;color:#1a1a1a;line-height:1.15;letter-spacing:-0.01em;">${esc(nome)}</p>
      <p style="margin:3px 0 0 0;font-family:${FF};font-size:14px;font-weight:bold;color:${RED};line-height:1.2;">${esc(depto)}</p>
      ${phoneLine}
    </td>
    <td align="right" style="vertical-align:middle;text-align:right;">
      <table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:bottom;padding-right:8px;padding-bottom:2px;">
            <img src="${LOGO_MM}" alt="${esc(EMPRESA_MM)}" width="120" style="display:block;border:0;height:auto;"></td>
          <td style="vertical-align:bottom;padding-top:18px;">
            <img src="${MASCOTE}" alt="Mascote Grupo MM" width="66" style="display:block;border:0;height:auto;"></td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
