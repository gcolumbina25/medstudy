Animport { createContext, useContext, useEffect, useState } from 'react';
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
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          if (data.blocked) {
            await signOut(auth);
            // The user will be signed out, and this will trigger onAuthStateChanged again
            // which will lead to a clean state.
            return;
          }

          try {
            await updateDoc(userDocRef, { lastAccess: serverTimestamp() });
          } catch (error) {
            console.warn('Não foi possível atualizar último acesso:', error);
          }
        } else {
          // If user is authenticated in Firebase but not in our Firestore db,
          // it's an unauthorized user. Sign them out.
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
        // If the user document does not exist, they are not authorized.
        await signOut(auth); // Sign them out from Firebase Authentication
        throw new Error('Usuário não cadastrado na plataforma. Por favor, entre em contato com o administrador.');
      }
    } catch (error) {
      // This will catch the custom error thrown above and any other sign-in errors
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
