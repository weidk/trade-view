import React from 'react';
import styles from './IRSMain.css';
import IRSNominalPrinciple from './IRSNominalPrinciple';
import IRSNominaDV01 from './IRSNominaDV01';

function IRSMain() {
  return (
    <div className={styles.normal}>
      <IRSNominalPrinciple />
      <IRSNominaDV01 />
    </div>
  );
}

export default IRSMain;
