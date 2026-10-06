// Resolução de saída das fotos (quadrada)
export const FOTO_SIZE = 720;

// Compõe a foto do colaborador + a moldura em um canvas.
// `ajuste` = { zoom, rot (graus), off: { x, y } (fração do lado) }
export function comporFoto(canvas, moldura, { img, frame, ajuste, S = FOTO_SIZE }) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, S, S);
  const cx = moldura.fx * S, cy = moldura.fy * S, R = moldura.fr * S;

  ctx.save();
  if (img) {
    const { zoom, rot, off } = ajuste;
    const fill = ((2 * R) / Math.min(img.naturalWidth, img.naturalHeight)) * zoom;
    const dw = img.naturalWidth * fill, dh = img.naturalHeight * fill;
    ctx.beginPath(); ctx.arc(cx, cy, R + 4, 0, Math.PI * 2); ctx.clip();
    ctx.translate(cx + off.x * S, cy + off.y * S);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
  } else {
    // placeholder cinza no recorte enquanto não há foto
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#EFEFF1"; ctx.fillRect(0, 0, S, S);
  }
  ctx.restore();

  if (frame) {
    ctx.drawImage(frame, 0, 0, S, S);
  } else {
    // espaço reservado: moldura ainda não referenciada em src/constants/imagens.js
    ctx.save();
    ctx.setLineDash([14, 10]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#CFC8C9";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeRect(10, 10, S - 20, S - 20);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.fillRect(S / 2 - 150, S - 70, 300, 40);
    ctx.fillStyle = "#7C7476";
    ctx.font = "600 22px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Imagem da moldura", S / 2, S - 42);
    ctx.restore();
  }
}

// Limita o deslocamento da foto dentro da moldura
export const limitarOffset = (v) => Math.max(-0.25, Math.min(0.25, v));
