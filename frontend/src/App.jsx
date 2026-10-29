import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

const tabs = ['Vitrine', 'Leiloeiro', 'Lote ao vivo', 'Carteira', 'Auditoria'];

const initialLotForm = {
  title: 'Coleção de arte',
  description: 'Lote em ótimo estado com peças selecionadas.',
  initialPrice: 1000,
  minimumIncrement: 50,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Vitrine');
  const [lots, setLots] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState('lot-1');
  const [lotForm, setLotForm] = useState(initialLotForm);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lotsRes, walletRes, auditRes] = await Promise.all([
          fetch(`${API_URL}/lots`),
          fetch(`${API_URL}/users/user-1/balance`),
          fetch(`${API_URL}/audit`),
        ]);

        const lotsData = await lotsRes.json();
        const walletData = await walletRes.json();
        const auditData = await auditRes.json();

        setLots(lotsData.lots || []);
        setWallet(walletData);
        setAuditLogs(auditData.logs || []);
      } catch (err) {
        console.error('Erro ao carregar dados da API:', err);
      }
    };

    loadData();
  }, []);

  const selectedLot = lots.find((lot) => lot.id === selectedLotId) || lots[0] || null;

  const handleBid = async () => {
    if (!selectedLot) return;

    const nextBid = Number(selectedLot.currentBid) + Number(selectedLot.minimumIncrement || 0);

    try {
      const response = await fetch(`${API_URL}/lots/${selectedLot.id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: nextBid }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.reason || data.message || 'Não foi possível registrar o lance.');
        return;
      }

      const updatedLots = lots.map((lot) =>
        lot.id === selectedLot.id ? { ...lot, currentBid: nextBid } : lot
      );

      setLots(updatedLots);
      alert(data.message || 'Lance registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar lance:', error);
      alert('Não foi possível registrar o lance.');
    }
  };

  const handleCloseLot = async (lotId) => {
    try {
      const response = await fetch(`${API_URL}/lots/${lotId}/close`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.reason || data.message || 'Não foi possível encerrar o lote.');
        return;
      }

      setLots((currentLots) => currentLots.map((lot) =>
        lot.id === lotId ? { ...lot, status: 'CLOSED' } : lot
      ));

      if (selectedLotId === lotId) {
        setSelectedLotId(lotId);
      }

      alert(data.message || 'Lote encerrado com sucesso!');
    } catch (error) {
      console.error('Erro ao encerrar lote:', error);
      alert('Não foi possível encerrar o lote.');
    }
  };

  const handleCreateLot = async (event) => {
    event.preventDefault();

    const payload = {
      title: lotForm.title.trim(),
      description: lotForm.description.trim() || 'Lote publicado na plataforma.',
      initialPrice: Number(lotForm.initialPrice),
      minimumIncrement: Number(lotForm.minimumIncrement),
      seller: 'Leiloeiro oficial',
      status: 'ACTIVE',
      endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    };

    if (!payload.title || Number.isNaN(payload.initialPrice) || Number.isNaN(payload.minimumIncrement)) {
      alert('Preencha os campos obrigatórios corretamente.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/lots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLots((currentLots) => [data.lot, ...currentLots]);
      setSelectedLotId(data.lot.id);
      setActiveTab('Vitrine');
      setLotForm(initialLotForm);
      alert('Lote publicado com sucesso!');
    } catch (error) {
      console.error('Erro ao publicar lote:', error);
      alert('Não foi possível publicar o lote.');
    }
  };

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
                <strong>{lots.filter((lot) => lot.status === 'ACTIVE').length}</strong>
              </div>
              <div className="stat-card">
                <span className="label">Lances hoje</span>
                <strong>{lots.length * 12}</strong>
              </div>
              <div className="stat-card">
                <span className="label">Saldo disponível</span>
                <strong>{wallet ? `R$ ${wallet.availableBalance}` : 'R$ 0'}</strong>
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
                        {lot.status === 'ACTIVE' ? 'Ativo' : 'Encerrado'}
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
                        <strong>{lot.endsAt ? 'Ativo' : 'Encerrado'}</strong>
                      </div>
                    </div>

                    <button type="button" onClick={() => { setSelectedLotId(lot.id); setActiveTab('Lote ao vivo'); }}>
                      Dar lance
                    </button>
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
                <form className="field-form" onSubmit={handleCreateLot}>
                  <label>
                    <span>Título</span>
                    <input
                      type="text"
                      value={lotForm.title}
                      onChange={(event) => setLotForm((current) => ({ ...current, title: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>Descrição</span>
                    <input
                      type="text"
                      value={lotForm.description}
                      onChange={(event) => setLotForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>Valor inicial</span>
                    <input
                      type="number"
                      min="0"
                      value={lotForm.initialPrice}
                      onChange={(event) => setLotForm((current) => ({ ...current, initialPrice: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>Incremento mínimo</span>
                    <input
                      type="number"
                      min="0"
                      value={lotForm.minimumIncrement}
                      onChange={(event) => setLotForm((current) => ({ ...current, minimumIncrement: event.target.value }))}
                    />
                  </label>
                  <button type="submit">Publicar lote</button>
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
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleCloseLot(lot.id)}
                        disabled={lot.status === 'CLOSED'}
                      >
                        {lot.status === 'CLOSED' ? 'Encerrado' : 'Encerrar'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Lote ao vivo' && selectedLot && (
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
                    <strong>{selectedLot.endsAt ? 'Ativo' : 'Encerrado'}</strong>
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
                    <input type="number" defaultValue={Number(selectedLot.currentBid) + Number(selectedLot.minimumIncrement || 0)} />
                  </label>
                  <button type="button" onClick={handleBid}>Confirmar lance</button>
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

        {activeTab === 'Carteira' && wallet && (
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
                    <strong>R$ {wallet.totalBalance}</strong>
                  </div>
                  <div>
                    <span>Disponível</span>
                    <strong>R$ {wallet.availableBalance}</strong>
                  </div>
                  <div>
                    <span>Comprometido</span>
                    <strong>R$ {wallet.committedBalance}</strong>
                  </div>
                </div>
              </div>

              <div className="panel-box">
                <h3>Meus arremates</h3>
                <ul className="list-block compact">
                  {(wallet.wonAuctions || []).map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.title}</strong>
                        <span>Arrematado por R$ {item.amount}</span>
                      </div>
                    </li>
                  ))}
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
                      <td>{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
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
