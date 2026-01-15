import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import styles from './LibraryPage.module.css';

const LibraryPage = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const libraryRef = collection(db, 'library');
        const q = query(libraryRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const documentsData = [];
        querySnapshot.forEach((doc) => {
          documentsData.push({ id: doc.id, ...doc.data() });
        });
        
        setDocuments(documentsData);
        setFilteredDocuments(documentsData);
      } catch (error) {
        console.error('Erro ao carregar biblioteca:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Extrai disciplinas únicas dos documentos
  const disciplines = Array.from(
    new Set(
      documents
        .map((doc) => doc.discipline)
        .filter((discipline) => discipline && discipline.trim() !== '')
    )
  ).sort();

  useEffect(() => {
    let filtered = documents;

    // Filtro por disciplina
    if (selectedDiscipline) {
      filtered = filtered.filter((doc) => doc.discipline === selectedDiscipline);
    }

    // Filtro por busca de texto
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.discipline && doc.discipline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, selectedDiscipline, documents]);

  const handleDisciplineFilter = (discipline) => {
    if (selectedDiscipline === discipline) {
      // Se clicar na mesma disciplina, remove o filtro
      setSelectedDiscipline(null);
    } else {
      setSelectedDiscipline(discipline);
    }
    // Limpa o campo de busca quando filtra por disciplina
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className={styles.libraryPage}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Biblioteca</h1>
          <p>Documentos, livros e artigos disponíveis</p>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Pesquisar por nome ou disciplina..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Remove filtro de disciplina quando o usuário digita
              if (e.target.value.trim() !== '') {
                setSelectedDiscipline(null);
              }
            }}
            className={styles.searchInput}
          />
          <svg 
            className={styles.searchIcon} 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {disciplines.length > 0 && (
          <div className={styles.disciplineFilters}>
            <span className={styles.filtersLabel}>Filtrar por disciplina:</span>
            <div className={styles.filterButtons}>
              {disciplines.map((discipline) => (
                <button
                  key={discipline}
                  className={`${styles.filterButton} ${
                    selectedDiscipline === discipline ? styles.filterButtonActive : ''
                  }`}
                  onClick={() => handleDisciplineFilter(discipline)}
                >
                  {discipline}
                </button>
              ))}
              {selectedDiscipline && (
                <button
                  className={styles.clearFilterButton}
                  onClick={() => setSelectedDiscipline(null)}
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>
        )}

        <div className={styles.resultsInfo}>
          {filteredDocuments.length === 0 ? (
            <p className={styles.noResults}>
              {searchTerm ? 'Nenhum livro encontrado.' : 'Nenhum livro disponível ainda.'}
            </p>
          ) : (
            <p className={styles.count}>
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'livro encontrado' : 'livros encontrados'}
            </p>
          )}
        </div>

        <div className={styles.booksGrid}>
          {filteredDocuments.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
