import { useEffect, useRef, useState } from "react";
import { Camera, Download, Info, Upload } from "lucide-react";
import { Field, ImageDropzone, PageHead, StandardSeal } from "../../components/ui";
import { MOLDURAS } from "../../data/molduras";
import { baixarBlob } from "../../utils/files";
import { comporFoto, limitarOffset, FOTO_SIZE as S } from "./compor";
import { useMolduras } from "./useMolduras";

const AJUSTE_INICIAL = { zoom: 1, rot: 0, off: { x: 0, y: 0 } };

export default function FotoScreen() {
  const [imgUrl, setImgUrl] = useState(null);
  const [imgEl, setImgEl] = useState(null);
  const [zoom, setZoom] = useState(AJUSTE_INICIAL.zoom);
  const [rot, setRot] = useState(AJUSTE_INICIAL.rot);
  const [off, setOff] = useState(AJUSTE_INICIAL.off);
  const [drag, setDrag] = useState(null);
  const canvasRefs = useRef({});
  const { frames, prontas } = useMolduras(MOLDURAS);

  function redefinir() {
    setZoom(AJUSTE_INICIAL.zoom);
    setRot(AJUSTE_INICIAL.rot);
    setOff(AJUSTE_INICIAL.off);
  }

  // Recebe a foto enviada pelo colaborador
  function carregar(dataUrl) {
    const im = new Image();
    im.onload = () => { setImgEl(im); redefinir(); };
    im.src = dataUrl;
    setImgUrl(dataUrl);
  }

  // Redesenha todas as molduras quando algo muda
  useEffect(() => {
    MOLDURAS.forEach((m) => {
      const cv = canvasRefs.current[m.id];
      if (cv) comporFoto(cv, m, { img: imgEl, frame: frames.current[m.id], ajuste: { zoom, rot, off } });
    });
  }, [imgEl, zoom, rot, off, prontas, frames]);

  // Reposicionar a foto arrastando (mouse + toque)
  function pointDown(e) {
    if (!imgEl) return;
    const p = e.touches ? e.touches[0] : e;
    setDrag({ x: p.clientX, y: p.clientY, ox: off.x, oy: off.y, w: e.currentTarget.clientWidth });
  }
  function pointMove(e) {
    if (!drag) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = (p.clientX - drag.x) / drag.w;
    const dy = (p.clientY - drag.y) / drag.w;
    setOff({ x: limitarOffset(drag.ox + dx), y: limitarOffset(drag.oy + dy) });
  }
  function pointUp() { setDrag(null); }

  function baixar(m) {
    const cv = canvasRefs.current[m.id];
    if (cv) cv.toBlob((b) => baixarBlob(b, `foto-corporativa-${m.id}.png`), "image/png");
  }
  // Só baixa molduras já referenciadas em src/constants/imagens.js
  const disponiveis = MOLDURAS.filter((m) => m.src);
  function baixarTodas() { disponiveis.forEach((m, i) => setTimeout(() => baixar(m), i * 250)); }

  return (
    <div className="screen">
      <PageHead icon={Camera} titulo="Gerador de Foto Corporativa"
        sub="Envie sua foto, ajuste o enquadramento e baixe com a moldura institucional em PNG." />
      <div className="foto-work">
        <div className="form-card">
          <h3 className="form-title">Sua foto</h3>

          <ImageDropzone preenchido={!!imgUrl} onImagem={carregar}>
            {imgUrl ? (
              <>
                <img className="up-thumb" src={imgUrl} alt="Prévia da foto enviada" />
                <span>Trocar foto</span>
              </>
            ) : (
              <>
                <Upload size={22} />
                <span>Arraste a imagem ou clique para selecionar</span>
                <small>JPG ou PNG · rosto centralizado</small>
              </>
            )}
          </ImageDropzone>

          <div className={`foto-tools ${imgEl ? "" : "off"}`}>
            <Field label="Zoom">
              <input type="range" min="1" max="2.5" step="0.01" value={zoom}
                disabled={!imgEl} onChange={(e) => setZoom(Number(e.target.value))} />
            </Field>
            <div className="crop-controls">
              <button className="btn btn-ghost" disabled={!imgEl}
                onClick={() => setRot((r) => (r + 90) % 360)}>Girar 90°</button>
              <button className="btn btn-ghost" disabled={!imgEl} onClick={redefinir}>Redefinir</button>
            </div>
            <p className="tool-hint"><Info size={13} /> Arraste a foto na prévia para reposicionar.</p>
          </div>

          <div className="gen-row">
            <button className="btn btn-primary" disabled={!imgEl || disponiveis.length === 0} onClick={baixarTodas}>
              <Download size={16} /> Baixar com todas as molduras
            </button>
            <StandardSeal />
          </div>
        </div>

        <div className="foto-gallery-wrap">
          <div className="foto-gallery">
            {MOLDURAS.map((m) => (
              <div className="foto-result" key={m.id}>
                <div
                  className="foto-result-stage"
                  onMouseDown={pointDown} onMouseMove={pointMove}
                  onMouseUp={pointUp} onMouseLeave={pointUp}
                  onTouchStart={pointDown} onTouchMove={pointMove} onTouchEnd={pointUp}
                  style={{ cursor: imgEl ? "grab" : "default" }}
                >
                  <canvas ref={(el) => { canvasRefs.current[m.id] = el; }} width={S} height={S} />
                </div>
                <div className="foto-result-foot">
                  <span className="foto-result-label">{m.label}</span>
                  <button className="btn btn-primary sm" disabled={!imgEl || !m.src} onClick={() => baixar(m)}>
                    <Download size={15} /> Baixar PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="preview-note" style={{ textAlign: "left" }}>
            Saída em PNG {S}×{S} px, quadrada, no padrão do Grupo MM.
          </p>
        </div>
      </div>
    </div>
  );
}
