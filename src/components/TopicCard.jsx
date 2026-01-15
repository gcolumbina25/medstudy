import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import styles from './TopicCard.module.css';

const TopicCard = ({ topic, userId, cycleId }) => {
  const [progress, setProgress] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Não calcular progresso para tópicos "Em Breve"
    if (topic.comingSoon) {
      setProgress(0);
      setTotalLessons(0);
      return;
    }

    const calculateProgress = async () => {
      try {
        // Se tiver cycleId, usar nova estrutura
        const lessonsRef = cycleId 
          ? collection(db, 'cycles', cycleId, 'topics', topic.id, 'lessons')
          : collection(db, 'topics', topic.id, 'lessons');
        
        const lessonsSnapshot = await getDocs(lessonsRef);
        const total = lessonsSnapshot.size;
        setTotalLessons(total);

        if (total === 0) {
          setProgress(0);
          return;
        }

        // Buscar status do usuário
        const progressId = cycleId 
          ? `${userId}_${cycleId}_${topic.id}`
          : `${userId}_legacy_${topic.id}`;
        
        const userProgressRef = collection(db, 'userProgress');
        const q = query(
          userProgressRef,
          where('userId', '==', userId),
          where('cycleId', '==', cycleId || 'legacy'),
          where('topicId', '==', topic.id),
          where('status', '==', 'dominei')
        );
        const progressSnapshot = await getDocs(q);
        const completed = progressSnapshot.size;

        setProgress(Math.round((completed / total) * 100));
      } catch (error) {
        console.error('Erro ao calcular progresso:', error);
      }
    };

    if (userId && topic.id && !topic.id.startsWith('coming-soon')) {
      calculateProgress();
    }
  }, [topic.id, topic.comingSoon, userId, cycleId]);

  const handleClick = () => {
    if (topic.comingSoon) {
      return; // Não navega se estiver "Em Breve"
    }
    // Navegar para: /ciclo/{cycleId}/topico/{topicId}
    if (cycleId) {
      navigate(`/ciclo/${cycleId}/topico/${topic.id}`);
    } else {
      // Fallback para estrutura antiga (compatibilidade)
      navigate(`/topico/${topic.id}`);
    }
  };

  return (
    <div 
      className={`${styles.card} ${topic.comingSoon ? styles.comingSoon : ''}`} 
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        {topic.imageUrl ? (
          <img src={topic.imageUrl} alt={topic.name} />
        ) : (
          <div className={styles.placeholderImage}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {!topic.comingSoon && (
          <div className={styles.overlay}>
            <div className={styles.playButton}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        {topic.comingSoon && (
          <div className={styles.comingSoonBadge}>
            <span>Em Breve</span>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{topic.name}</h3>
        <p className={styles.description}>{topic.description}</p>
        
        {!topic.comingSoon && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progress}% concluído</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;
