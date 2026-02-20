import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const TestAllowedEmails = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const testReadAll = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testando leitura da coleção allowedEmails...');
      const allowedEmailsRef = collection(db, 'allowedEmails');
      const snapshot = await getDocs(allowedEmailsRef);

      console.log('✅ Leitura bem-sucedida!');
      console.log('📊 Total de e-mails permitidos:', snapshot.size);

      const emails = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        emails.push({ id: doc.id, ...data });
        console.log('📧', data.email, data.isAdmin ? '(Admin)' : '(Usuário)');
      });

      setResults(emails);
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setResults([{ error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const testQuery = async () => {
    if (!testEmail) return;

    setLoading(true);
    try {
      console.log('🔍 Testando query para e-mail:', testEmail);
      const allowedEmailsRef = collection(db, 'allowedEmails');
      const q = query(allowedEmailsRef, where('email', '==', testEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log('✅ E-mail encontrado na lista!');
        const emails = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          emails.push({ id: doc.id, ...data });
          console.log('📄 Dados:', data);
        });
        setResults(emails);
      } else {
        console.log('❌ E-mail NÃO encontrado na lista');
        setResults([{ error: 'E-mail não encontrado' }]);
      }
    } catch (error) {
      console.error('❌ Erro na query:', error);
      setResults([{ error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', margin: '20px' }}>
      <h3>🧪 Teste da Coleção allowedEmails</h3>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testReadAll} disabled={loading} style={{ marginRight: '10px' }}>
          {loading ? 'Testando...' : 'Testar Leitura Geral'}
        </button>

        <input
          type="email"
          placeholder="Digite e-mail para testar"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={testQuery} disabled={loading || !testEmail}>
          Testar Query Específica
        </button>
      </div>

      <div>
        <h4>Resultados:</h4>
        {results.length === 0 ? (
          <p>Nenhum resultado ainda. Clique em "Testar Leitura Geral" primeiro.</p>
        ) : (
          <ul>
            {results.map((result, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {result.error ? (
                  <span style={{ color: '#ff6b6b' }}>❌ Erro: {result.error}</span>
                ) : (
                  <span style={{ color: '#4ecdc4' }}>
                    ✅ {result.email} {result.isAdmin ? '(Admin)' : '(Usuário)'} - ID: {result.id}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
        💡 Verifique o console do navegador (F12) para logs detalhados
      </div>
    </div>
  );
};

export default TestAllowedEmails;