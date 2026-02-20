import React, { useState } from 'react';
import styles from './ContentCard.module.css';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike, deleteContent } from '../services/communityService';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser: authUser } = useAuth();

  const userHasLiked = currentUser ? likes.includes(currentUser.uid) : false;

  // Verificar se o usuário pode deletar (autor ou admin)
  const canDelete = authUser && (
    authUser.uid === author?.uid || 
    authUser.userData?.isAdmin === true
  );

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

  const handleDelete = async () => {
    if (!authUser || isDeleting) return;

    const confirmDelete = window.confirm('Tem certeza que deseja deletar este conteúdo?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteContent(id, authUser, author);
      console.log('Conteúdo deletado com sucesso');
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert('Erro ao deletar o conteúdo: ' + error.message);
    } finally {
      setIsDeleting(false);
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
        <div className={styles.headerActions}>
          {canDelete && (
            <button 
              onClick={handleDelete}
              className={styles.deleteButton}
              disabled={isDeleting}
              title={authUser?.userData?.isAdmin ? "Deletar como admin" : "Deletar meu post"}
            >
              {isDeleting ? '🗑️' : '🗑️'}
            </button>
          )}
          <a href={link} target="_blank" rel="noopener noreferrer" className={styles.openButton}>
            Abrir
          </a>
        </div>
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
