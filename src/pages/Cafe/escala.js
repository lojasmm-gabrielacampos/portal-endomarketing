import { DIA_SEMANA, FERIADOS } from "../../constants/cafe";
import { pad2 } from "../../utils/format";

const feriadoDe = (ano, mes, d) => FERIADOS[`${ano}-${pad2(mes + 1)}-${pad2(d)}`];

// Preenche automaticamente os dias do mês selecionado; exclui domingo,
// (opcionalmente) sábado e os feriados nacionais.
export function construirDias(mes, ano, incluirSabado) {
  const total = new Date(ano, mes + 1, 0).getDate();
  const dias = [];
  for (let d = 1; d <= total; d++) {
    const wd = new Date(ano, mes, d).getDay(); // 0 = domingo ... 6 = sábado
    if (wd === 0) continue;
    if (wd === 6 && !incluirSabado) continue;
    if (feriadoDe(ano, mes, d)) continue;
    dias.push({ d, dia: DIA_SEMANA[wd], data: `${pad2(d)}/${pad2(mes + 1)}/${ano}` });
  }
  return dias;
}

// Sequência completa do mural: dias da escala intercalados com as faixas de
// fim de semana e de feriado (fins de semana no início/fim do mês são omitidos).
export function construirSequencia(mes, ano, incluirSabado, linhas) {
  const total = new Date(ano, mes + 1, 0).getDate();
  const porDia = new Map(linhas.map((l) => [l.d, l]));
  const seq = [];
  let fds = [];

  const fecharFds = () => {
    if (fds.length && seq.length) {
      const dd = fds.map((x) => pad2(x.d));
      seq.push({
        tipo: "fds",
        rotulo: fds.length === 1 ? DIA_SEMANA[fds[0].wd] : "Final de semana",
        datas: `${dd.join(" e ")}/${pad2(mes + 1)}`,
      });
    }
    fds = [];
  };

  for (let d = 1; d <= total; d++) {
    const wd = new Date(ano, mes, d).getDay();
    if (wd === 0 || (wd === 6 && !incluirSabado)) { fds.push({ d, wd }); continue; }
    const feriado = feriadoDe(ano, mes, d);
    fecharFds();
    if (feriado) seq.push({ tipo: "feriado", nome: feriado, datas: `${pad2(d)}/${pad2(mes + 1)}` });
    else if (porDia.has(d)) seq.push({ tipo: "dia", ...porDia.get(d) });
  }
  return seq;
}

// Distribuição automatizada e equilibrada (rodízio circular).
export function distribuir(dias, participantes, porDia) {
  const n = participantes.length;
  let ptr = 0;
  return dias.map((cell) => {
    const nomes = [];
    for (let k = 0; k < porDia; k++) nomes.push(participantes[ptr++ % n]);
    return { ...cell, nomes };
  });
}

// Quantas vezes cada participante aparece (para o resumo de equilíbrio).
export function contarOcorrencias(linhas, participantes) {
  const c = Object.fromEntries(participantes.map((p) => [p, 0]));
  linhas.forEach((l) => l.nomes.forEach((nm) => { c[nm] = (c[nm] || 0) + 1; }));
  const vals = Object.values(c);
  return { min: vals.length ? Math.min(...vals) : 0, max: vals.length ? Math.max(...vals) : 0 };
}
