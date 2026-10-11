import { Home, PenLine, Coffee, Cake, Camera, FolderDown } from "lucide-react";

// Geradores na ordem da especificação (Descricao.md, seção 3)
export const GERADORES = [
  {
    id: "cafe",
    icon: Coffee,
    titulo: "Cronograma do Café",
    resumo: "Monta a escala mensal de responsáveis pelo café, pronta para o mural.",
  },
  {
    id: "assinatura",
    icon: PenLine,
    titulo: "Assinatura de E-mail",
    resumo: "Gera sua assinatura padronizada, com ou sem foto, para colar no e-mail.",
  },
  {
    id: "foto",
    icon: Camera,
    titulo: "Foto Corporativa",
    resumo: "Aplica a moldura institucional na sua foto e entrega o PNG final.",
  },
  {
    id: "aniversario",
    icon: Cake,
    titulo: "Calendário de Aniversariantes",
    resumo: "Organiza os aniversariantes do mês em uma arte pronta para imprimir.",
  },
];

export const MATERIAIS_NAV = {
  id: "materiais",
  icon: FolderDown,
  titulo: "Materiais para Download",
  resumo: "Planos de fundo para Google Meet e capas para LinkedIn.",
};

// Menu lateral: Início + geradores + Materiais
export const NAV = [
  { id: "home", label: "Início", icon: Home },
  ...GERADORES.map(({ id, titulo, icon }) => ({ id, label: titulo, icon })),
  { id: MATERIAIS_NAV.id, label: MATERIAIS_NAV.titulo, icon: MATERIAIS_NAV.icon },
];
