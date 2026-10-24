import { useState } from 'react';

const lots = [
  {
    id: 1,
    title: 'Mesa de jantar vintage',
    description: 'Peça artesanal com acabamento em madeira maciça.',
    currentBid: 1500,
    initialPrice: 1200,
    minimumIncrement: 50,
    timeLeft: '02:18:12',
    status: 'Ativo',
    seller: 'Leiloeiro oficial',
    winner: 'João',
  },
  {
    id: 2,
    title: 'Relógio antigo de parede',
    description: 'Relógio com mecanismo mecânico e caixa em latão.',
    currentBid: 980,
    initialPrice: 700,
    minimumIncrement: 20,
    timeLeft: '00:45:56',
    status: 'Ativo',
    seller: 'Antiga coleção',
    winner: 'Maria',
  },
  {
    id: 3,
    title: 'Console retrô',
    description: 'Console clássico com acessórios originais.',
    currentBid: 2100,
    initialPrice: 1800,
    minimumIncrement: 100,
    timeLeft: 'Encerrado',
    status: 'Encerrado',
    seller: 'Coleção retrô',
    winner: 'Paulo',
  },
];

const auditLogs = [
  { id: 1, action: 'Lote criado', details: 'Mesa de jantar vintage publicada no início da sessão.', createdAt: '2026-10-24 10:10' },
  { id: 2, action: 'Lance registrado', details: 'João entrou com lance de R$ 1.500.', createdAt: '2026-10-24 10:15' },
  { id: 3, action: 'Lote encerrado', details: 'Relógio de parede foi arrematado por Maria.', createdAt: '2026-10-24 10:31' },
];

const tabs = [
  'Vitrine',
  'Leiloeiro',
  'Lote ao vivo',
  'Carteira',
  'Auditoria',
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Vitrine');
  const selectedLot = lots[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">⌂</span>
          <span className="brand-name">Casa de Leilões</span>
        </div>

        <nav className="nav-links" aria-label="Navegação principal">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="page">
        {activeTab === 'Vitrine' && (
          <>
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
          </>
        )}

        {activeTab === 'Leiloeiro' && (
          <section className="panel-section">
            <div className="section-header">
              <p className="eyebrow">Painel do leiloeiro</p>
              <h2>Gestão de lotes</h2>
            </div>

            <div className="two-column-grid">
              <div className="panel-box">
                <h3>Novo lote</h3>
                <form className="field-form">
                  <label>
                    <span>Título</span>
                    <input type="text" defaultValue="Coleção de arte" />
                  </label>
                  <label>
                    <span>Valor inicial</span>
                    <input type="number" defaultValue="1000" />
                  </label>
                  <label>
                    <span>Incremento mínimo</span>
                    <input type="number" defaultValue="50" />
                  </label>
                  <button type="button">Publicar lote</button>
                </form>
              </div>

              <div className="panel-box">
                <h3>Lotes em andamento</h3>
                <ul className="list-block">
                  {lots.map((lot) => (
                    <li key={lot.id}>
                      <div>
                        <strong>{lot.title}</strong>
                        <span>{lot.currentBid ? `Lance atual: R$ ${lot.currentBid}` : 'Sem lances'}</span>
                      </div>
                      <button type="button" className="secondary-button">Encerrar</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Lote ao vivo' && (
          <section className="panel-section">
            <div className="section-header">
              <p className="eyebrow">Sala do lote</p>
              <h2>{selectedLot.title}</h2>
            </div>

            <div className="live-grid">
              <div className="panel-box">
                <div className="lot-live-card">
                  <div className="lot-live-image">Imagem do lote</div>
                  <div className="live-info">
                    <span>Leiloeiro</span>
                    <strong>{selectedLot.seller}</strong>
                    <span>Tempo restante</span>
                    <strong>{selectedLot.timeLeft}</strong>
                    <span>Incremento mínimo</span>
                    <strong>R$ {selectedLot.minimumIncrement}</strong>
                  </div>
                </div>
              </div>

              <div className="panel-box">
                <h3>Dar lance</h3>
                <form className="field-form">
                  <label>
                    <span>Valor do lance</span>
                    <input type="number" defaultValue={selectedLot.currentBid + selectedLot.minimumIncrement} />
                  </label>
                  <button type="button">Confirmar lance</button>
                </form>

                <div className="bid-history">
                  <h4>Histórico de lances</h4>
                  <ul>
                    <li><span>João</span><strong>R$ 1.500</strong></li>
                    <li><span>Maria</span><strong>R$ 1.450</strong></li>
                    <li><span>Lucas</span><strong>R$ 1.400</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Carteira' && (
          <section className="panel-section">
            <div className="section-header">
              <p className="eyebrow">Carteira</p>
              <h2>Meu saldo e arremates</h2>
            </div>

            <div className="wallet-grid">
              <div className="panel-box">
                <h3>Saldo</h3>
                <div className="wallet-summary">
                  <div>
                    <span>Total</span>
                    <strong>R$ 5.000</strong>
                  </div>
                  <div>
                    <span>Disponível</span>
                    <strong>R$ 4.200</strong>
                  </div>
                  <div>
                    <span>Comprometido</span>
                    <strong>R$ 800</strong>
                  </div>
                </div>
              </div>

              <div className="panel-box">
                <h3>Meus arremates</h3>
                <ul className="list-block compact">
                  <li>
                    <div>
                      <strong>Console retrô</strong>
                      <span>Arrematado por R$ 2.100</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Relógio antigo</strong>
                      <span>Em disputa</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Auditoria' && (
          <section className="panel-section">
            <div className="section-header">
              <p className="eyebrow">Auditoria</p>
              <h2>Histórico do sistema</h2>
            </div>

            <div className="panel-box">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Detalhes</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td>{log.details}</td>
                      <td>{log.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
