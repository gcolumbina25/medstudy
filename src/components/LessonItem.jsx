import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import styles from './LessonItem.module.css';

const statusConfig = {
  'nao-assistido': { label: 'Não assistido', color: '#666', icon: '○' },
  'preciso-revisar': { label: 'Preciso revisar', color: '#ffa500', icon: '↻' },
  'conteudo-dificil': { label: 'Conteúdo difícil', color: '#ff3b30', icon: '⚠' },
  'dominei': { label: 'Dominei', color: '#00ff88', icon: '✓' }
};

const LessonItem = ({ lesson, topicId, cycleId, index, userId }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('nao-assistido');

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId) return;
      
      try {
        const progressDoc = await getDoc(
          doc(db, 'userProgress', `${userId}_${cycleId || 'legacy'}_${topicId}_${lesson.id}`)
        );
        
        if (progressDoc.exists()) {
          setStatus(progressDoc.data().status || 'nao-assistido');
        }
      } catch (error) {
        console.error('Erro ao buscar status:', error);
      }
    };

    fetchStatus();
  }, [userId, cycleId, topicId, lesson.id]);

  const handleClick = () => {
    if (cycleId) {
      navigate(`/ciclo/${cycleId}/topico/${topicId}/aula/${lesson.id}`);
    } else {
      navigate(`/topico/${topicId}/aula/${lesson.id}`);
    }
  };

  const currentStatus = statusConfig[status] || statusConfig['nao-assistido'];

  return (
    <div className={styles.lessonItem} onClick={handleClick}>
      <div className={styles.lessonNumber}>{index}</div>
      
      <div className={styles.lessonContent}>
        <h3 className={styles.lessonTitle}>{lesson.title}</h3>
        <div 
          className={styles.statusBadge}
          style={{ 
            color: currentStatus.color,
            borderColor: currentStatus.color
          }}
        >
          <span className={styles.statusIcon}>{currentStatus.icon}</span>
          {currentStatus.label}
        </div>
      </div>

      <div className={styles.arrow}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default LessonItem;
