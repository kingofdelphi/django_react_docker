import React from 'react';
import styles from './styles.module.scss';

function Input(props) {
  const { 
    id,
    label,
    type,
    value,
    onChange,
  } = props;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input 
        id={id} 
        type={type}
        value={value}
        onChange={onChange} 
        className={styles.input} 
      />
    </>
  );
}

export default Input;

