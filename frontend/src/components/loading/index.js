import React from 'react';

import Modal from '../modal';

import styles from './styles.module.scss';

function Loading(props) {
  return (
    <Modal contentClass={styles.main}>
      <div className={styles.loader}>Loading</div>
    </Modal>
  );
}

export default Loading;

