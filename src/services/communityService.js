import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, doc, runTransaction } from 'firebase/firestore';
import { db } from '../config/firebase';

const contentCollection = collection(db, 'community_content');

/**
 * Publica um novo conteúdo na coleção da comunidade.
 * @param {object} contentData - Os dados do conteúdo a ser publicado.
 * @param {object} user - O objeto do usuário que está publicando.
 * @returns {Promise<string>} O ID do documento recém-criado.
 */
export const publishContent = async (contentData, user) => {
  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const docRef = await addDoc(contentCollection, {
      ...contentData,
      author: {
        uid: user.uid,
        name: user.displayName || user.email,
        photoURL: user.photoURL
      },
      createdAt: serverTimestamp(),
      likes: [],
      likeCount: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao publicar conteúdo:", error);
    throw new Error('Não foi possível publicar o conteúdo.');
  }
};

/**
 * Escuta por atualizações em tempo real na coleção de conteúdos.
 * @param {function} callback - Função para ser chamada com os novos dados.
 * @returns {function} Uma função para cancelar a inscrição do listener.
 */
export const listenToContent = (callback) => {
  const q = query(contentCollection, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const content = [];
    querySnapshot.forEach((doc) => {
      content.push({ id: doc.id, ...doc.data() });
    });
    callback(content);
  }, (error) => {
    console.error("Erro ao escutar por conteúdo:", error);
  });

  return unsubscribe;
};

/**
 * Adiciona ou remove o like de um usuário em um conteúdo.
 * @param {string} contentId - O ID do conteúdo.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<void>}
 */
export const toggleLike = async (contentId, userId) => {
  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  const contentRef = doc(db, 'community_content', contentId);

  try {
    await runTransaction(db, async (transaction) => {
      const contentDoc = await transaction.get(contentRef);
      if (!contentDoc.exists()) {
        throw "Documento não existe!";
      }

      const data = contentDoc.data();
      const likes = data.likes || [];
      const userHasLiked = likes.includes(userId);

      let newLikes;
      if (userHasLiked) {
        newLikes = likes.filter(uid => uid !== userId);
      } else {
        newLikes = [...likes, userId];
      }

      transaction.update(contentRef, {
        likes: newLikes,
        likeCount: newLikes.length
      });
    });
  } catch (error) {
    console.error("Erro ao processar o like:", error);
    throw new Error("Não foi possível processar o like.");
  }
};
