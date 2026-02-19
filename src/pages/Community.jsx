import { useState, useEffect } from 'react';
import Header from '../components/Header';
import styles from './Community.module.css';
import { useAuth } from '../contexts/AuthContext';
import { publishContent, listenToContent } from '../services/communityService';
import ContentCard from '../components/ContentCard';

const Community = () => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Link');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [contentList, setContentList] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  useEffect(() => {
    const unsubscribe = listenToContent((content) => {
      setContentList(content);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = contentList;
    if (searchTerm) {
      result = result.filter(content =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Comunidade</h1>
          <p>Compartilhe materiais de estudo e interaja com outros usuários.</p>
        </div>

        <section className={styles.publicationBox}>
          <h2>Publicar Novo Conteúdo</h2>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título *</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Artigo sobre Anatomia Cardíaca" required />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="type">Tipo *</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="Link">Link Externo</option>
                  <option value="Imagem">Imagem</option>
                  <option value="Documento">Documento</option>
                  <option value="Vídeo">Vídeo</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
                <label htmlFor="link">Link *</label>
                <input type="url" id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição</label>
              <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Adicione um breve resumo..."></textarea>
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

        <section className={styles.contentList}>
          <h2>Itens Compartilhados</h2>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Carregando...</p>
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {filteredContent.length > 0 ? (
                filteredContent.map(content => (
                  <ContentCard key={content.id} content={content} currentUser={currentUser} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhum conteúdo encontrado.</p>
                  <p className={styles.emptySubtext}>Seja o primeiro a compartilhar algo!</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Community;
