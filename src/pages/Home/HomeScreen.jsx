import { ChevronRight } from "lucide-react";
import { GERADORES, MATERIAIS_NAV } from "../../data/geradores";
import { LOGO_MM, EMPRESA_MM } from "../../constants/brand";

function Card({ item, onClick }) {
  return (
    <button className="card" onClick={onClick}>
      <div className="card-icon"><item.icon size={22} /></div>
      <div className="card-body">
        <h3>{item.titulo}</h3>
        <p>{item.resumo}</p>
      </div>
      <span className="card-open">Abrir <ChevronRight size={16} /></span>
    </button>
  );
}

export default function HomeScreen({ go }) {
  return (
    <div className="screen">
      <section className="hero">
        <div className="hero-copy">
          <h1>Materiais internos no padrão Grupo MM, em poucos cliques.</h1>
          <p>
            Escolha um gerador, preencha o formulário e baixe, imprima ou copie
            o material pronto — sem precisar de conhecimento em design.
          </p>
        </div>
        <div className="hero-chip">
          <img src={LOGO_MM} alt={EMPRESA_MM} />
        </div>
      </section>

      <h2 className="section-title">Geradores</h2>
      <div className="cards">
        {GERADORES.map((g) => <Card key={g.id} item={g} onClick={() => go(g.id)} />)}
      </div>

      <h2 className="section-title">Materiais prontos</h2>
      <div className="cards">
        <Card item={MATERIAIS_NAV} onClick={() => go(MATERIAIS_NAV.id)} />
      </div>
    </div>
  );
}
