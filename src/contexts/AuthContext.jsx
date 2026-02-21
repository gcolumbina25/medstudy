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
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log('📋 User data loaded:', data);
          setUserData(data);

          if (data.blocked) {
            console.log('🚫 User is blocked, signing out');
            await signOut(auth);
            return;
          }

          try {
            await updateDoc(userDocRef, { lastAccess: serverTimestamp() });
            console.log('✅ User access updated');
          } catch (error) {
            console.warn('⚠️ Could not update last access:', error);
          }
        } else {
          console.log('⚠️ User document not found');
          setUserData(null);
          
          // Só desconectar se não estamos no meio de uma verificação de autenticação
          if (!isVerifyingAuth) {
            console.log('🚨 Usuário sem documento válido - desconectando por segurança');
            await signOut(auth);
          } else {
            console.log('⏳ Aguardando verificação de autenticação...');
          }
        }
      } else {
        console.log('🚪 No user, clearing state');
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
      console.log('🏁 Auth state change complete');
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setIsVerifyingAuth(true);
    const provider = new GoogleAuthProvider();
    try {
      console.log('🔐 Iniciando login com Google...');
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log('✅ Login Google bem-sucedido para:', user.email);

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('👤 Usuário existente encontrado:', userData);
        if (userData.blocked) {
          console.log('🚫 Usuário bloqueado');
          await signOut(auth);
          throw new Error('Sua conta foi bloqueada pelo administrador.');
        }
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
        });
        console.log('✅ Login completo para usuário existente');
        return userCredential;
      } else {
        console.log('🆕 Usuário novo, verificando lista de emails permitidos...');
        // Verificar se o e-mail está na lista de permitidos
        const allowedEmailsRef = collection(db, 'allowedEmails');
        const q = query(allowedEmailsRef, where('email', '==', user.email));
        const allowedSnapshot = await getDocs(q);

        console.log('📧 Verificação de email - encontrados:', allowedSnapshot.size);

        if (!allowedSnapshot.empty) {
          console.log('✅ Email encontrado na lista permitida');
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
          console.log('✅ Novo usuário criado:', newUserData);

          // Atualizar o estado local com os dados do novo usuário IMEDIATAMENTE
          setUserData(newUserData);
          console.log('✅ Estado local atualizado com novo usuário');

          return userCredential;
        } else {
          console.log('❌ Email não encontrado na lista permitida');
          
          // REGISTRAR TENTATIVA NÃO AUTORIZADA
          console.log('📝 Registrando tentativa não autorizada...');
          try {
            await addDoc(collection(db, 'unauthorizedAttempts'), {
              email: user.email,
              uid: user.uid,
              displayName: user.displayName,
              attemptedAt: serverTimestamp(),
              ipAddress: null, // Pode ser capturado no backend se necessário
              userAgent: navigator.userAgent
            });
            console.log('✅ Tentativa não autorizada registrada');
          } catch (logError) {
            console.warn('⚠️ Não foi possível registrar tentativa:', logError);
          }
          
          // DESCONECTAR IMEDIATAMENTE por segurança
          console.log('🚨 Desconectando usuário não autorizado...');
          setIsVerifyingAuth(false);
          await signOut(auth);
          throw new Error('Usuário não cadastrado na plataforma. Por favor, entre em contato com o administrador.');
        }
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setIsVerifyingAuth(false);
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
    loading,
    isVerifyingAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
