import { ImageOff } from "lucide-react";

// Espaço reservado para uma imagem ainda não referenciada em src/constants/imagens.js
export default function ImagemReservada({ titulo, detalhe, proporcao = "1 / 1" }) {
  return (
    <div className="img-reservada" style={{ aspectRatio: proporcao }}>
      <ImageOff size={20} />
      <strong>{titulo}</strong>
      {detalhe && <small>{detalhe}</small>}
    </div>
  );
}
