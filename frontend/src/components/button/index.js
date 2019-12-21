import React from 'react';
import styles from './styles.module.scss';

function Button(props) {
  const { 
    onClick,
    children, 
  } = props;
  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
}

export default Button;
