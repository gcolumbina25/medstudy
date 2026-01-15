import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TopicCard from '../components/TopicCard';
import styles from './CyclePage.module.css';

const CyclePage = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cycle, setCycle] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const cycleDoc = await getDoc(doc(db, 'cycles', cycleId));
        if (cycleDoc.exists()) {
          setCycle({ id: cycleDoc.id, ...cycleDoc.data() });
        }

        const topicsRef = collection(db, 'cycles', cycleId, 'topics');
        const q = query(topicsRef, orderBy('order', 'asc'));
        const topicsSnapshot = await getDocs(q);
        
        const topicsData = [];
        topicsSnapshot.forEach((doc) => {
          topicsData.push({ id: doc.id, ...doc.data() });
        });
        
        setTopics(topicsData);
      } catch (error) {
        console.error('Erro ao carregar ciclo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCycle();
  }, [cycleId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando conteúdo...</p>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className={styles.error}>
        <p>Ciclo não encontrado</p>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.cyclePage}>
      <Header />
      
      <div className={styles.hero} style={{ backgroundImage: `url(${cycle.imageUrl})` }}>
        <div className={styles.heroOverlay}>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            ← Voltar
          </button>
          <h1>{cycle.name}</h1>
          <p>{cycle.description}</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.topicsContainer}>
          <h2 className={styles.topicsTitle}>Tópicos</h2>
          
          {topics.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum tópico disponível ainda.</p>
            </div>
          ) : (
            <div className={styles.topicsGrid}>
              {topics.map((topic) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  userId={currentUser?.uid}
                  cycleId={cycleId}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CyclePage;
