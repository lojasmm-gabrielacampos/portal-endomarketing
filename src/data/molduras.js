import { IMAGENS } from "../constants/imagens";

// Molduras institucionais (Foto Corporativa).
// A imagem de cada moldura é referenciada em src/constants/imagens.js.
// fx/fy/fr = centro e raio do recorte circular como fração do lado da imagem.
// Ajuste esses três valores para coincidir com o "buraco" de cada PNG.
export const MOLDURAS = [
  { id: "sou-mm", label: "#SouMM", src: IMAGENS.molduras.souMM, fx: 0.5, fy: 0.5, fr: 0.42 },
  { id: "orgulho-em-pertencer", label: "#OrgulhoEmPertencer", src: IMAGENS.molduras.orgulhoEmPertencer, fx: 0.5, fy: 0.5, fr: 0.42 },
];
