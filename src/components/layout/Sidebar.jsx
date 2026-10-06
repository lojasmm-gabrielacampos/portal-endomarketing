import { X } from "lucide-react";
import { NAV } from "../../data/geradores";
import { LOGO_MM, EMPRESA_MM } from "../../constants/brand";

export default function Sidebar({ view, open, onNavigate, onClose }) {
  return (
    <aside className={`side-nav ${open ? "open" : ""}`}>
      <div className="brand">
        <img src={LOGO_MM} alt={EMPRESA_MM} />
        <button className="close-nav" onClick={onClose} aria-label="Fechar menu"><X size={18} /></button>
      </div>
      <nav>
        {NAV.map((n) => (
          <button key={n.id} className={`nav-item ${view === n.id ? "active" : ""}`} onClick={() => onNavigate(n.id)}>
            <n.icon size={18} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="nav-foot">Acesso pela rede interna do Grupo MM</div>
    </aside>
  );
}
