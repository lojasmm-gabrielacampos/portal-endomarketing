import { useMemo, useState } from "react";
import { Cake, CalendarDays, Download, Printer, AlertTriangle } from "lucide-react";
import { Field, PageHead, PreviewShell } from "../../components/ui";
import { MESES } from "../../constants/cafe";
import { exportarSvgComoPNG, imprimirSVG } from "../../utils/files";
import { lerAniversariantes } from "./lerAniversariantes";
import { construirCalendarioSVG, CAL_W, CAL_H } from "./calendarioSvg";

export default function AniversarioScreen() {
  const [mes, setMes] = useState(new Date().getMonth());
  const [texto, setTexto] = useState("");

  const { lista, ignorados, svg } = useMemo(() => {
    const { lista, ignorados } = lerAniversariantes(texto, mes);
    return { lista, ignorados, svg: construirCalendarioSVG({ mes, lista }) };
  }, [mes, texto]);

  const podeGerar = lista.length > 0;
  const nomeArq = `aniversariantes-${MESES[mes].toLowerCase()}`;

  return (
    <div className="screen">
      <PageHead icon={Cake} titulo="Gerador de Calendário de Aniversariantes"
        sub="Cole os aniversariantes do mês: o número vira o dia e o texto vira o nome, no formato dia | nome." />
      <div className="work">
        <div className="form-card">
          <h3 className="form-title">Aniversariantes</h3>

          <Field label="Mês">
            <select className="input" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </Field>

          <Field label="Dia e nome" hint="Um por linha, em qualquer ordem. Também dá para colar duas colunas do Excel.">
            <textarea className="input" rows={10} value={texto} onChange={(e) => setTexto(e.target.value)}
              placeholder={"05 Maria Silva\n12 João Pereira\nCarla Souza - 23\n…"} />
          </Field>

          <div className="calc-note">
            <CalendarDays size={15} />
            <span>
              {lista.length === 0
                ? "Nenhum aniversariante reconhecido ainda."
                : `${lista.length} aniversariante(s) em ${MESES[mes]}, em ordem de dia.`}
            </span>
          </div>

          {ignorados.length > 0 && (
            <div className="warn-note">
              <AlertTriangle size={15} />
              <div>
                <strong>{ignorados.length} linha(s) fora do calendário:</strong>
                <ul>
                  {ignorados.slice(0, 5).map((ig, i) => (
                    <li key={i}>“{ig.linha}” — {ig.motivo === "sem dia" ? "falta o dia" : ig.motivo === "sem nome" ? "falta o nome" : `dia não existe em ${MESES[mes]}`}</li>
                  ))}
                  {ignorados.length > 5 && <li>e mais {ignorados.length - 5}…</li>}
                </ul>
              </div>
            </div>
          )}

          <div className="gen-row">
            <button className="btn btn-primary" disabled={!podeGerar}
              onClick={() => exportarSvgComoPNG(svg, { largura: CAL_W, altura: CAL_H, nome: `${nomeArq}.png` })}>
              <Download size={16} /> Baixar imagem (PNG)
            </button>
            <button className="btn btn-ghost" disabled={!podeGerar} onClick={() => imprimirSVG(svg, "Aniversariantes")}>
              <Printer size={16} /> Imprimir / PDF
            </button>
          </div>
        </div>

        <div className="side">
          <PreviewShell aspect="portrait">
            <div className="mural-wrap" dangerouslySetInnerHTML={{ __html: svg }} />
            <span className="preview-note">A prévia atualiza enquanto você digita.</span>
          </PreviewShell>
        </div>
      </div>
    </div>
  );
}
