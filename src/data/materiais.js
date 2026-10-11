import { IMAGENS } from "../constants/imagens";

// Materiais institucionais prontos (sem personalização).
// As imagens são referenciadas em src/constants/imagens.js.
const montar = (lista, prefixo, rotulo) =>
  lista.map((src, i) => ({ id: `${prefixo}-${i + 1}`, label: `${rotulo} ${i + 1}`, src }));

export const CATEGORIAS_MATERIAIS = [
  {
    id: "meet",
    titulo: "Planos de fundo para Google Meet",
    descricao: "Use como fundo nas reuniões por vídeo.",
    tamanho: "1920 × 1080 px",
    proporcao: "16 / 9",
    itens: montar(IMAGENS.materiais.meet, "fundo-meet", "Fundo"),
  },
  {
    id: "linkedin",
    titulo: "Capas para LinkedIn",
    descricao: "Imagem de capa do seu perfil no LinkedIn.",
    tamanho: "1584 × 396 px",
    proporcao: "4 / 1",
    itens: montar(IMAGENS.materiais.linkedin, "capa-linkedin", "Capa"),
  },
];
