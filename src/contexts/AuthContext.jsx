import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  setDoc,
  collection,
  query,
  where,
  getDocs
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

  const login = async (email, password) => {
    try {
      // Fazer login primeiro
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar se documento do usuário existe
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Verificar se usuário está bloqueado
        if (userData.blocked) {
          await signOut(auth);
          throw new Error('Sua conta foi bloqueada pelo administrador.');
        }
        
        // Atualizar último login
        try {
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            lastLogin: serverTimestamp(),
            sessionToken: Date.now().toString()
          });
        } catch (error) {
          console.warn('Não foi possível atualizar último login:', error);
        }
      } else {
        // Criar documento básico se não existir
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            isAdmin: false,
            blocked: false,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            sessionToken: Date.now().toString()
          });
        } catch (error) {
          console.warn('Não foi possível criar documento do usuário:', error);
        }
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
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
