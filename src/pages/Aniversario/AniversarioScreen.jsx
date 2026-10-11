import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cake, ChevronLeft, ChevronRight, Download, Printer, AlertTriangle, X, Copy, Undo2 } from "lucide-react";
import { PageHead, PreviewShell } from "../../components/ui";
import { MESES } from "../../constants/cafe";
import { exportarSvgComoPNG, imprimirSVG } from "../../utils/files";
import { lerAniversariantes, diasNoMes } from "./lerAniversariantes";
import { construirCalendarioSVG, calcularLayout, caixaDoMes, corDoMes, CAL_W, CAL_H } from "./calendarioSvg";
import { ANOS, useAniversariantes, mesmaPessoa } from "./useAniversariantes";
import "./aniversario.css";

const anoInicial = () => {
  const atual = new Date().getFullYear();
  return ANOS.includes(atual) ? atual : ANOS[0];
};
const ehCampo = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
const pct = (v, total) => `${(v / total) * 100}%`;

export default function AniversarioScreen() {
  const api = useAniversariantes();
  const [ano, setAno] = useState(anoInicial);
  const [mes, setMes] = useState(new Date().getMonth());

  // Entrada rápida
  const [dia, setDia] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [colagem, setColagem] = useState(null);
  const [recente, setRecente] = useState(null);
  const [desfazer, setDesfazer] = useState(null);
  const diaRef = useRef(null);
  const nomeRef = useRef(null);

  const [fontesProntas, setFontesProntas] = useState(0);
  const meses = api.mesesDoAno(ano);
  const lista = meses[mes];
  const maxDia = diasNoMes(mes);
  const nomeMes = MESES[mes];

  const { svg, layout } = useMemo(
    () => ({ svg: construirCalendarioSVG({ meses }), layout: calcularLayout(meses) }),
    // fontesProntas: refaz as medidas dos nomes quando as fontes da arte terminam de carregar
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meses, fontesProntas],
  );
  const infoMes = layout[mes];
  const truncados = useMemo(
    () => new Set(infoMes.itens.filter((p) => p.truncado).map((p) => p.id)),
    [infoMes],
  );
  const totalAno = (a) => api.mesesDoAno(a).reduce((s, l) => s + l.length, 0);
  const total = totalAno(ano);
  const outroAno = ANOS.find((a) => a !== ano && totalAno(a) > 0);

  useEffect(() => {
    if (!document.fonts?.load) return;
    Promise.all([document.fonts.load("16px 'DM Sans'"), document.fonts.load("26px 'Bobby Jones'")])
      .then(() => setFontesProntas((v) => v + 1))
      .catch(() => {});
  }, []);

  // ── Navegação ───────────────────────────────────────────────
  const irPara = useCallback((delta) => {
    setMes((m) => (m + delta + 12) % 12);
    setErro("");
    setColagem(null);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Só troca de mês fora dos campos — exceto no campo "Dia" da entrada rápida vazia,
      // para dar para passar de mês sem tirar a mão do teclado.
      const entradaVazia = e.target === diaRef.current && !diaRef.current.value && !nomeRef.current?.value;
      if (ehCampo(e.target) && !entradaVazia) return;
      e.preventDefault();
      irPara(e.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [irPara]);

  useEffect(() => {
    if (!recente) return;
    const t = setTimeout(() => setRecente(null), 1200);
    return () => clearTimeout(t);
  }, [recente]);

  useEffect(() => {
    if (!desfazer) return;
    const t = setTimeout(() => setDesfazer(null), 7000);
    return () => clearTimeout(t);
  }, [desfazer]);

  // ── Inclusão ────────────────────────────────────────────────
  const incluir = (pessoas) => {
    const novas = pessoas.filter((p, i) =>
      !lista.some((q) => mesmaPessoa(p, q)) && !pessoas.slice(0, i).some((q) => mesmaPessoa(p, q)));
    if (novas.length) {
      const criados = api.adicionar(ano, mes, novas);
      setRecente(criados[criados.length - 1].id);
    }
    return { incluidos: novas.length, repetidos: pessoas.length - novas.length };
  };

  const adicionar = () => {
    const d = Number(dia);
    const n = nome.trim().replace(/\s+/g, " ");
    if (!dia) { setErro("Informe o dia."); diaRef.current.focus(); return; }
    if (d < 1 || d > maxDia) { setErro(`${nomeMes} vai do dia 1 ao ${maxDia}.`); diaRef.current.select(); return; }
    if (!n) { setErro("Informe o nome."); nomeRef.current.focus(); return; }
    const { repetidos } = incluir([{ dia: d, nome: n }]);
    setErro(repetidos ? `${n} já está no dia ${d}.` : "");
    setColagem(null);
    setDia(""); setNome("");
    diaRef.current.focus();
  };

  const onDiaChange = (e) => {
    const bruto = e.target.value;
    setErro("");
    // "12 Maria" digitado de uma vez: o espaço já leva para o nome
    const junto = bruto.match(/^\s*(\d{1,2})\s+(.*)$/);
    if (junto) {
      setDia(junto[1]);
      if (junto[2]) setNome((n) => n || junto[2]);
      nomeRef.current.focus();
      return;
    }
    const v = bruto.replace(/\D/g, "").slice(0, 2);
    setDia(v);
    // Avança sozinho quando não existe outro dia possível começando por esse número
    if (v && (v.length === 2 || Number(v) * 10 > maxDia)) nomeRef.current.focus();
  };

  const onDiaKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); if (dia) nomeRef.current.focus(); else if (nome) adicionar(); }
    if (e.key === "Escape") { setDia(""); setNome(""); setErro(""); }
  };

  const onNomeKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); adicionar(); }
    if (e.key === "Backspace" && !nome) { e.preventDefault(); diaRef.current.focus(); }
    if (e.key === "Escape") { setDia(""); setNome(""); setErro(""); diaRef.current.focus(); }
  };

  // Colar várias linhas (ou "12 Maria" no campo Dia) adiciona tudo de uma vez
  const onColar = (e) => {
    const txt = e.clipboardData.getData("text");
    const variasLinhas = /\r?\n/.test(txt.trim());
    const diaComNome = e.currentTarget === diaRef.current && /\d/.test(txt) && /[^\d\s]/.test(txt);
    if (!variasLinhas && !diaComNome) return;
    e.preventDefault();
    const { lista: lidos, ignorados } = lerAniversariantes(txt, mes);
    const r = incluir(lidos);
    setColagem({ ...r, ignorados });
    setDia(""); setNome(""); setErro("");
    diaRef.current.focus();
  };

  // ── Edição / remoção ────────────────────────────────────────
  const remover = (pessoa) => {
    api.remover(ano, mes, pessoa.id);
    setDesfazer({ ano, mes, pessoa });
  };

  const salvar = (pessoa, dados, { avancar } = {}) => {
    const atualizada = dados ? { ...pessoa, ...dados } : null;
    if (atualizada === null) remover(pessoa);
    else if (atualizada.dia !== pessoa.dia || atualizada.nome !== pessoa.nome) api.atualizar(ano, mes, pessoa.id, dados);
    if (!avancar) return;
    // Descobre quem vem depois já na nova ordem
    const nova = api.ordenar(lista.map((p) => (p.id === pessoa.id ? atualizada : p)).filter(Boolean));
    const i = atualizada ? nova.findIndex((p) => p.id === pessoa.id) : lista.findIndex((p) => p.id === pessoa.id) - 1;
    focarDepois(nova[i + 1]?.id);
  };

  // Espera a lista reordenar e então foca a próxima linha (ou a entrada rápida)
  const focarDepois = (id) => requestAnimationFrame(() => {
    const el = id ? document.querySelector(`[data-linha="${id}"] input[name="dia"]`) : diaRef.current;
    el?.focus();
    el?.select?.();
  });

  const exportar = (tipo) => {
    const nomeArq = `calendario-aniversariantes-${ano}`;
    if (tipo === "png") exportarSvgComoPNG(svg, { largura: CAL_W, altura: CAL_H, nome: `${nomeArq}.png` });
    else imprimirSVG(svg, `Aniversariantes ${ano}`);
  };

  const corMes = corDoMes(mes);

  return (
    <div className="screen">
      <PageHead icon={Cake} titulo="Calendário de Aniversariantes"
        sub="Digite dia e nome, Enter para o próximo. ← → trocam o mês." />
      <div className="work">
        <div className="form-card aniv-card">
          {/* Ano */}
          <div className="segmented aniv-anos" role="radiogroup" aria-label="Ano">
            {ANOS.map((a) => (
              <button key={a} type="button" role="radio" aria-checked={a === ano}
                className={a === ano ? "active" : ""} onClick={() => setAno(a)}>
                {a}<small>{totalAno(a) || "—"}</small>
              </button>
            ))}
          </div>

          {total === 0 && outroAno && (
            <button type="button" className="btn btn-ghost aniv-copiar" onClick={() => api.copiarAno(outroAno, ano)}>
              <Copy size={15} /> Usar os aniversariantes de {outroAno} em {ano}
            </button>
          )}

          {/* Mês */}
          <div className="aniv-nav" style={{ "--cor-mes": corMes }}>
            <button type="button" className="aniv-seta" onClick={() => irPara(-1)} aria-label="Mês anterior">
              <ChevronLeft size={20} />
            </button>
            <div className="aniv-mes" aria-live="polite">
              <strong>{nomeMes}</strong>
              <span>{lista.length ? `${lista.length} aniversariante${lista.length > 1 ? "s" : ""}` : "Nenhum aniversariante"}</span>
            </div>
            <button type="button" className="aniv-seta" onClick={() => irPara(1)} aria-label="Próximo mês">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="aniv-chips">
            {MESES.map((m, i) => (
              <button key={m} type="button" title={m}
                className={`aniv-chip${i === mes ? " is-ativo" : ""}`}
                style={{ "--cor-mes": corDoMes(i) }} onClick={() => setMes(i)}>
                {m.slice(0, 3)}
                {meses[i].length > 0 && <small>{meses[i].length}</small>}
              </button>
            ))}
          </div>

          {/* Entrada rápida */}
          <div className="aniv-entrada">
            <input ref={diaRef} className="input aniv-dia" name="dia" inputMode="numeric" autoComplete="off"
              placeholder="Dia" aria-label="Dia" value={dia} autoFocus
              onChange={onDiaChange} onKeyDown={onDiaKey} onPaste={onColar} />
            <input ref={nomeRef} className="input" name="nome" autoComplete="off"
              placeholder="Nome do aniversariante" aria-label="Nome" value={nome}
              onChange={(e) => { setNome(e.target.value); setErro(""); }} onKeyDown={onNomeKey} onPaste={onColar} />
            <button type="button" className="btn btn-primary aniv-add" onClick={adicionar}>Adicionar</button>
          </div>
          <p className={`aniv-dica${erro ? " is-erro" : ""}`} role={erro ? "alert" : undefined}>
            {erro || "Enter avança · cole uma lista para incluir várias pessoas de uma vez"}
          </p>

          {colagem && (
            <div className={colagem.ignorados.length ? "warn-note" : "calc-note"}>
              {colagem.ignorados.length > 0 && <AlertTriangle size={15} />}
              <div>
                <strong>{colagem.incluidos} incluído(s)</strong>
                {colagem.repetidos > 0 && ` · ${colagem.repetidos} já estava(m) na lista`}
                {colagem.ignorados.length > 0 && (
                  <ul>
                    {colagem.ignorados.slice(0, 4).map((ig, i) => (
                      <li key={i}>“{ig.linha}” — {ig.motivo === "sem dia" ? "falta o dia" : ig.motivo === "sem nome" ? "falta o nome" : `dia não existe em ${nomeMes}`}</li>
                    ))}
                    {colagem.ignorados.length > 4 && <li>e mais {colagem.ignorados.length - 4}…</li>}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Lista do mês */}
          {lista.length > 0 && (
            <ol className="aniv-lista">
              {lista.map((p, i) => (
                <li key={p.id} className="aniv-item">
                  {i === infoMes.linhas && <span className="aniv-sep">continua na 2ª coluna</span>}
                  <LinhaAniversariante pessoa={p} maxDia={maxDia}
                    recente={p.id === recente} truncado={truncados.has(p.id)}
                    foraDaArte={i >= infoMes.linhas * 2}
                    onSalvar={salvar} onRemover={remover} />
                </li>
              ))}
            </ol>
          )}

          {infoMes.excedentes.length > 0 && (
            <div className="warn-note">
              <AlertTriangle size={15} />
              <span>{infoMes.excedentes.length} nome(s) não cabem na caixa de {nomeMes}. Abrevie ou remova alguns.</span>
            </div>
          )}

          {desfazer && (
            <div className="aniv-desfazer" role="status">
              <span>{desfazer.pessoa.nome} removido(a).</span>
              <button type="button" onClick={() => { api.restaurar(desfazer.ano, desfazer.mes, desfazer.pessoa); setDesfazer(null); }}>
                <Undo2 size={14} /> Desfazer
              </button>
            </div>
          )}

          <div className="gen-row">
            <button className="btn btn-primary" disabled={!total} onClick={() => exportar("png")}>
              <Download size={16} /> Baixar imagem (PNG)
            </button>
            <button className="btn btn-ghost" disabled={!total} onClick={() => exportar("pdf")}>
              <Printer size={16} /> Imprimir / PDF
            </button>
          </div>
        </div>

        <div className="side">
          <PreviewShell aspect="portrait">
            <div className="aniv-preview">
              <div className="aniv-arte" dangerouslySetInnerHTML={{ __html: svg }} />
              {MESES.map((m, i) => {
                const c = caixaDoMes(i);
                return (
                  <button key={m} type="button" tabIndex={-1} aria-label={`Editar ${m}`}
                    className={`aniv-alvo${i === mes ? " is-ativo" : ""}`}
                    style={{ left: pct(c.x, CAL_W), top: pct(c.y, CAL_H), width: pct(c.w, CAL_W), height: pct(c.h, CAL_H) }}
                    onClick={() => { setMes(i); diaRef.current?.focus(); }} />
                );
              })}
            </div>
            <span className="preview-note">Clique em um mês da prévia para editá-lo.</span>
          </PreviewShell>
        </div>
      </div>
    </div>
  );
}

// Linha editável: altera ao sair do campo ou com Enter; nome vazio remove.
function LinhaAniversariante({ pessoa, maxDia, recente, truncado, foraDaArte, onSalvar, onRemover }) {
  const [dia, setDia] = useState(String(pessoa.dia));
  const [nome, setNome] = useState(pessoa.nome);
  const nomeRef = useRef(null);
  const cancelando = useRef(false);

  useEffect(() => { setDia(String(pessoa.dia)); setNome(pessoa.nome); }, [pessoa.dia, pessoa.nome]);

  const confirmar = (opcoes) => {
    const n = nome.trim().replace(/\s+/g, " ");
    const d = Number(dia);
    if (!n) return onSalvar(pessoa, null, opcoes);
    const diaOk = d >= 1 && d <= maxDia;
    if (!diaOk) setDia(String(pessoa.dia));
    onSalvar(pessoa, { dia: diaOk ? d : pessoa.dia, nome: n }, opcoes);
  };

  const reverter = (e) => {
    cancelando.current = true;
    setDia(String(pessoa.dia)); setNome(pessoa.nome);
    e.currentTarget.blur();
  };

  const onBlur = (e) => {
    if (cancelando.current) { cancelando.current = false; return; }
    if (e.currentTarget.closest("[data-linha]")?.contains(e.relatedTarget)) return;
    confirmar();
  };

  return (
    <div className={`aniv-linha${recente ? " is-recente" : ""}${foraDaArte ? " is-fora" : ""}`} data-linha={pessoa.id}>
      <input name="dia" className="aniv-campo aniv-campo-dia" inputMode="numeric" aria-label="Dia"
        value={dia} onChange={(e) => setDia(e.target.value.replace(/\D/g, "").slice(0, 2))}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); nomeRef.current.focus(); nomeRef.current.select(); }
          if (e.key === "Escape") reverter(e);
        }}
        onBlur={onBlur} onFocus={(e) => e.target.select()} />
      <span className="aniv-ponto" aria-hidden="true">·</span>
      <input ref={nomeRef} name="nome" className="aniv-campo" aria-label="Nome" value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); confirmar({ avancar: true }); }
          if (e.key === "Escape") reverter(e);
        }}
        onBlur={onBlur} />
      {truncado && <span className="aniv-tag" title="Nome longo: aparece abreviado no calendário">abreviado</span>}
      <button type="button" className="aniv-remover" aria-label={`Remover ${pessoa.nome}`} title="Remover"
        onMouseDown={(e) => e.preventDefault()} onClick={() => onRemover(pessoa)}>
        <X size={15} />
      </button>
    </div>
  );
}
