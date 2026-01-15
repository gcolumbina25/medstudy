import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import LessonItem from '../components/LessonItem';
import styles from './TopicPage.module.css';

const TopicPage = () => {
  const { cycleId, topicId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        // Se tiver cycleId, usar nova estrutura
        if (cycleId) {
          const topicDoc = await getDoc(doc(db, 'cycles', cycleId, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic({ id: topicDoc.id, ...topicDoc.data() });
          }

          // Buscar ciclo também
          const cycleDoc = await getDoc(doc(db, 'cycles', cycleId));
          if (cycleDoc.exists()) {
            setCycle({ id: cycleDoc.id, ...cycleDoc.data() });
          }

          // Buscar aulas
          const lessonsRef = collection(db, 'cycles', cycleId, 'topics', topicId, 'lessons');
          const q = query(lessonsRef, orderBy('order', 'asc'));
          const lessonsSnapshot = await getDocs(q);
          
          const lessonsData = [];
          lessonsSnapshot.forEach((doc) => {
            lessonsData.push({ id: doc.id, ...doc.data() });
          });
          
          setLessons(lessonsData);
        } else {
          // Estrutura antiga (compatibilidade)
          const topicDoc = await getDoc(doc(db, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic({ id: topicDoc.id, ...topicDoc.data() });
          }

          const lessonsRef = collection(db, 'topics', topicId, 'lessons');
          const q = query(lessonsRef, orderBy('order', 'asc'));
          const lessonsSnapshot = await getDocs(q);
          
          const lessonsData = [];
          lessonsSnapshot.forEach((doc) => {
            lessonsData.push({ id: doc.id, ...doc.data() });
          });
          
          setLessons(lessonsData);
        }
      } catch (error) {
        console.error('Erro ao carregar tópico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [cycleId, topicId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className={styles.error}>
        <p>Tópico não encontrado</p>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.topicPage}>
      <Header />
      
      <div className={styles.hero} style={{ backgroundImage: `url(${topic.imageUrl})` }}>
        <div className={styles.heroOverlay}>
          <button 
            className={styles.backButton} 
            onClick={() => cycleId ? navigate(`/ciclo/${cycleId}`) : navigate('/')}
          >
            ← Voltar
          </button>
          <h1>{topic.name}</h1>
          <p>{topic.description}</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.lessonsContainer}>
          <h2 className={styles.lessonsTitle}>Aulas</h2>
          
          {lessons.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma aula disponível ainda.</p>
            </div>
          ) : (
            <div className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <LessonItem 
                  key={lesson.id} 
                  lesson={lesson} 
                  topicId={topicId}
                  cycleId={cycleId || undefined}
                  index={index + 1}
                  userId={currentUser?.uid}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TopicPage;
