import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import styles from './RevisaoPage.module.css';

const RevisaoPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, preciso-revisar, conteudo-dificil

  useEffect(() => {
    const fetchLessons = async () => {
      if (!currentUser?.uid) return;

      try {
        const progressRef = collection(db, 'userProgress');
        let q;

        if (filter === 'all') {
          q = query(
            progressRef,
            where('userId', '==', currentUser.uid),
            where('status', 'in', ['preciso-revisar', 'conteudo-dificil'])
          );
        } else {
          q = query(
            progressRef,
            where('userId', '==', currentUser.uid),
            where('status', '==', filter)
          );
        }

        const querySnapshot = await getDocs(q);
        const lessonsData = [];

        for (const progressDoc of querySnapshot.docs) {
          const progressData = progressDoc.data();
          const { cycleId, topicId, lessonId } = progressData;

          // Se tiver cycleId, usar nova estrutura
          if (cycleId && cycleId !== 'legacy') {
            // Buscar dados do tópico
            const topicDoc = await getDoc(doc(db, 'cycles', cycleId, 'topics', topicId));
            const topicData = topicDoc.exists() ? topicDoc.data() : null;

            // Buscar dados da aula
            const lessonDoc = await getDoc(doc(db, 'cycles', cycleId, 'topics', topicId, 'lessons', lessonId));
            const lessonData = lessonDoc.exists() ? lessonDoc.data() : null;

            // Buscar dados do ciclo
            const cycleDoc = await getDoc(doc(db, 'cycles', cycleId));
            const cycleData = cycleDoc.exists() ? cycleDoc.data() : null;

            if (topicData && lessonData) {
              lessonsData.push({
                ...progressData,
                cycle: { id: cycleId, ...cycleData },
                topic: { id: topicId, ...topicData },
                lesson: { id: lessonId, ...lessonData }
              });
            }
          } else {
            // Estrutura antiga (compatibilidade)
            const topicDoc = await getDoc(doc(db, 'topics', topicId));
            const topicData = topicDoc.exists() ? topicDoc.data() : null;

            const lessonDoc = await getDoc(doc(db, 'topics', topicId, 'lessons', lessonId));
            const lessonData = lessonDoc.exists() ? lessonDoc.data() : null;

            if (topicData && lessonData) {
              lessonsData.push({
                ...progressData,
                topic: { id: topicId, ...topicData },
                lesson: { id: lessonId, ...lessonData }
              });
            }
          }
        }

        setLessons(lessonsData);
      } catch (error) {
        console.error('Erro ao carregar aulas para revisão:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [currentUser, filter]);

  const handleLessonClick = (cycleId, topicId, lessonId) => {
    if (cycleId && cycleId !== 'legacy') {
      navigate(`/ciclo/${cycleId}/topico/${topicId}/aula/${lessonId}`);
    } else {
      navigate(`/topico/${topicId}/aula/${lessonId}`);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'preciso-revisar': { label: 'Preciso revisar', color: '#ffa500', icon: '↻' },
      'conteudo-dificil': { label: 'Conteúdo difícil', color: '#ff3b30', icon: '⚠' }
    };
    return configs[status] || { label: status, color: '#666', icon: '○' };
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando aulas para revisão...</p>
      </div>
    );
  }

  return (
    <div className={styles.revisaoPage}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Modo Revisão</h1>
          <p>Aulas que precisam de atenção</p>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'preciso-revisar' ? styles.active : ''}`}
            onClick={() => setFilter('preciso-revisar')}
          >
            Preciso revisar
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'conteudo-dificil' ? styles.active : ''}`}
            onClick={() => setFilter('conteudo-dificil')}
          >
            Conteúdo difícil
          </button>
        </div>

        {lessons.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma aula encontrada para revisão.</p>
            <p className={styles.emptySubtext}>
              Continue estudando e marque aulas que precisam de atenção!
            </p>
          </div>
        ) : (
          <div className={styles.lessonsGrid}>
            {lessons.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              return (
                <div
                  key={index}
                  className={styles.lessonCard}
                  onClick={() => handleLessonClick(item.cycleId, item.topicId, item.lessonId)}
                >
                  <div className={styles.lessonHeader}>
                    <h3>{item.lesson.title}</h3>
                    <div
                      className={styles.statusBadge}
                      style={{
                        color: statusConfig.color,
                        borderColor: statusConfig.color
                      }}
                    >
                      <span>{statusConfig.icon}</span>
                      {statusConfig.label}
                    </div>
                  </div>
                  <p className={styles.topicName}>
                    {item.cycle ? `${item.cycle.name} - ` : ''}{item.topic.name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default RevisaoPage;
