import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Statistic from '../../components/Statistic/Statistic';
import styles from "./HomePage.module.scss";


const HomePage = () => {
  return (
    <div className={styles.container}>
         <Header />
         <Hero/>
         <Statistic/>
    </div>
  )
}

export default HomePage