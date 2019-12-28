import React from 'react';
import styles from './styles.module.scss';

function Button(props) {
  const { 
    type,
    title,
    onClick,
    children, 
  } = props;
  return (
    <button title={title} type={type} onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
}

export default Button;
