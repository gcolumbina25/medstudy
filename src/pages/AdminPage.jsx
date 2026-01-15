import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const { userData, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('cycles'); // cycles, topics, lessons, users, library
  const [cycles, setCycles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [libraryDocuments, setLibraryDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [editingLibraryId, setEditingLibraryId] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [showBulkImportLibrary, setShowBulkImportLibrary] = useState(false);
  const [bulkImportLibraryText, setBulkImportLibraryText] = useState('');
  const [isImportingLibrary, setIsImportingLibrary] = useState(false);

  // Form data
  const [cycleForm, setCycleForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    order: 0
  });

  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    order: 0
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    videoEmbed: '',
    pdfEmbed: '',
    order: 0
  });

  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    isAdmin: false
  });

  const [libraryForm, setLibraryForm] = useState({
    name: '',
    discipline: '',
    driveCode: '',
    thumbnail: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (userData?.isAdmin) {
      fetchData();
    }
  }, [userData, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cycles') {
        const cyclesRef = collection(db, 'cycles');
        const q = query(cyclesRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const cyclesData = [];
        snapshot.forEach((doc) => {
          cyclesData.push({ id: doc.id, ...doc.data() });
        });
        setCycles(cyclesData);
      } else if (activeTab === 'topics' && selectedCycle) {
        const topicsRef = collection(db, 'cycles', selectedCycle.id, 'topics');
        const q = query(topicsRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const topicsData = [];
        snapshot.forEach((doc) => {
          topicsData.push({ id: doc.id, ...doc.data() });
        });
        setTopics(topicsData);
      } else if (activeTab === 'users') {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersData = [];
        snapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      } else if (activeTab === 'library') {
        const libraryRef = collection(db, 'library');
        const q = query(libraryRef, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const libraryData = [];
        snapshot.forEach((doc) => {
          libraryData.push({ id: doc.id, ...doc.data() });
        });
        setLibraryDocuments(libraryData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (cycleId, topicId) => {
    try {
      const lessonsRef = collection(db, 'cycles', cycleId, 'topics', topicId, 'lessons');
      const q = query(lessonsRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const lessonsData = [];
      snapshot.forEach((doc) => {
        lessonsData.push({ id: doc.id, ...doc.data() });
      });
      setLessons(lessonsData);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
    }
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'cycles'), {
        ...cycleForm,
        createdAt: serverTimestamp()
      });
      setCycleForm({ name: '', description: '', imageUrl: '', order: 0 });
      setShowCycleForm(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao criar ciclo:', error);
      alert('Erro ao criar ciclo');
    }
  };

  const handleDeleteCycle = async (cycleId) => {
    if (!confirm('Tem certeza que deseja excluir este ciclo? Todos os tópicos e aulas serão excluídos também.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'cycles', cycleId));
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir ciclo:', error);
      alert('Erro ao excluir ciclo');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!selectedCycle) {
      alert('Selecione um ciclo primeiro');
      return;
    }
    try {
      if (editingTopicId) {
        // Atualizar tópico existente
        await updateDoc(
          doc(db, 'cycles', selectedCycle.id, 'topics', editingTopicId),
          {
            ...topicForm,
            updatedAt: serverTimestamp()
          }
        );
        alert('Tópico atualizado com sucesso!');
      } else {
        // Criar novo tópico
        await addDoc(collection(db, 'cycles', selectedCycle.id, 'topics'), {
          ...topicForm,
          createdAt: serverTimestamp()
        });
        alert('Tópico criado com sucesso!');
      }
      setTopicForm({ name: '', description: '', imageUrl: '', order: 0 });
      setShowTopicForm(false);
      setEditingTopicId(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar tópico:', error);
      alert('Erro ao salvar tópico');
    }
  };

  const handleEditTopic = (topic) => {
    setTopicForm({
      name: topic.name || '',
      description: topic.description || '',
      imageUrl: topic.imageUrl || '',
      order: topic.order || 0
    });
    setEditingTopicId(topic.id);
    setShowTopicForm(true);
  };

  const handleCancelTopicEdit = () => {
    setTopicForm({ name: '', description: '', imageUrl: '', order: 0 });
    setShowTopicForm(false);
    setEditingTopicId(null);
  };

  const handleDeleteTopic = async (cycleId, topicId) => {
    if (!confirm('Tem certeza que deseja excluir este tópico? Todas as aulas serão excluídas também.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'cycles', cycleId, 'topics', topicId));
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir tópico:', error);
      alert('Erro ao excluir tópico');
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedTopic || !selectedCycle) return;
    try {
      if (editingLessonId) {
        // Atualizar aula existente
        await updateDoc(
          doc(db, 'cycles', selectedCycle.id, 'topics', selectedTopic.id, 'lessons', editingLessonId),
          {
            ...lessonForm,
            updatedAt: serverTimestamp()
          }
        );
        alert('Aula atualizada com sucesso!');
      } else {
        // Criar nova aula
        await addDoc(collection(db, 'cycles', selectedCycle.id, 'topics', selectedTopic.id, 'lessons'), {
          ...lessonForm,
          createdAt: serverTimestamp()
        });
        alert('Aula criada com sucesso!');
      }
      setLessonForm({ title: '', videoEmbed: '', pdfEmbed: '', order: 0 });
      setShowLessonForm(false);
      setEditingLessonId(null);
      fetchLessons(selectedCycle.id, selectedTopic.id);
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      alert('Erro ao salvar aula');
    }
  };

  const handleEditLesson = (lesson) => {
    setLessonForm({
      title: lesson.title || '',
      videoEmbed: lesson.videoEmbed || '',
      pdfEmbed: lesson.pdfEmbed || '',
      order: lesson.order || 0
    });
    setEditingLessonId(lesson.id);
    setShowLessonForm(true);
  };

  const handleCancelEdit = () => {
    setLessonForm({ title: '', videoEmbed: '', pdfEmbed: '', order: 0 });
    setShowLessonForm(false);
    setEditingLessonId(null);
  };

  const handleDeleteLesson = async (cycleId, topicId, lessonId) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'cycles', cycleId, 'topics', topicId, 'lessons', lessonId));
      fetchLessons(cycleId, topicId);
    } catch (error) {
      console.error('Erro ao excluir aula:', error);
      alert('Erro ao excluir aula');
    }
  };

  // Função para importar múltiplas aulas de uma vez
  const handleBulkImport = async () => {
    if (!selectedTopic || !selectedCycle) {
      alert('Selecione um tópico primeiro');
      return;
    }

    if (!bulkImportText.trim()) {
      alert('Cole os dados das aulas no campo de texto');
      return;
    }

    setIsImporting(true);
    let lessonsToImport = [];

    try {
      // Tenta parsear como JSON
      try {
        const parsed = JSON.parse(bulkImportText);
        if (Array.isArray(parsed)) {
          lessonsToImport = parsed;
        } else {
          throw new Error('JSON deve ser um array');
        }
      } catch (jsonError) {
        // Se não for JSON válido, tenta parsear como formato de texto simples
        // Formato: Título | VideoEmbed | PdfEmbed | Ordem (uma linha por aula)
        const lines = bulkImportText.split('\n').filter(line => line.trim());
        lessonsToImport = lines.map((line, index) => {
          const parts = line.split('|').map(p => p.trim());
          return {
            title: parts[0] || `Aula ${index + 1}`,
            videoEmbed: parts[1] || '',
            pdfEmbed: parts[2] || '',
            order: parseInt(parts[3]) || index + 1
          };
        });
      }

      if (lessonsToImport.length === 0) {
        alert('Nenhuma aula encontrada nos dados fornecidos');
        setIsImporting(false);
        return;
      }

      // Valida os dados
      const validLessons = lessonsToImport.filter(lesson => {
        if (!lesson.title || lesson.title.trim() === '') {
          return false;
        }
        return true;
      });

      if (validLessons.length === 0) {
        alert('Nenhuma aula válida encontrada. Certifique-se de que cada aula tenha pelo menos um título.');
        setIsImporting(false);
        return;
      }

      if (validLessons.length < lessonsToImport.length) {
        const skipped = lessonsToImport.length - validLessons.length;
        if (!confirm(`${skipped} aula(s) foram ignoradas por falta de dados. Deseja continuar com ${validLessons.length} aula(s)?`)) {
          setIsImporting(false);
          return;
        }
      }

      // Cria todas as aulas
      const lessonsRef = collection(db, 'cycles', selectedCycle.id, 'topics', selectedTopic.id, 'lessons');
      let successCount = 0;
      let errorCount = 0;

      for (const lesson of validLessons) {
        try {
          await addDoc(lessonsRef, {
            title: lesson.title.trim(),
            videoEmbed: lesson.videoEmbed || '',
            pdfEmbed: lesson.pdfEmbed || '',
            order: lesson.order || 0,
            createdAt: serverTimestamp()
          });
          successCount++;
        } catch (error) {
          console.error('Erro ao criar aula:', error);
          errorCount++;
        }
      }

      // Atualiza a lista
      await fetchLessons(selectedCycle.id, selectedTopic.id);
      
      // Limpa o formulário
      setBulkImportText('');
      setShowBulkImport(false);

      // Mostra resultado
      if (errorCount === 0) {
        alert(`✅ ${successCount} aula(s) importada(s) com sucesso!`);
      } else {
        alert(`⚠️ ${successCount} aula(s) importada(s), ${errorCount} erro(s).`);
      }

    } catch (error) {
      console.error('Erro ao importar aulas:', error);
      alert('Erro ao processar importação. Verifique o formato dos dados.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      // Criar o usuário no Firebase Auth (isso fará login automático com o novo usuário)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userForm.email,
        userForm.password
      );

      // Criar o documento do usuário no Firestore usando setDoc (não updateDoc)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userForm.email,
        isAdmin: userForm.isAdmin,
        blocked: false,
        createdAt: serverTimestamp()
      });

      // Limpar o formulário
      setUserForm({ email: '', password: '', isAdmin: false });
      setShowUserForm(false);
      
      // Fazer logout do novo usuário criado (para não ficar logado como ele)
      await signOut(auth);
      
      // Atualizar a lista de usuários
      fetchData();
      
      // Informar ao admin sobre o logout necessário
      alert('Usuário criado com sucesso!\n\nNota: Você foi desconectado porque o Firebase faz login automático ao criar um usuário.\nPor favor, faça login novamente com sua conta de administrador.');
      
      // Redirecionar para login após um pequeno delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      // Tratamento de erros específicos
      if (error.code === 'auth/email-already-in-use') {
        alert('Este e-mail já está em uso. Use a opção de edição se quiser modificar o usuário.');
      } else if (error.code === 'auth/weak-password') {
        alert('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        alert('O e-mail fornecido não é válido.');
      } else {
        alert('Erro ao criar usuário: ' + error.message);
      }
    }
  };

  const handleToggleBlock = async (userId, currentBlocked) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        blocked: !currentBlocked
      });
      fetchData();
    } catch (error) {
      console.error('Erro ao bloquear/desbloquear usuário:', error);
      alert('Erro ao atualizar usuário');
    }
  };

  const handleSelectCycle = (cycle) => {
    setSelectedCycle(cycle);
    setSelectedTopic(null);
    setLessons([]);
    setActiveTab('topics');
  };

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    if (selectedCycle) {
      await fetchLessons(selectedCycle.id, topic.id);
    }
  };

  // Função para extrair o código do Google Drive e gerar miniatura
  const extractDriveCode = (url) => {
    if (!url) return '';
    
    const trimmedUrl = url.trim();
    
    // Se já parece ser apenas um código (sem caracteres especiais de URL)
    if (/^[a-zA-Z0-9_-]+$/.test(trimmedUrl)) {
      return trimmedUrl;
    }
    
    // Tenta extrair o ID do Google Drive de diferentes formatos
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,  // https://drive.google.com/file/d/ID/view
      /id=([a-zA-Z0-9_-]+)/,          // https://drive.google.com/open?id=ID
      /\/d\/([a-zA-Z0-9_-]+)/,        // Formato alternativo
    ];
    
    for (const pattern of patterns) {
      const match = trimmedUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Se não encontrou padrão, retorna o valor limpo
    return trimmedUrl;
  };

  const generateThumbnail = (driveCode) => {
    if (!driveCode) return '';
    return `https://drive.google.com/thumbnail?id=${driveCode}&sz=w400`;
  };

  const handleDriveCodeChange = (value) => {
    const code = extractDriveCode(value);
    const thumbnail = generateThumbnail(code);
    setLibraryForm({
      ...libraryForm,
      driveCode: code,
      thumbnail: thumbnail
    });
  };

  const handleCreateLibraryDocument = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        name: libraryForm.name,
        discipline: libraryForm.discipline,
        driveCode: libraryForm.driveCode,
        thumbnail: libraryForm.thumbnail,
        imageUrl: libraryForm.imageUrl || '', // URL de imagem personalizada (opcional)
        // Mantém compatibilidade com formato antigo
        pdfUrl: libraryForm.driveCode ? `https://drive.google.com/file/d/${libraryForm.driveCode}/view` : ''
      };
      
      if (editingLibraryId) {
        // Atualizar livro existente
        await updateDoc(doc(db, 'library', editingLibraryId), {
          ...bookData,
          updatedAt: serverTimestamp()
        });
        alert('Livro atualizado com sucesso!');
      } else {
        // Criar novo livro
        await addDoc(collection(db, 'library'), {
          ...bookData,
          createdAt: serverTimestamp()
        });
        alert('Livro criado com sucesso!');
      }
      
      setLibraryForm({ name: '', discipline: '', driveCode: '', thumbnail: '', imageUrl: '' });
      setShowLibraryForm(false);
      setEditingLibraryId(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      alert('Erro ao salvar documento');
    }
  };

  const handleEditLibraryDocument = (book) => {
    const driveCode = book.driveCode || '';
    const thumbnail = driveCode ? generateThumbnail(driveCode) : (book.thumbnail || '');
    
    setLibraryForm({
      name: book.name || '',
      discipline: book.discipline || '',
      driveCode: driveCode,
      thumbnail: thumbnail,
      imageUrl: book.imageUrl || ''
    });
    setEditingLibraryId(book.id);
    setShowLibraryForm(true);
  };

  const handleCancelLibraryEdit = () => {
    setLibraryForm({ name: '', discipline: '', driveCode: '', thumbnail: '', imageUrl: '' });
    setShowLibraryForm(false);
    setEditingLibraryId(null);
  };

  // Função para importar múltiplos livros de uma vez
  const handleBulkImportLibrary = async () => {
    if (!bulkImportLibraryText.trim()) {
      alert('Cole os dados dos livros no campo de texto');
      return;
    }

    setIsImportingLibrary(true);
    let booksToImport = [];

    try {
      // Tenta parsear como JSON
      try {
        const parsed = JSON.parse(bulkImportLibraryText);
        if (Array.isArray(parsed)) {
          booksToImport = parsed;
        } else {
          throw new Error('JSON deve ser um array');
        }
      } catch (jsonError) {
        // Se não for JSON válido, tenta parsear como formato de texto simples
        // Formato: Nome do Livro | Disciplina | Código do Drive | URL Imagem (opcional)
        const lines = bulkImportLibraryText.split('\n').filter(line => line.trim());
        booksToImport = lines.map((line, index) => {
          const parts = line.split('|').map(p => p.trim());
          return {
            name: parts[0] || `Livro ${index + 1}`,
            discipline: parts[1] || '',
            driveCode: parts[2] || '',
            imageUrl: parts[3] || ''
          };
        });
      }

      if (booksToImport.length === 0) {
        alert('Nenhum livro encontrado nos dados fornecidos');
        setIsImportingLibrary(false);
        return;
      }

      // Valida os dados
      const validBooks = booksToImport.filter(book => {
        if (!book.name || book.name.trim() === '') {
          return false;
        }
        if (!book.discipline || book.discipline.trim() === '') {
          return false;
        }
        if (!book.driveCode || book.driveCode.trim() === '') {
          return false;
        }
        return true;
      });

      if (validBooks.length === 0) {
        alert('Nenhum livro válido encontrado. Certifique-se de que cada livro tenha nome, disciplina e código do Google Drive.');
        setIsImportingLibrary(false);
        return;
      }

      if (validBooks.length < booksToImport.length) {
        const skipped = booksToImport.length - validBooks.length;
        if (!confirm(`${skipped} livro(s) foram ignorados por falta de dados. Deseja continuar com ${validBooks.length} livro(s)?`)) {
          setIsImportingLibrary(false);
          return;
        }
      }

      // Cria todos os livros
      const libraryRef = collection(db, 'library');
      let successCount = 0;
      let errorCount = 0;

      for (const book of validBooks) {
        try {
          const driveCode = extractDriveCode(book.driveCode);
          const thumbnail = generateThumbnail(driveCode);
          
          const bookData = {
            name: book.name.trim(),
            discipline: book.discipline.trim(),
            driveCode: driveCode,
            thumbnail: thumbnail,
            imageUrl: book.imageUrl || '',
            pdfUrl: driveCode ? `https://drive.google.com/file/d/${driveCode}/view` : '',
            createdAt: serverTimestamp()
          };
          
          await addDoc(libraryRef, bookData);
          successCount++;
        } catch (error) {
          console.error('Erro ao criar livro:', error);
          errorCount++;
        }
      }

      // Atualiza a lista
      await fetchData();
      
      // Limpa o formulário
      setBulkImportLibraryText('');
      setShowBulkImportLibrary(false);

      // Mostra resultado
      if (errorCount === 0) {
        alert(`✅ ${successCount} livro(s) importado(s) com sucesso!`);
      } else {
        alert(`⚠️ ${successCount} livro(s) importado(s), ${errorCount} erro(s).`);
      }

    } catch (error) {
      console.error('Erro ao importar livros:', error);
      alert('Erro ao processar importação. Verifique o formato dos dados.');
    } finally {
      setIsImportingLibrary(false);
    }
  };

  const handleDeleteLibraryDocument = async (documentId) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'library', documentId));
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      alert('Erro ao excluir documento');
    }
  };


  if (!userData?.isAdmin) {
    return (
      <div className={styles.error}>
        <p>Acesso negado. Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <Header />
      
      <main className={styles.main}>
        <h1 className={styles.title}>Painel Administrativo</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'cycles' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('cycles');
              setSelectedCycle(null);
              setSelectedTopic(null);
            }}
          >
            Ciclos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'topics' ? styles.active : ''}`}
            onClick={() => {
              if (!selectedCycle) {
                alert('Selecione um ciclo primeiro');
                return;
              }
              setActiveTab('topics');
            }}
            disabled={!selectedCycle}
          >
            Tópicos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'library' ? styles.active : ''}`}
            onClick={() => setActiveTab('library')}
          >
            Biblioteca
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuários
          </button>
        </div>

        {activeTab === 'cycles' && (
          <div className={styles.content}>
            <div className={styles.header}>
              <h2>Ciclos</h2>
              <button
                className={styles.addButton}
                onClick={() => setShowCycleForm(!showCycleForm)}
              >
                + Novo Ciclo
              </button>
            </div>

            {showCycleForm && (
              <form onSubmit={handleCreateCycle} className={styles.form}>
                <input
                  type="text"
                  placeholder="Nome do ciclo"
                  value={cycleForm.name}
                  onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={cycleForm.description}
                  onChange={(e) => setCycleForm({ ...cycleForm, description: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="URL da imagem de capa"
                  value={cycleForm.imageUrl}
                  onChange={(e) => setCycleForm({ ...cycleForm, imageUrl: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Ordem"
                  value={cycleForm.order}
                  onChange={(e) => setCycleForm({ ...cycleForm, order: parseInt(e.target.value) })}
                  required
                />
                <div className={styles.formActions}>
                  <button type="submit">Criar</button>
                  <button type="button" onClick={() => setShowCycleForm(false)}>Cancelar</button>
                </div>
              </form>
            )}

            <div className={styles.list}>
              {cycles.map((cycle) => (
                <div key={cycle.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h3>{cycle.name}</h3>
                    <p>{cycle.description}</p>
                    <button
                      className={styles.viewLessonsButton}
                      onClick={() => handleSelectCycle(cycle)}
                    >
                      Ver Tópicos
                    </button>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteCycle(cycle.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'topics' && selectedCycle && (
          <div className={styles.content}>
            <div className={styles.header}>
              <h2>Tópicos de {selectedCycle.name}</h2>
              <button
                className={styles.addButton}
                onClick={() => {
                  if (editingTopicId) {
                    handleCancelTopicEdit();
                  } else {
                    setShowTopicForm(!showTopicForm);
                  }
                }}
              >
                {editingTopicId ? 'Cancelar Edição' : '+ Novo Tópico'}
              </button>
            </div>

            {showTopicForm && (
              <form onSubmit={handleCreateTopic} className={styles.form}>
                <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
                  {editingTopicId ? 'Editar Tópico' : 'Novo Tópico'}
                </h4>
                <input
                  type="text"
                  placeholder="Nome do tópico"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="URL da imagem de capa"
                  value={topicForm.imageUrl}
                  onChange={(e) => setTopicForm({ ...topicForm, imageUrl: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Ordem"
                  value={topicForm.order}
                  onChange={(e) => setTopicForm({ ...topicForm, order: parseInt(e.target.value) || 0 })}
                  required
                />
                <div className={styles.formActions}>
                  <button type="submit">{editingTopicId ? 'Atualizar' : 'Criar'}</button>
                  <button type="button" onClick={handleCancelTopicEdit}>Cancelar</button>
                </div>
              </form>
            )}

            <div className={styles.list}>
              {topics.map((topic) => (
                <div key={topic.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h3>{topic.name}</h3>
                    <p>{topic.description}</p>
                    <button
                      className={styles.viewLessonsButton}
                      onClick={() => handleSelectTopic(topic)}
                    >
                      {selectedTopic?.id === topic.id ? 'Ocultar Aulas' : 'Ver Aulas'}
                    </button>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditTopic(topic)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteTopic(selectedCycle.id, topic.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTopic && selectedCycle && (
              <div className={styles.lessonsSection}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>Aulas de: {selectedTopic.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      if (editingLessonId) {
                        handleCancelEdit();
                      } else {
                        setShowLessonForm(!showLessonForm);
                        setShowBulkImport(false);
                      }
                    }}
                  >
                    {editingLessonId ? 'Cancelar Edição' : '+ Nova Aula'}
                  </button>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setShowBulkImport(!showBulkImport);
                      setShowLessonForm(false);
                      setEditingLessonId(null);
                    }}
                    style={{ background: 'var(--accent-secondary)' }}
                  >
                    📥 Importar Múltiplas Aulas
                  </button>
                </div>

                {showBulkImport && (
                  <div className={styles.form} style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>Importação em Massa de Aulas</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                      Cole os dados das aulas em formato JSON ou texto simples:
                    </p>
                    
                    <div style={{ marginBottom: '15px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--accent-primary)' }}>Formato JSON:</strong>
                      <pre style={{ marginTop: '8px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
{`[
  {
    "title": "Aula 1",
    "videoEmbed": "<iframe src='...'></iframe>",
    "pdfEmbed": "<iframe src='...'></iframe>",
    "order": 1
  },
  {
    "title": "Aula 2",
    "videoEmbed": "<iframe src='...'></iframe>",
    "order": 2
  }
]`}
                      </pre>
                      <strong style={{ color: 'var(--accent-primary)', display: 'block', marginTop: '12px' }}>Formato Texto (separado por |):</strong>
                      <pre style={{ marginTop: '8px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
{`Título da Aula 1 | <iframe src='...'></iframe> | <iframe src='...'></iframe> | 1
Título da Aula 2 | <iframe src='...'></iframe> | | 2`}
                      </pre>
                    </div>

                    <textarea
                      placeholder="Cole aqui os dados das aulas..."
                      value={bulkImportText}
                      onChange={(e) => setBulkImportText(e.target.value)}
                      rows={12}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                    />
                    <div className={styles.formActions} style={{ marginTop: '15px' }}>
                      <button 
                        type="button" 
                        onClick={handleBulkImport}
                        disabled={isImporting || !bulkImportText.trim()}
                        style={{ 
                          opacity: (isImporting || !bulkImportText.trim()) ? 0.6 : 1,
                          cursor: (isImporting || !bulkImportText.trim()) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isImporting ? '⏳ Importando...' : '✅ Importar Aulas'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowBulkImport(false);
                          setBulkImportText('');
                        }}
                        disabled={isImporting}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {showLessonForm && (
                  <form onSubmit={handleCreateLesson} className={styles.form}>
                    <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
                      {editingLessonId ? 'Editar Aula' : 'Nova Aula'}
                    </h4>
                    <input
                      type="text"
                      placeholder="Título da aula"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    />
                    <textarea
                      placeholder="Código iframe do vídeo (Google Drive)"
                      value={lessonForm.videoEmbed}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoEmbed: e.target.value })}
                      rows={3}
                    />
                    <textarea
                      placeholder="Código iframe do PDF (Google Drive)"
                      value={lessonForm.pdfEmbed}
                      onChange={(e) => setLessonForm({ ...lessonForm, pdfEmbed: e.target.value })}
                      rows={3}
                    />
                    <input
                      type="number"
                      placeholder="Ordem"
                      value={lessonForm.order}
                      onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 0 })}
                    />
                    <div className={styles.formActions}>
                      <button type="submit">{editingLessonId ? 'Atualizar' : 'Criar'}</button>
                      <button type="button" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                  </form>
                )}

                <div className={styles.list}>
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className={styles.item}>
                      <div className={styles.itemContent}>
                        <h4>{lesson.title || 'Sem título'}</h4>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditLesson(lesson)}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteLesson(selectedCycle.id, selectedTopic.id, lesson.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div className={styles.content}>
            <div className={styles.header}>
              <h2>Biblioteca</h2>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                className={styles.addButton}
                onClick={() => {
                  if (editingLibraryId) {
                    handleCancelLibraryEdit();
                  } else {
                    setShowLibraryForm(!showLibraryForm);
                    setShowBulkImportLibrary(false);
                  }
                }}
              >
                {editingLibraryId ? 'Cancelar Edição' : '+ Novo Livro'}
              </button>
              <button
                className={styles.addButton}
                onClick={() => {
                  setShowBulkImportLibrary(!showBulkImportLibrary);
                  setShowLibraryForm(false);
                  setEditingLibraryId(null);
                }}
                style={{ background: 'var(--accent-secondary)' }}
              >
                📥 Importar Múltiplos Livros
              </button>
            </div>

            {showBulkImportLibrary && (
              <div className={styles.form} style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>Importação em Massa de Livros</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                  Cole os dados dos livros em formato JSON ou texto simples. O nome da disciplina será usado para agrupar os livros:
                </p>
                
                <div style={{ marginBottom: '15px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>Formato JSON:</strong>
                  <pre style={{ marginTop: '8px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
{`[
  {
    "name": "Anatomia orientada para a clínica",
    "discipline": "Anatomia",
    "driveCode": "CODIGO_DO_DRIVE",
    "imageUrl": "https://..."
  },
  {
    "name": "Fisiologia Humana",
    "discipline": "Fisiologia",
    "driveCode": "CODIGO_DO_DRIVE"
  }
]`}
                  </pre>
                  <strong style={{ color: 'var(--accent-primary)', display: 'block', marginTop: '12px' }}>Formato Texto (separado por |):</strong>
                  <pre style={{ marginTop: '8px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
{`Nome do Livro | Disciplina | Código do Drive | URL Imagem (opcional)
Anatomia orientada para a clínica | Anatomia | CODIGO_DO_DRIVE | 
Fisiologia Humana | Fisiologia | CODIGO_DO_DRIVE | https://...`}
                  </pre>
                </div>

                <textarea
                  placeholder="Cole aqui os dados dos livros..."
                  value={bulkImportLibraryText}
                  onChange={(e) => setBulkImportLibraryText(e.target.value)}
                  rows={12}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
                <div className={styles.formActions} style={{ marginTop: '15px' }}>
                  <button 
                    type="button" 
                    onClick={handleBulkImportLibrary}
                    disabled={isImportingLibrary || !bulkImportLibraryText.trim()}
                    style={{ 
                      opacity: (isImportingLibrary || !bulkImportLibraryText.trim()) ? 0.6 : 1,
                      cursor: (isImportingLibrary || !bulkImportLibraryText.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isImportingLibrary ? '⏳ Importando...' : '✅ Importar Livros'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowBulkImportLibrary(false);
                      setBulkImportLibraryText('');
                    }}
                    disabled={isImportingLibrary}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {showLibraryForm && (
              <form onSubmit={handleCreateLibraryDocument} className={styles.form}>
                <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
                  {editingLibraryId ? 'Editar Livro' : 'Novo Livro'}
                </h4>
                <input
                  type="text"
                  placeholder="Nome do livro (ex: Anatomia orientada para a clínica)"
                  value={libraryForm.name}
                  onChange={(e) => setLibraryForm({ ...libraryForm, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Disciplina (ex: Anatomia)"
                  value={libraryForm.discipline}
                  onChange={(e) => setLibraryForm({ ...libraryForm, discipline: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Código do Google Drive ou URL completa"
                  value={libraryForm.driveCode}
                  onChange={(e) => handleDriveCodeChange(e.target.value)}
                  required
                />
                <input
                  type="url"
                  placeholder="URL da imagem personalizada (opcional - use se a miniatura não carregar)"
                  value={libraryForm.imageUrl}
                  onChange={(e) => setLibraryForm({ ...libraryForm, imageUrl: e.target.value })}
                />
                {(libraryForm.thumbnail || libraryForm.imageUrl) && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
                      Preview da capa:
                    </p>
                    <img 
                      src={libraryForm.imageUrl || libraryForm.thumbnail} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '120px', 
                        maxHeight: '180px', 
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className={styles.formActions}>
                  <button type="submit">{editingLibraryId ? 'Atualizar' : 'Criar'}</button>
                  <button type="button" onClick={handleCancelLibraryEdit}>Cancelar</button>
                </div>
              </form>
            )}

            <div className={styles.list}>
              {libraryDocuments.map((document) => (
                <div key={document.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h3>{document.name}</h3>
                    {document.discipline && (
                      <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
                        Disciplina: {document.discipline}
                      </p>
                    )}
                    <p className={styles.urlPreview}>
                      {document.driveCode ? `Código: ${document.driveCode}` : document.pdfUrl || 'Sem URL'}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditLibraryDocument(document)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteLibraryDocument(document.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.content}>
            <div className={styles.header}>
              <h2>Usuários</h2>
              <button
                className={styles.addButton}
                onClick={() => setShowUserForm(!showUserForm)}
              >
                + Novo Usuário
              </button>
            </div>

            {showUserForm && (
              <form onSubmit={handleCreateUser} className={styles.form}>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required
                  minLength={6}
                />
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={userForm.isAdmin}
                    onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
                  />
                  Administrador
                </label>
                <div className={styles.formActions}>
                  <button type="submit">Criar</button>
                  <button type="button" onClick={() => setShowUserForm(false)}>Cancelar</button>
                </div>
              </form>
            )}

            <div className={styles.list}>
              {users.map((user) => (
                <div key={user.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h3>{user.email}</h3>
                    <p>
                      {user.isAdmin && <span className={styles.badge}>Admin</span>}
                      {user.blocked && <span className={styles.badgeBlocked}>Bloqueado</span>}
                      {user.lastAccess && (
                        <span className={styles.lastAccess}>
                          Último acesso: {user.lastAccess.toDate?.().toLocaleString('pt-BR') || 'Nunca'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={user.blocked ? styles.unblockButton : styles.blockButton}
                      onClick={() => handleToggleBlock(user.id, user.blocked)}
                    >
                      {user.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
