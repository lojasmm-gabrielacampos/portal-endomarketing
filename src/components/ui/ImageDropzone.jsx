import { useRef } from "react";
import { lerImagemComoDataURL } from "../../utils/files";

// Área de upload de imagem (clique ou arrastar). Usada na Assinatura e na Foto Corporativa.
// `children` recebe o conteúdo visual; `onImagem(dataUrl)` é chamado com a imagem lida.
export default function ImageDropzone({ preenchido, onImagem, inputRef, className = "", children }) {
  const proprioRef = useRef(null);
  const ref = inputRef || proprioRef;
  const carregar = (file) => lerImagemComoDataURL(file, onImagem);

  return (
    <>
      <div
        className={`dropzone up ${preenchido ? "has" : ""} ${className}`.trim()}
        onClick={() => ref.current && ref.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); carregar(e.dataTransfer.files[0]); }}
      >
        {children}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden
        onChange={(e) => carregar(e.target.files[0])} />
    </>
  );
}
