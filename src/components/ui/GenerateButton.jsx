import { Info } from "lucide-react";

// Ação primária desabilitada — gerador ainda não implementado neste protótipo
export default function GenerateButton({ children }) {
  return (
    <div className="gen-row">
      <button className="btn btn-primary" disabled>
        {children}
      </button>
      <span className="gen-note">
        <Info size={13} /> Ação ainda não ativa neste protótipo de estrutura.
      </span>
    </div>
  );
}
