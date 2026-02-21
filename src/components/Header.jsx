import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <img 
            src="https://i.ibb.co/sdNZm3Vg/Pavao.png" 
            alt="MedStudy Logo" 
            className={styles.logoIcon}
          />
          <h2>MedStudy</h2>
        </Link>

        <button 
          className={styles.hamburger} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link to="/" className={styles.navLink} onClick={closeMenu}>Início</Link>
          <Link to="/revisao" className={styles.navLink} onClick={closeMenu}>Revisão</Link>
          <Link to="/biblioteca" className={styles.navLink} onClick={closeMenu}>Biblioteca</Link>
          <Link to="/comunidade" className={styles.navLink} onClick={closeMenu}>Comunidade</Link>
          {userData?.isAdmin && (
            <Link to="/admin" className={styles.navLink} onClick={closeMenu}>Admin</Link>
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
