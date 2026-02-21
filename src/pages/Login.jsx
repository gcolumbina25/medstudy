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
      console.log('🔐 Iniciando tentativa de login...');
      await signInWithGoogle();
      console.log('✅ Login bem-sucedido, redirecionando...');
      navigate('/');
    } catch (err) {
      console.error('❌ Erro capturado no Login:', err);
      const errorMessage = err.message || 'Erro ao fazer login com o Google.';
      setError(errorMessage);
      
      // Mostrar popup de erro com destaque para segurança
      if (errorMessage.includes('não cadastrado') || errorMessage.includes('não encontrado') || errorMessage.includes('não permitido')) {
        window.alert(`🚫 ACESSO NEGADO - SEGURANÇA ATIVA\n\n${errorMessage}\n\nEsta plataforma possui controle de acesso rigoroso.\n\n📧 Entre em contato com o administrador para solicitar credenciais de acesso.`);
      } else {
        window.alert(`❌ ERRO NO LOGIN\n\n${errorMessage}\n\nTente novamente ou entre em contato com o suporte.`);
      }
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
          {error && (
            <div className={`${styles.error} ${error.includes('não cadastrado') || error.includes('não encontrado') ? styles.securityError : ''}`}>
              <div className={styles.errorIcon}>
                {error.includes('não cadastrado') || error.includes('não encontrado') ? '🚫' : '❌'}
              </div>
              <div className={styles.errorContent}>
                <strong>
                  {error.includes('não cadastrado') || error.includes('não encontrado') 
                    ? 'ACESSO NEGADO - SEGURANÇA ATIVA' 
                    : 'ERRO NO LOGIN'}
                </strong>
                <p>{error}</p>
                {(error.includes('não cadastrado') || error.includes('não encontrado')) && (
                  <p className={styles.securityNote}>
                    <small>📧 Entre em contato com o administrador para solicitar credenciais de acesso.</small>
                  </p>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={handleGoogleSignIn}
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </button>
          <p className={styles.loginDisclaimer}>
            Toque no botão para entrar com sua conta Google.
            <br />
            Não tem acesso ainda? Fale com o administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
