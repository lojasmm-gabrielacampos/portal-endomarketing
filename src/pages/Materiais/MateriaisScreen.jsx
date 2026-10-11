import { FolderDown, Download } from "lucide-react";
import { ImagemReservada, PageHead } from "../../components/ui";
import { CATEGORIAS_MATERIAIS } from "../../data/materiais";
import { baixarURL, extensaoDe } from "../../utils/files";

const baixar = (item) => baixarURL(item.src, `${item.id}.${extensaoDe(item.src)}`);

export default function MateriaisScreen() {
  const disponiveis = CATEGORIAS_MATERIAIS.flatMap((c) => c.itens).filter((i) => i.src);

  function baixarTodos() {
    disponiveis.forEach((item, i) => setTimeout(() => baixar(item), i * 300));
  }

  return (
    <div className="screen">
      <PageHead icon={FolderDown} titulo="Materiais para Download"
        sub="Modelos institucionais prontos para usar. Baixe um por um ou todos de uma vez." />

      <div className="mat-toolbar">
        <button className="btn btn-primary" disabled={disponiveis.length === 0} onClick={baixarTodos}>
          <Download size={16} /> Baixar todos ({disponiveis.length})
        </button>
      </div>

      {CATEGORIAS_MATERIAIS.map((cat) => (
        <section key={cat.id} className="mat-section">
          <div className="mat-head">
            <h2>{cat.titulo}</h2>
            <p>{cat.descricao} Tamanho: {cat.tamanho}.</p>
          </div>
          <div className={`mat-grid mat-${cat.id}`}>
            {cat.itens.map((item) => (
              <figure key={item.id} className="mat-item">
                {item.src ? (
                  <img src={item.src} alt={item.label} style={{ aspectRatio: cat.proporcao }} />
                ) : (
                  <ImagemReservada titulo="Imagem a definir" detalhe={cat.tamanho} proporcao={cat.proporcao} />
                )}
                <figcaption>
                  <span>{item.label}</span>
                  <button className="btn btn-ghost sm" disabled={!item.src} onClick={() => baixar(item)}>
                    <Download size={14} /> Baixar
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
