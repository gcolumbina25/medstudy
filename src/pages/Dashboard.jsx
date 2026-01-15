import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TopicCard from '../components/TopicCard';
import Carousel from '../components/Carousel';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [cyclesWithTopics, setCyclesWithTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCyclesAndTopics = async () => {
      try {
        // Buscar todos os ciclos
        const cyclesRef = collection(db, 'cycles');
        const cyclesQuery = query(cyclesRef, orderBy('order', 'asc'));
        const cyclesSnapshot = await getDocs(cyclesQuery);
        
        const cyclesData = [];
        
        // Para cada ciclo, buscar seus tópicos
        for (const cycleDoc of cyclesSnapshot.docs) {
          const cycleData = { id: cycleDoc.id, ...cycleDoc.data() };
          
          // Buscar tópicos do ciclo
          const topicsRef = collection(db, 'cycles', cycleDoc.id, 'topics');
          const topicsQuery = query(topicsRef, orderBy('order', 'asc'));
          const topicsSnapshot = await getDocs(topicsQuery);
          
          const topicsData = [];
          topicsSnapshot.forEach((topicDoc) => {
            topicsData.push({ id: topicDoc.id, ...topicDoc.data() });
          });
          
          cyclesData.push({
            ...cycleData,
            topics: topicsData
          });
        }
        
        setCyclesWithTopics(cyclesData);
      } catch (error) {
        console.error('Erro ao carregar ciclos e tópicos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCyclesAndTopics();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando conteúdo...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Bem-vindo ao MedStudy</h1>
          <p>Continue seus estudos de onde parou</p>
        </div>

        <section className={styles.cyclesSection}>
          {cyclesWithTopics.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum ciclo disponível ainda.</p>
            </div>
          ) : (
            cyclesWithTopics.map((cycle) => (
              <div key={cycle.id} className={styles.cycleSection}>
                <h2 className={`${styles.cycleTitle} ${cycle.comingSoon ? styles.comingSoon : ''}`}>
                  {cycle.name}
                </h2>
                
                {cycle.topics.length === 0 ? (
                  <div className={styles.emptyTopics}>
                    <p>Nenhum tópico disponível ainda.</p>
                  </div>
                ) : (
                  <Carousel comingSoon={cycle.comingSoon}>
                    {cycle.topics.map((topic) => (
                      <div key={topic.id} className={styles.carouselItem}>
                        <TopicCard 
                          topic={{ ...topic, comingSoon: cycle.comingSoon || topic.comingSoon }} 
                          userId={currentUser?.uid}
                          cycleId={cycle.id}
                        />
                      </div>
                    ))}
                  </Carousel>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
