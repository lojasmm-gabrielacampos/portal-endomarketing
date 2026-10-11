// Identifica automaticamente o número como dia e o texto como nome.
// Aceita um aniversariante por linha, em qualquer ordem e separador:
//   "05 Maria Silva", "Maria Silva - 05", "12/05 João", "João\t12" (colado do Excel)
const SEP = /^[\s|;:,.\-–—]+|[\s|;:,.\-–—]+$/g;

// Quantos dias o mês pode ter para aniversários (fevereiro aceita 29).
export const diasNoMes = (mes) => new Date(2024, mes + 1, 0).getDate();

export function lerAniversariantes(texto, mes) {
  const maxDia = diasNoMes(mes);
  const lista = [];
  const ignorados = [];

  texto.split(/\r?\n/).forEach((bruta) => {
    const linha = bruta.trim();
    if (!linha) return;

    // primeiro número de 1–2 dígitos (pode vir como data dd/mm ou dd/mm/aaaa)
    const m = linha.match(/(^|\D)(\d{1,2})(?:\s*[/.-]\s*\d{1,2}(?:\s*[/.-]\s*\d{2,4})?)?(?!\d)/);
    if (!m) { ignorados.push({ linha, motivo: "sem dia" }); return; }

    const dia = Number(m[2]);
    const inicio = m.index + m[1].length;
    const nome = `${linha.slice(0, inicio)} ${linha.slice(m.index + m[0].length)}`
      .replace(/\s+/g, " ")
      .replace(SEP, "")
      .trim();

    if (!nome) { ignorados.push({ linha, motivo: "sem nome" }); return; }
    if (dia < 1 || dia > maxDia) { ignorados.push({ linha, motivo: "dia inválido" }); return; }
    lista.push({ dia, nome });
  });

  lista.sort((a, b) => a.dia - b.dia || a.nome.localeCompare(b.nome, "pt-BR"));
  return { lista, ignorados };
}
