import StandardSeal from "./StandardSeal";

export default function PreviewShell({ children, aspect = "landscape" }) {
  return (
    <div className="preview">
      <div className="preview-head">
        <span>Pré-visualização</span>
        <StandardSeal />
      </div>
      <div className={`preview-stage ${aspect}`}>{children}</div>
    </div>
  );
}
