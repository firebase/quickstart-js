import React from "react";
import styles from "./TopBar.module.css";
import firebaseIcon from "../../assets/firebase-icon.png";

const TopBar: React.FC = () => {
  return (
    <header className={styles.topBarContainer}>
      <div className={styles.leftSection}>
        <img
          src={firebaseIcon}
          alt="Firebase Logo"
          className={styles.logoImage}
          width="24"
          height="24"
        />
        <span className={styles.title}>Firebase AI SDK Sample</span>
      </div>
    </header>
  );
};

export default TopBar;
