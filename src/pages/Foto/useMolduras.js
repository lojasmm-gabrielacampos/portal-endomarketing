import { useEffect, useRef, useState } from "react";

// Pré-carrega as imagens das molduras uma única vez.
// Retorna um ref { [id]: HTMLImageElement } e um flag indicando que terminou.
export function useMolduras(molduras) {
  const framesRef = useRef({});
  // sem nenhuma imagem referenciada, não há o que carregar
  const [prontas, setProntas] = useState(() => !molduras.some((m) => m.src));

  useEffect(() => {
    const comImagem = molduras.filter((m) => m.src); // molduras ainda sem imagem são ignoradas
    let restantes = comImagem.length;
    if (restantes === 0) return;
    const concluir = () => { if (--restantes === 0) setProntas(true); };
    comImagem.forEach((m) => {
      const im = new Image();
      im.onload = () => { framesRef.current[m.id] = im; concluir(); };
      im.onerror = concluir; // moldura ausente/inválida não trava o carregamento
      im.src = m.src;
    });
  }, [molduras]);

  return { frames: framesRef, prontas };
}
