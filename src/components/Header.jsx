import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img 
            src="https://i.ibb.co/sdNZm3Vg/Pavao.png" 
            alt="MedStudy Logo" 
            className={styles.logoIcon}
          />
          <h2>MedStudy</h2>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Início</Link>
          <Link to="/revisao" className={styles.navLink}>Revisão</Link>
          <Link to="/biblioteca" className={styles.navLink}>Biblioteca</Link>
          {userData?.isAdmin && (
            <Link to="/admin" className={styles.navLink}>Admin</Link>
          )}
        </nav>

        <div className={styles.userMenu}>
          <span className={styles.userName}>{currentUser?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
