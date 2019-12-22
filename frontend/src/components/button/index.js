import React from 'react';
import styles from './styles.module.scss';

function Button(props) {
  const { 
    type,
    onClick,
    children, 
  } = props;
  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
}

export default Button;
