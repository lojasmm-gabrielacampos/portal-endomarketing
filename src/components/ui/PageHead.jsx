export default function PageHead({ icon: Icon, titulo, sub }) {
  return (
    <header className="page-head">
      <div className="page-head-icon"><Icon size={22} /></div>
      <div>
        <h1>{titulo}</h1>
        <p>{sub}</p>
      </div>
    </header>
  );
}
