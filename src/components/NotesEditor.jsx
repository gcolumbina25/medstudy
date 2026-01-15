import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import styles from './NotesEditor.module.css';

const NotesEditor = ({ userId, cycleId, topicId, lessonId }) => {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotes = async () => {
      try {
        const notesId = cycleId 
          ? `${userId}_${cycleId}_${topicId}_${lessonId}`
          : `${userId}_legacy_${topicId}_${lessonId}`;
        
        const notesRef = doc(db, 'userNotes', notesId);
        const notesDoc = await getDoc(notesRef);
        
        if (notesDoc.exists()) {
          setNotes(notesDoc.data().content || '');
          if (notesDoc.data().updatedAt) {
            setLastSaved(notesDoc.data().updatedAt.toDate());
          }
        }
      } catch (error) {
        console.error('Erro ao carregar anotações:', error);
      }
    };

    fetchNotes();
  }, [userId, cycleId, topicId, lessonId]);

  useEffect(() => {
    if (!userId || !notes) return;

    const saveTimeout = setTimeout(async () => {
      setSaving(true);
      try {
        const notesId = cycleId 
          ? `${userId}_${cycleId}_${topicId}_${lessonId}`
          : `${userId}_legacy_${topicId}_${lessonId}`;
        
        const notesRef = doc(db, 'userNotes', notesId);
        await setDoc(notesRef, {
          userId,
          cycleId: cycleId || 'legacy',
          topicId,
          lessonId,
          content: notes,
          updatedAt: serverTimestamp()
        }, { merge: true });

        setLastSaved(new Date());
      } catch (error) {
        console.error('Erro ao salvar anotações:', error);
      } finally {
        setSaving(false);
      }
    }, 1000); // Auto-save após 1 segundo de inatividade

    return () => clearTimeout(saveTimeout);
  }, [notes, userId, cycleId, topicId, lessonId]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={styles.notesEditor}>
      <div className={styles.notesHeader}>
        <span className={styles.saveStatus}>
          {saving ? (
            <span className={styles.saving}>Salvando...</span>
          ) : lastSaved ? (
            <span className={styles.saved}>
              ✓ Salvo em {formatDate(lastSaved)}
            </span>
          ) : (
            <span className={styles.unsaved}>Digite suas anotações...</span>
          )}
        </span>
      </div>
      
      <textarea
        className={styles.textarea}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Digite suas anotações aqui. Elas serão salvas automaticamente."
        rows={10}
      />
    </div>
  );
};

export default NotesEditor;
