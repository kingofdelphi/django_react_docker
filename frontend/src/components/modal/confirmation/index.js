import React from 'react';

import Modal from '..';
import Button from '../../button';

import styles from './styles.module.scss';

class ConfirmationModal extends React.PureComponent {
  render() {
    const {
      message,
      onSubmit,
      onCancel,
    } = this.props;
    return (
      <Modal>
        <div className={styles.main}>
          <label>{message}</label>
          <div>
            <Button onClick={onSubmit}>Yes</Button>
            <Button onClick={onCancel}>No</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ConfirmationModal;
