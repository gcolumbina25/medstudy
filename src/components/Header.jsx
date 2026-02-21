import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((s) => !s);

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

        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <div className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link to="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/revisao" className={styles.navLink} onClick={() => setMenuOpen(false)}>Revisão</Link>
          <Link to="/biblioteca" className={styles.navLink} onClick={() => setMenuOpen(false)}>Biblioteca</Link>
          <Link to="/comunidade" className={styles.navLink} onClick={() => setMenuOpen(false)}>Comunidade</Link>
          {userData?.isAdmin && (
            <Link to="/admin" className={styles.navLink} onClick={() => setMenuOpen(false)}>Admin</Link>
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
