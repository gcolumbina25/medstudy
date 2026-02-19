
import { useState, useEffect } from 'react';
import styles from './Community.module.css';
import { useAuth } from '../contexts/AuthContext';
import { publishContent, listenToContent } from '../services/communityService';
import ContentCard from '../components/ContentCard';

const Community = () => {
  const { currentUser } = useAuth();

  // Estado para o formulário de publicação
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Link');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Estado para a lista de conteúdo e filtros
  const [contentList, setContentList] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  // Efeito para escutar o conteúdo em tempo real
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenToContent((content) => {
      setContentList(content);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Efeito para aplicar filtros e busca
  useEffect(() => {
    let result = contentList;

    // Filtra por termo de busca (título e descrição)
    if (searchTerm) {
      result = result.filter(content =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtra por tipo
    if (filterType !== 'Todos') {
      result = result.filter(content => content.type === filterType);
    }

    setFilteredContent(result);
  }, [searchTerm, filterType, contentList]);

  const handlePublish = async () => {
    if (!title || !link || !type) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setFormError('');
    setFormSuccess('');
    setIsPublishing(true);

    try {
      const contentData = { title, type, link, description };
      await publishContent(contentData, currentUser);
      setFormSuccess('Conteúdo publicado com sucesso!');
      setTitle('');
      setType('Link');
      setLink('');
      setDescription('');
      setTimeout(() => setFormSuccess(''), 5000);
    } catch (err) {
      setFormError(err.message || 'Ocorreu um erro ao publicar.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className={styles.communityContainer}>
      <header className={styles.header}>
        <h1>Comunidade MedStudy</h1>
        <p>Compartilhe materiais de estudo e interaja com outros usuários.</p>
      </header>

      <section className={styles.publicationBox}>
        <h2>Publicar Novo Conteúdo</h2>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.formLabel}>Título *</label>
            <input type="text" id="title" className={styles.formInput} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Artigo sobre Anatomia Cardíaca" required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.formLabel}>Tipo *</label>
              <select id="type" className={styles.formSelect} value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="Link">Link Externo</option>
                <option value="Imagem">Imagem</option>
                <option value="Documento">Documento</option>
                <option value="Vídeo">Vídeo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className={styles.formGroupFlex}>
              <label htmlFor="link" className={styles.formLabel}>Link *</label>
              <input type="url" id="link" className={styles.formInput} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>Descrição</label>
            <textarea id="description" className={styles.formTextarea} rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Adicione um breve resumo..."></textarea>
          </div>
          {formError && <p className={styles.error}>{formError}</p>}
          {formSuccess && <p className={styles.success}>{formSuccess}</p>}
          <button onClick={handlePublish} className={styles.submitButton} disabled={isPublishing}>
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </section>

      <section className={styles.filtersBox}>
        <h2>Pesquisar Conteúdos</h2>
        <div className={styles.filterControls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Pesquisar por título ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Link">Link Externo</option>
            <option value="Imagem">Imagem</option>
            <option value="Documento">Documento</option>
            <option value="Vídeo">Vídeo</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </section>

      <main className={styles.contentList}>
        <h2>Itens Compartilhados</h2>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.cardsGrid}>
            {filteredContent.length > 0 ? (
              filteredContent.map(content => (
                <ContentCard key={content.id} content={content} currentUser={currentUser} />
              ))
            ) : (
              <p className={styles.noResults}>Nenhum conteúdo encontrado com os filtros atuais.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Community; 
