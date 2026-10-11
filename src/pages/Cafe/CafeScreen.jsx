import { useMemo, useState } from "react";
import { Coffee, CalendarDays, Download, Printer } from "lucide-react";
import { Field, PageHead, PreviewShell } from "../../components/ui";
import { MESES, ANOS } from "../../constants/cafe";
import { exportarSvgComoPNG, imprimirSVG } from "../../utils/files";
import { construirDias, distribuir, contarOcorrencias } from "./escala";
import { construirMuralSVG, MURAL_W, MURAL_H } from "./muralSvg";

export default function CafeScreen() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(ANOS.includes(hoje.getFullYear()) ? hoje.getFullYear() : ANOS[0]);
  const [porDia, setPorDia] = useState(2);
  const [sabado, setSabado] = useState(false);
  const [texto, setTexto] = useState("");

  const { dias, podeGerar, svg, eq } = useMemo(() => {
    const participantes = texto.split("\n").map((s) => s.trim()).filter(Boolean);
    const dias = construirDias(mes, ano, sabado);
    const podeGerar = participantes.length > 0 && participantes.length >= porDia;
    const linhas = podeGerar ? distribuir(dias, participantes, porDia) : [];
    return {
      dias,
      podeGerar,
      svg: construirMuralSVG({ mes, ano, porDia, sabado, linhas }),
      eq: contarOcorrencias(linhas, participantes),
    };
  }, [mes, ano, porDia, sabado, texto]);

  const nomeArq = `cronograma-cafe-${MESES[mes].toLowerCase()}-${ano}`;

  return (
    <div className="screen">
      <PageHead icon={Coffee} titulo="Gerador do Cronograma do Café"
        sub="Distribui os turnos de forma equilibrada e monta o mural no padrão do Grupo MM." />
      <div className="work">
        <div className="form-card">
          <h3 className="form-title">Configuração da escala</h3>

          <div className="grid-2">
            <Field label="Mês">
              <select className="input" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </Field>
            <Field label="Ano">
              <select className="input" value={ano} onChange={(e) => setAno(Number(e.target.value))}>
                {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Participantes" hint="Um nome por linha — a ordem define o rodízio">
            <textarea className="input" rows={7} value={texto} onChange={(e) => setTexto(e.target.value)}
              placeholder={"Ana\nBruno\nCarla\n…"} />
          </Field>

          <div className="grid-2">
            <Field label="Responsáveis por dia">
              <div className="segmented">
                <button type="button" className={porDia === 1 ? "active" : ""} onClick={() => setPorDia(1)}>1 pessoa</button>
                <button type="button" className={porDia === 2 ? "active" : ""} onClick={() => setPorDia(2)}>Dupla</button>
              </div>
            </Field>
            <Field label="Sábado">
              <label className="switch-row">
                <input type="checkbox" checked={sabado} onChange={(e) => setSabado(e.target.checked)} />
                <span>Incluir sábado na escala</span>
              </label>
            </Field>
          </div>

          <div className="calc-note">
            <CalendarDays size={15} />
            {podeGerar ? (
              <span>{dias.length} dias em {MESES[mes]}/{ano} · cada pessoa entra {eq.min === eq.max ? `${eq.min}` : `${eq.min}–${eq.max}`} vez(es).</span>
            ) : (
              <span>{dias.length} dias em {MESES[mes]}/{ano}. Adicione ao menos {porDia === 2 ? "2 participantes" : "1 participante"} para gerar a escala.</span>
            )}
          </div>

          <div className="gen-row">
            <button className="btn btn-primary" disabled={!podeGerar}
              onClick={() => exportarSvgComoPNG(svg, { largura: MURAL_W, altura: MURAL_H, nome: `${nomeArq}.png` })}>
              <Download size={16} /> Baixar imagem (PNG)
            </button>
            <button className="btn btn-ghost" disabled={!podeGerar} onClick={() => imprimirSVG(svg, "Cronograma do Café")}>
              <Printer size={16} /> Imprimir / PDF
            </button>
          </div>
        </div>

        <div className="side">
          <PreviewShell aspect="portrait">
            <div className="mural-wrap" dangerouslySetInnerHTML={{ __html: svg }} />
            <span className="preview-note">Mural padronizado — atualiza em tempo real conforme os campos.</span>
          </PreviewShell>
          <div className="outputs">
            <h4>Saídas</h4>
            <p className="out-line"><Download size={14} /> Imagem PNG em alta resolução (compartilhar)</p>
            <p className="out-line"><Printer size={14} /> Impressão A4 / salvar em PDF (mural)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
