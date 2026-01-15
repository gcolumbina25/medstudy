import { useNavigate } from 'react-router-dom';
import styles from './CycleCard.module.css';

const CycleCard = ({ cycle }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (cycle.comingSoon) {
      return; // Não navega se estiver "Em Breve"
    }
    navigate(`/ciclo/${cycle.id}`);
  };

  return (
    <div 
      className={`${styles.card} ${cycle.comingSoon ? styles.comingSoon : ''}`} 
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        {cycle.imageUrl ? (
          <img src={cycle.imageUrl} alt={cycle.name} />
        ) : (
          <div className={styles.placeholderImage}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {!cycle.comingSoon && (
          <div className={styles.overlay}>
            <div className={styles.playButton}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        {cycle.comingSoon && (
          <div className={styles.comingSoonBadge}>
            <span>Em Breve</span>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{cycle.name}</h3>
        <p className={styles.description}>{cycle.description}</p>
      </div>
    </div>
  );
};

export default CycleCard;
