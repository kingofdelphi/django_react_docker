import React from 'react';
import styles from './styles.module.scss';

function Button(props) {
  const { 
    type,
    title,
    className,
    onClick,
    children, 
  } = props;
  const classes = [styles.button, className].join(' ');
  return (
    <button className={classes} title={title} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
