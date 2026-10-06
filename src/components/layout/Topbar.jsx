import { Menu } from "lucide-react";

export default function Topbar({ onOpenMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onOpenMenu} aria-label="Abrir menu"><Menu size={20} /></button>
      <span className="topbar-title">Portal de Endomarketing</span>
    </header>
  );
}
