import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login com o Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>
            <img 
              src="https://i.ibb.co/sdNZm3Vg/Pavao.png" 
              alt="MedStudy Logo" 
              className={styles.logoIcon}
            />
            MedStudy
          </h1>
          <p>Uma plataforma, muitas raízes!</p>
        </div>
        
        <div className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <button 
            onClick={handleGoogleSignIn}
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
