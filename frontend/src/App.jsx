const lots = [
  {
    id: 1,
    title: 'Mesa de jantar vintage',
    description: 'Peça artesanal com acabamento em madeira maciça.',
    currentBid: 1500,
    initialPrice: 1200,
    timeLeft: '02:18:12',
    status: 'Ativo',
  },
  {
    id: 2,
    title: 'Relógio antigo de parede',
    description: 'Relógio com mecanismo mecânico e caixa em latão.',
    currentBid: 980,
    initialPrice: 700,
    timeLeft: '00:45:56',
    status: 'Ativo',
  },
  {
    id: 3,
    title: 'Console retrô',
    description: 'Console clássico com acessórios originais.',
    currentBid: 2100,
    initialPrice: 1800,
    timeLeft: 'Encerrado',
    status: 'Encerrado',
  },
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">⌂</span>
          <span className="brand-name">Casa de Leilões</span>
        </div>
        <nav className="nav-links">
          <a href="#">Vitrine</a>
          <a href="#">Meu painel</a>
          <a href="#">Auditoria</a>
        </nav>
      </header>

      <main className="page">
        <section className="hero">
          <p className="eyebrow">Leilões ativos</p>
          <h1>Vitrine de lotes</h1>
        </section>

        <section className="overview-cards">
          <div className="stat-card">
            <span className="label">Lotes ativos</span>
            <strong>12</strong>
          </div>
          <div className="stat-card">
            <span className="label">Lances hoje</span>
            <strong>84</strong>
          </div>
          <div className="stat-card">
            <span className="label">Saldo disponível</span>
            <strong>R$ 4.200</strong>
          </div>
        </section>

        <section className="lot-grid">
          {lots.map((lot) => (
            <article key={lot.id} className="lot-card">
              <div className="lot-image">
                <span>Imagem</span>
              </div>

              <div className="lot-content">
                <div className="lot-header">
                  <h2>{lot.title}</h2>
                  <span className={`status-badge ${lot.status.toLowerCase()}`}>
                    {lot.status}
                  </span>
                </div>

                <p>{lot.description}</p>

                <div className="lot-meta">
                  <div>
                    <span>Valor inicial</span>
                    <strong>R$ {lot.initialPrice}</strong>
                  </div>
                  <div>
                    <span>Lance atual</span>
                    <strong>R$ {lot.currentBid}</strong>
                  </div>
                  <div>
                    <span>Tempo</span>
                    <strong>{lot.timeLeft}</strong>
                  </div>
                </div>

                <button type="button">Dar lance</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
