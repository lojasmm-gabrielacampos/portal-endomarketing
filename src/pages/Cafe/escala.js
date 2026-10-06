import { DIA_SEMANA } from "../../constants/cafe";
import { pad2 } from "../../utils/format";

// Preenche automaticamente os dias do mês; exclui domingo e (opcionalmente) sábado.
export function construirDias(mes, ano, incluirSabado) {
  const total = new Date(ano, mes + 1, 0).getDate();
  const dias = [];
  for (let d = 1; d <= total; d++) {
    const wd = new Date(ano, mes, d).getDay(); // 0 = domingo ... 6 = sábado
    if (wd === 0) continue;
    if (wd === 6 && !incluirSabado) continue;
    dias.push({ dia: DIA_SEMANA[wd], data: `${pad2(d)}/${pad2(mes + 1)}/${ano}` });
  }
  return dias;
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
