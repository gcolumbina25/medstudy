import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

const UnauthorizedAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUnauthorizedAttempts = async () => {
    setLoading(true);
    try {
      console.log('🔍 Carregando tentativas não autorizadas...');
      const attemptsRef = collection(db, 'unauthorizedAttempts');
      const q = query(attemptsRef, orderBy('attemptedAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      console.log('✅ Tentativas carregadas:', snapshot.size);

      const attemptsData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        attemptsData.push({
          id: doc.id,
          ...data,
          attemptedAt: data.attemptedAt?.toDate?.() || new Date()
        });
      });

      setAttempts(attemptsData);
    } catch (error) {
      console.error('❌ Erro ao carregar tentativas:', error);
      setAttempts([{ error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnauthorizedAttempts();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>🚨 Tentativas de Acesso Não Autorizado</h3>
      <p>Monitoramento de segurança - Últimas 50 tentativas</p>

      <button
        onClick={loadUnauthorizedAttempts}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px'
        }}
      >
        {loading ? '🔄 Carregando...' : '🔄 Atualizar Lista'}
      </button>

      {attempts.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {loading ? 'Carregando tentativas...' : 'Nenhuma tentativa registrada ainda.'}
        </p>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Nome</th>
                <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Data/Hora</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr key={attempt.id} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <td style={{ padding: '8px', borderRight: '1px solid #dee2e6', fontWeight: 'bold', color: '#dc2626' }}>
                    {attempt.error ? `❌ ${attempt.error}` : attempt.email}
                  </td>
                  <td style={{ padding: '8px', borderRight: '1px solid #dee2e6' }}>
                    {attempt.displayName || 'N/A'}
                  </td>
                  <td style={{ padding: '8px', borderRight: '1px solid #dee2e6', fontSize: '0.9em', color: '#666' }}>
                    {formatDate(attempt.attemptedAt)}
                  </td>
                  <td style={{ padding: '8px', fontSize: '0.8em', color: '#888', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {attempt.userAgent?.substring(0, 50)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attempts.length > 0 && !attempts[0].error && (
        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
          📊 Total de tentativas monitoradas: <strong>{attempts.length}</strong>
        </p>
      )}
    </div>
  );
};

export default UnauthorizedAttempts;