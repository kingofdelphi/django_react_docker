import React from 'react';
import styles from './styles.module.scss';

function Button(props) {
  const { children } = props;
  return (
    <button className={styles.button}>
      {children}
    </button>
  );
}

export default Button;
