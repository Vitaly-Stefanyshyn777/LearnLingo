import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.scss";
import heroImage1x from "../../assets/hero-image.png";  
import heroImage2x from "../../assets/hero-image@2x.png";  

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/teachers"); 
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Unlock your potential with the best <span className={styles.highlight}>language</span> tutors
        </h1>
        <p className={styles.description}>
          Embark on an Exciting Language Journey with Expert Language Tutors. Elevate your language proficiency to new heights by connecting with highly qualified and experienced tutors.
        </p>
        <button className={styles.ctaButton} onClick={handleGetStarted}>
          Get started
        </button>
      </div>
      
      <div className={styles.imageContainer}>
        <img 
          src={heroImage1x} 
          srcSet={`${heroImage1x} 1x, ${heroImage2x} 2x`} 
          alt="Hero Illustration" 
          className={styles.heroImage} 
        />
      </div>
    </section>
  );
};

export default Hero;
