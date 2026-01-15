import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import StatusSelector from '../components/StatusSelector';
import NotesEditor from '../components/NotesEditor';
import styles from './LessonPage.module.css';

const LessonPage = () => {
  const { cycleId, topicId, lessonId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [topic, setTopic] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [status, setStatus] = useState('nao-assistido');
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Função para carregar uma aula específica
  const loadLesson = async (selectedLessonId) => {
    setIsTransitioning(true);
    
    try {
      let lessonDoc;
      if (cycleId) {
        lessonDoc = await getDoc(doc(db, 'cycles', cycleId, 'topics', topicId, 'lessons', selectedLessonId));
      } else {
        lessonDoc = await getDoc(doc(db, 'topics', topicId, 'lessons', selectedLessonId));
      }

      if (lessonDoc.exists()) {
        setLesson({ id: lessonDoc.id, ...lessonDoc.data() });
      }

      // Buscar status do usuário
      if (currentUser?.uid) {
        const progressId = cycleId 
          ? `${currentUser.uid}_${cycleId}_${topicId}_${selectedLessonId}`
          : `${currentUser.uid}_legacy_${topicId}_${selectedLessonId}`;
        
        const progressRef = doc(db, 'userProgress', progressId);
        const progressDoc = await getDoc(progressRef);
        
        if (progressDoc.exists()) {
          setStatus(progressDoc.data().status || 'nao-assistido');
        } else {
          setStatus('nao-assistido');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar aula:', error);
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Buscar todas as aulas e dados iniciais
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Buscar tópico e ciclo
        if (cycleId) {
          const topicDoc = await getDoc(doc(db, 'cycles', cycleId, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic({ id: topicDoc.id, ...topicDoc.data() });
          }

          const cycleDoc = await getDoc(doc(db, 'cycles', cycleId));
          if (cycleDoc.exists()) {
            setCycle({ id: cycleDoc.id, ...cycleDoc.data() });
          }

          // Buscar todas as aulas
          const lessonsRef = collection(db, 'cycles', cycleId, 'topics', topicId, 'lessons');
          const q = query(lessonsRef, orderBy('order', 'asc'));
          const lessonsSnapshot = await getDocs(q);
          
          const lessonsData = [];
          lessonsSnapshot.forEach((doc) => {
            lessonsData.push({ id: doc.id, ...doc.data() });
          });
          setAllLessons(lessonsData);

          // Buscar aula inicial
          const initialLesson = lessonsData.find(l => l.id === lessonId) || lessonsData[0];
          if (initialLesson) {
            await loadLesson(initialLesson.id);
          }
        } else {
          // Estrutura antiga (compatibilidade)
          const topicDoc = await getDoc(doc(db, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic({ id: topicDoc.id, ...topicDoc.data() });
          }

          const lessonsRef = collection(db, 'topics', topicId, 'lessons');
          const q = query(lessonsRef, orderBy('order', 'asc'));
          const lessonsSnapshot = await getDocs(q);
          
          const lessonsData = [];
          lessonsSnapshot.forEach((doc) => {
            lessonsData.push({ id: doc.id, ...doc.data() });
          });
          setAllLessons(lessonsData);

          const initialLesson = lessonsData.find(l => l.id === lessonId) || lessonsData[0];
          if (initialLesson) {
            await loadLesson(initialLesson.id);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleId, topicId, lessonId, currentUser]);

  const handleLessonClick = (selectedLessonId) => {
    loadLesson(selectedLessonId);
  };

  const handleStatusChange = async (newStatus) => {
    if (!currentUser?.uid || !lesson) return;

    try {
      const progressId = cycleId 
        ? `${currentUser.uid}_${cycleId}_${topicId}_${lesson.id}`
        : `${currentUser.uid}_legacy_${topicId}_${lesson.id}`;
      
      const progressRef = doc(db, 'userProgress', progressId);
      await setDoc(progressRef, {
        userId: currentUser.uid,
        cycleId: cycleId || 'legacy',
        topicId,
        lessonId: lesson.id,
        status: newStatus,
        updatedAt: new Date()
      }, { merge: true });

      setStatus(newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className={styles.error}>
        <p>Aula não encontrada</p>
        <button onClick={() => navigate(`/topico/${topicId}`)}>Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.lessonPage}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <button onClick={() => navigate('/')} className={styles.breadcrumbLink}>
            Início
          </button>
          <span> / </span>
          {cycle && (
            <>
              <button onClick={() => navigate(`/ciclo/${cycleId}`)} className={styles.breadcrumbLink}>
                {cycle.name}
              </button>
              <span> / </span>
            </>
          )}
          <button 
            onClick={() => cycleId ? navigate(`/ciclo/${cycleId}/topico/${topicId}`) : navigate(`/topico/${topicId}`)} 
            className={styles.breadcrumbLink}
          >
            {topic?.name || 'Tópico'}
          </button>
        </div>

        <div className={styles.container}>
          {/* Lado Esquerdo - Conteúdo da Aula */}
          <div className={`${styles.contentLeft} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
            {lesson && (
              <>
                <h1 className={styles.title}>{lesson.title}</h1>

                <div className={styles.statusSection}>
                  <h3>Status de Estudo</h3>
                  <StatusSelector 
                    currentStatus={status} 
                    onStatusChange={handleStatusChange}
                  />
                </div>

                {lesson.videoEmbed && lesson.videoEmbed.trim() && (
                  <div className={styles.videoSection}>
                    <h2>Vídeo</h2>
                    <div className={styles.videoContainer}>
                      <div 
                        className={styles.iframeWrapper}
                        dangerouslySetInnerHTML={{ __html: lesson.videoEmbed }}
                      />
                    </div>
                  </div>
                )}

                {lesson.pdfEmbed && lesson.pdfEmbed.trim() && (
                  <div className={styles.pdfSection}>
                    <h2>Material de Apoio (PDF)</h2>
                    <div className={styles.pdfContainer}>
                      <div 
                        className={styles.iframeWrapper}
                        dangerouslySetInnerHTML={{ __html: lesson.pdfEmbed }}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.notesSection}>
                  <h2>Minhas Anotações</h2>
                  <NotesEditor 
                    userId={currentUser?.uid}
                    cycleId={cycleId}
                    topicId={topicId}
                    lessonId={lesson.id}
                  />
                </div>
              </>
            )}
          </div>

          {/* Lado Direito - Lista de Aulas */}
          <div className={styles.contentRight}>
            <div className={styles.lessonsListContainer}>
              <h2 className={styles.lessonsListTitle}>Aulas</h2>
              <div className={styles.lessonsList}>
                {allLessons.map((l, index) => (
                  <button
                    key={l.id}
                    className={`${styles.lessonListItem} ${lesson?.id === l.id ? styles.active : ''}`}
                    onClick={() => handleLessonClick(l.id)}
                  >
                    <span className={styles.lessonNumber}>{index + 1}</span>
                    <span className={styles.lessonTitle}>{l.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
