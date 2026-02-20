import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          if (data.blocked) {
            await signOut(auth);
            return;
          }

          try {
            await updateDoc(userDocRef, { lastAccess: serverTimestamp() });
          } catch (error) {
            console.warn('Não foi possível atualizar último acesso:', error);
          }
        } else {
          await signOut(auth);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.blocked) {
          await signOut(auth);
          throw new Error('Sua conta foi bloqueada pelo administrador.');
        }
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
        });
        return userCredential;
      } else {
        // Verificar se o e-mail está na lista de permitidos
        console.log('Verificando e-mail permitido para:', user.email);
        const allowedEmailsRef = collection(db, 'allowedEmails');
        const q = query(allowedEmailsRef, where('email', '==', user.email));
        const allowedSnapshot = await getDocs(q);
        
        console.log('Resultado da query allowedEmails:', allowedSnapshot.size, 'documentos encontrados');
        
        if (!allowedSnapshot.empty) {
          console.log('E-mail encontrado na lista de permitidos, criando usuário...');
          // E-mail está permitido, criar documento do usuário
          const emailData = allowedSnapshot.docs[0].data();
          const newUserData = {
            email: user.email,
            isAdmin: emailData.isAdmin || false,
            blocked: false,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          };
          
          await setDoc(userDocRef, newUserData);
          console.log('Documento do usuário criado com sucesso');
          
          // Atualizar o estado local com os dados do novo usuário
          setUserData(newUserData);
          
          return userCredential;
        } else {
          console.log('E-mail NÃO encontrado na lista de permitidos');
          await signOut(auth);
          throw new Error('Usuário não cadastrado na plataforma. Por favor, entre em contato com o administrador.');
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    userData,
    signInWithGoogle,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
