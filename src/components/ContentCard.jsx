import React, { useState } from 'react';
import styles from './ContentCard.module.css';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike } from '../services/communityService';

const TypeIcon = ({ type }) => {
  const icons = {
    Imagem: '🖼️',
    Documento: '📄',
    Vídeo: '🎬',
    Link: '🔗',
    Outros: '✨',
  };
  return <span className={styles.typeIcon}>{icons[type] || '✨'}</span>;
};

const ContentCard = ({ content, currentUser }) => {
  const { id, title, type, link, description, author, createdAt, likes = [] } = content;
  const [isLiking, setIsLiking] = useState(false);

  const userHasLiked = currentUser ? likes.includes(currentUser.uid) : false;

  const handleLike = async () => {
    if (!currentUser || isLiking) return;

    setIsLiking(true);
    try {
      await toggleLike(id, currentUser.uid);
    } catch (error) {
      console.error("Erro ao curtir:", error);
      // Opcional: Mostrar um erro para o usuário
    } finally {
      setIsLiking(false);
    }
  };

  const formattedDate = createdAt?.toDate ? 
    createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) :
    'Data indisponível';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleContainer}>
          <TypeIcon type={type} />
          <h3 className={styles.title}>{title}</h3>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.openButton}>
          Abrir
        </a>
      </div>
      
      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.cardFooter}>
        <span className={styles.author}>Por: {author?.name || 'Anônimo'}</span>
        <div className={styles.actions}>
          <button 
            onClick={handleLike} 
            className={`${styles.likeButton} ${userHasLiked ? styles.liked : ''}`}
            disabled={isLiking || !currentUser}
          >
            {userHasLiked ? '❤️' : '🤍'} 
            <span className={styles.likeCount}>{likes.length || 0}</span>
          </button>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
