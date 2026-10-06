import { BarChart3, Building2, Image as ImageIcon, LayoutTemplate, Lock, Palette, Settings2 } from "lucide-react";
import { PageHead } from "../../components/ui";

const KPIS = [
  { label: "Materiais gerados / mês", v: "—" },
  { label: "Usuários ativos", v: "—" },
  { label: "Solicitações manuais", v: "—" },
];

const BLOCOS = [
  { icon: LayoutTemplate, t: "Modelos", d: "Cartões e assinaturas disponíveis para os colaboradores." },
  { icon: ImageIcon, t: "Molduras", d: "Molduras da foto corporativa (crachá, intranet, perfil)." },
  { icon: Palette, t: "Cores da marca", d: "Paleta oficial aplicada em todos os geradores." },
  { icon: Building2, t: "Logotipos", d: "Versões do logotipo do Grupo MM e das empresas." },
];

export default function AdminScreen() {
  return (
    <div className="screen">
      <PageHead icon={Settings2} fase={5} titulo="Área administrativa"
        sub="Gestão de modelos, molduras, cores e logotipos — Marketing / RH." />
      <div className="kpi-row">
        {KPIS.map((k) => (
          <div className="kpi" key={k.label}>
            <BarChart3 size={16} />
            <span className="kpi-v">{k.v}</span>
            <span className="kpi-l">{k.label}</span>
          </div>
        ))}
      </div>
      <div className="admin-grid">
        {BLOCOS.map((b) => (
          <div className="admin-card" key={b.t}>
            <div className="admin-icon"><b.icon size={20} /></div>
            <div>
              <h3>{b.t}</h3>
              <p>{b.d}</p>
            </div>
            <button className="btn btn-ghost" disabled>Gerenciar</button>
          </div>
        ))}
      </div>
      <div className="gov-note">
        <Lock size={15} />
        <p>Repositório único de marca: atualizações refletem automaticamente em todos os geradores e os materiais saem sempre travados no padrão.</p>
      </div>
    </div>
  );
}
