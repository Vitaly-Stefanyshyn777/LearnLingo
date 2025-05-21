import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";
import logo from "../../assets/ukraine.png";
import logo2x from "../../assets/ukraine@2x.png";

const Logo = () => {
  return (
    <Link to="/" className={styles.logoContainer}>
      <img src={logo} 
          srcSet={`${logo} 1x, ${logo2x} 2x`}  alt="LearnLingo Logo" className={styles.logoImage} />
      <span className={styles.logoText}>LearnLingo</span>
    </Link>
  );
};

export default Logo;
