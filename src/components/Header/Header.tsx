import { useState, useEffect } from "react";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
import styles from "./Header.module.scss";
import Logo from "../Logo/Logo";
import logInIcon1x from "../../assets/log-in-01.png";
import logInIcon2x from "../../assets/log-in-01@2x.png";
import RegistrationModal from "../Modal/RegistrationModal/RegistrationModal";
import LoginModal from "../Modal/LoginModal/LoginModal";
import { Link } from "react-router-dom";

const Header = () => {
  const [modal, setModal] = useState(null); 
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); 
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!modal) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") setModal(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modal]);

  const toggleModal = (type) => setModal((prev) => (prev === type ? null : type));

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <nav className={styles.nav}>
  <Link to="/" className={styles.navLink}>Home</Link>
  <Link to="/teachers" className={styles.navLink}>Teachers</Link>
  {user && ( 
    <Link to="/favorites" className={styles.navLink}>Favorites</Link>
  )}
</nav>

      <div className={styles.buttonContainer}>
        {user ? (
          
          <button className={styles.logoutButton} onClick={handleLogout}>
            <img 
                src={logInIcon1x} 
                srcSet={`${logInIcon1x} 1x, ${logInIcon2x} 2x`} 
                alt="Log in" 
                className={styles.icon} 
              />
            Log out
          </button>
        ) : (
          <>
            <button className={styles.loginButton} onClick={() => toggleModal("login")}>
              <img 
                src={logInIcon1x} 
                srcSet={`${logInIcon1x} 1x, ${logInIcon2x} 2x`} 
                alt="Log in" 
                className={styles.icon} 
              />
              Log in
            </button>
            <button className={styles.registerButton} onClick={() => toggleModal("register")}>
              Registration
            </button>
          </>
        )}
      </div>

      <LoginModal isOpen={modal === "login"} onClose={() => setModal(null)} />
      <RegistrationModal isOpen={modal === "register"} onClose={() => setModal(null)} />
    </header>
  );
};

export default Header;
