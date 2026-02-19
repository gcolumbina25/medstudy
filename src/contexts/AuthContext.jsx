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
  serverTimestamp,
  setDoc
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
        try {
          // Buscar dados do usuário
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            // Verificar se usuário está bloqueado
            if (data.blocked) {
              await signOut(auth);
              alert('Sua conta foi bloqueada pelo administrador.');
              return;
            }
            
            // Atualizar último acesso
            try {
              await updateDoc(doc(db, 'users', user.uid), {
                lastAccess: serverTimestamp()
              });
            } catch (error) {
              console.warn('Não foi possível atualizar último acesso:', error);
            }
          } else {
            // Se o documento não existe, criar um básico
            console.warn('Documento do usuário não encontrado. Criando documento básico...');
            try {
              await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                isAdmin: false,
                blocked: false,
                createdAt: serverTimestamp(),
                lastAccess: serverTimestamp()
              });
              setUserData({
                email: user.email,
                isAdmin: false,
                blocked: false
              });
            } catch (error) {
              console.error('Erro ao criar documento do usuário:', error);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
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

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.blocked) {
          await signOut(auth);
          throw new Error('Sua conta foi bloqueada pelo administrador.');
        }
        // Update last login
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
          sessionToken: Date.now().toString()
        });
      } else {
        // Create a new document if it doesn't exist
        await setDoc(userDocRef, {
          email: user.email,
          isAdmin: false,
          blocked: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          sessionToken: Date.now().toString()
        });
      }
      return userCredential;
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
