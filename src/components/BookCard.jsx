import styles from './BookCard.module.css';

const BookCard = ({ book }) => {
  const handleAccess = () => {
    if (book.driveCode) {
      // Converte o código do Google Drive para URL de visualização
      const driveUrl = `https://drive.google.com/file/d/${book.driveCode}/view`;
      window.open(driveUrl, '_blank');
    } else if (book.pdfUrl) {
      // Fallback para o formato antigo
      window.open(book.pdfUrl, '_blank');
    }
  };

  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCover}>
        {book.imageUrl || book.thumbnail ? (
          <img 
            src={book.imageUrl || book.thumbnail} 
            alt={book.name}
            onError={(e) => {
              // Se imageUrl falhar, tenta thumbnail; se ambos falharem, mostra placeholder
              if (book.imageUrl && book.thumbnail && e.target.src === book.imageUrl) {
                e.target.src = book.thumbnail;
              } else {
                e.target.src = 'https://via.placeholder.com/200x300/1a1533/a855f7?text=Livro';
              }
            }}
          />
        ) : (
          <div className={styles.placeholderCover}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.bookInfo}>
        <h3 className={styles.bookName}>{book.name}</h3>
        
        {book.discipline && (
          <div className={styles.discipline}>
            <svg 
              className={styles.tagIcon} 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>{book.discipline}</span>
          </div>
        )}
        
        <button 
          className={styles.accessButton}
          onClick={handleAccess}
        >
          Acessar Livro
        </button>
      </div>
    </div>
  );
};

export default BookCard;

