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
        console.log('👤 E-mail do usuário autenticado:', user.email);
        
        // Verificar se o e-mail está na lista de permitidos
        const allowedEmailsRef = collection(db, 'allowedEmails');
        const q = query(allowedEmailsRef, where('email', '==', user.email));
        const allowedSnapshot = await getDocs(q);

        console.log('📧 Query executada - encontrados:', allowedSnapshot.size);
        console.log('📧 Detalhes da query:', {
          collection: 'allowedEmails',
          field: 'email',
          operator: '==',
          value: user.email
        });

        // Log detalhado dos documentos encontrados
        if (!allowedSnapshot.empty) {
          console.log('✅ Documentos encontrados:');
          allowedSnapshot.forEach((doc, index) => {
            const data = doc.data();
            console.log(`   Doc ${index + 1}:`, {
              id: doc.id,
              email: data.email,
              isAdmin: data.isAdmin,
              emailMatch: data.email === user.email,
              emailLowerMatch: data.email?.toLowerCase() === user.email?.toLowerCase()
            });
          });
        } else {
          console.log('❌ Nenhum documento encontrado na coleção allowedEmails');
          
          // Tentar buscar todos os e-mails para debug
          console.log('🔍 Buscando todos os e-mails permitidos para comparação...');
          try {
            const allEmailsSnapshot = await getDocs(allowedEmailsRef);
            console.log('📧 Total de e-mails na coleção:', allEmailsSnapshot.size);
            allEmailsSnapshot.forEach((doc) => {
              const data = doc.data();
              console.log('   -', data.email, '(ID:', doc.id + ')');
            });
          } catch (debugError) {
            console.error('❌ Erro ao buscar todos os e-mails:', debugError);
          }
        }

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
          console.log('📝 Registrando tentativa não autorizada para:', user.email);
          try {
            await addDoc(collection(db, 'unauthorizedAttempts'), {
              email: user.email,
              attemptedAt: new Date()
            });
            console.log('✅ Tentativa não autorizada registrada com sucesso');
          } catch (logError) {
            console.error('❌ Erro ao registrar tentativa não autorizada:', logError);
            console.error('Detalhes do erro:', logError.code, logError.message);
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
