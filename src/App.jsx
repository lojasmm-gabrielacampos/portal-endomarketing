import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import {
  HomeScreen, CafeScreen, AssinaturaScreen,
  FotoScreen, AniversarioScreen, MateriaisScreen,
} from "./pages";
import "./styles/app.css";

const SCREENS = {
  home: HomeScreen,
  cafe: CafeScreen,
  assinatura: AssinaturaScreen,
  foto: FotoScreen,
  aniversario: AniversarioScreen,
  materiais: MateriaisScreen,
};

export default function App() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (v) => { setView(v); setMenuOpen(false); window.scrollTo(0, 0); };
  const Screen = SCREENS[view] ?? HomeScreen;

  return (
    <div className="app">
      <Sidebar view={view} open={menuOpen} onNavigate={go} onClose={() => setMenuOpen(false)} />

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <div className="main">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="content"><Screen go={go} /></main>
      </div>
    </div>
  );
}
